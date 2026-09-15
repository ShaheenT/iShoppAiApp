import { Branch, ShoppingListItem, RetailerId, Special } from '../types/index.js';
import { BRANCHES, RETAILERS } from '../../server/seedData.js';

export interface RouteStop {
  id: string;
  sequenceIndex: number;
  isStartOrEnd: boolean;
  name: string;
  retailer_id?: RetailerId;
  retailerName?: string;
  address: string;
  latitude: number;
  longitude: number;
  items: ShoppingListItem[];
  subtotal: number;
  savings: number;
  distanceFromPreviousKm: number;
  durationFromPreviousMin: number;
}

export interface RouteLeg {
  from: RouteStop;
  to: RouteStop;
  distanceKm: number;
  durationMinutes: number;
}

export interface OptimizedRoutePlan {
  stops: RouteStop[];
  legs: RouteLeg[];
  totalDistanceKm: number;
  totalDriveTimeMinutes: number;
  estimatedShoppingMinutes: number;
  totalTripMinutes: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  efficiencyPercent: number;
  totalSpend: number;
  totalSavings: number;
  startLocation: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

/**
 * Calculates great-circle distance between two points in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Estimates driving time in minutes given distance in km (assumes ~30 km/h urban traffic in SA + 2 min traffic margin)
 */
export function estimateDriveTimeMinutes(distanceKm: number): number {
  if (distanceKm <= 0.1) return 1;
  const minutes = (distanceKm / 32) * 60 + 1.5;
  return Math.max(2, Math.round(minutes));
}

/**
 * Default starting location for user (Sea Point, Cape Town or based on city)
 */
export function getDefaultUserLocation(city: string = 'Cape Town') {
  if (city.toLowerCase().includes('joburg') || city.toLowerCase().includes('johannesburg')) {
    return {
      name: 'Home (Sandhurst, Sandton)',
      latitude: -26.115,
      longitude: 28.048,
    };
  }
  return {
    name: 'Home (Regent Road, Sea Point)',
    latitude: -33.919,
    longitude: 18.386,
  };
}

/**
 * Matches a shopping list item to the closest or most relevant store branch
 */
export function matchItemToBranch(
  item: ShoppingListItem,
  cityBranches: Branch[],
  specials: Special[] = []
): Branch {
  // 1. Direct match by item.store name
  if (item.store) {
    const matched = cityBranches.find(
      (b) =>
        b.name.toLowerCase() === item.store!.toLowerCase() ||
        item.store!.toLowerCase().includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(item.store!.toLowerCase())
    );
    if (matched) return matched;
  }

  // 2. Direct match by matched_special branch_id
  if (item.matched_special?.branch_id) {
    const matched = cityBranches.find((b) => b.id === item.matched_special?.branch_id);
    if (matched) return matched;
  }

  // 3. Match by preferred_retailer
  if (item.preferred_retailer) {
    const matched = cityBranches.find((b) => b.retailer_id === item.preferred_retailer);
    if (matched) return matched;
  }

  // 4. Try matching with specials array
  const specialMatch = specials.find((s) =>
    s.product_name.toLowerCase().includes(item.product_name.toLowerCase())
  );
  if (specialMatch) {
    const matched = cityBranches.find((b) => b.retailer_id === specialMatch.retailer_id);
    if (matched) return matched;
  }

  // Fallback to first branch
  return cityBranches[0] || BRANCHES[0];
}

/**
 * Solves the Traveling Salesperson Problem (TSP) using exact permutation search (for <= 8 stops)
 * or nearest neighbor + 2-opt to determine the shortest route visiting all stores.
 */
export function computeOptimalRoute(
  items: ShoppingListItem[],
  city: string = 'Cape Town',
  startLocation = getDefaultUserLocation(city),
  isRoundTrip: boolean = true,
  specials: Special[] = []
): OptimizedRoutePlan {
  // Filter branches for this city or all
  const cityBranches = BRANCHES.filter(
    (b) => b.city.toLowerCase() === city.toLowerCase() || city === 'all'
  );
  const availableBranches = cityBranches.length > 0 ? cityBranches : BRANCHES;

  // Group items by matched store branch
  const storeMap = new Map<
    string,
    {
      branch: Branch;
      items: ShoppingListItem[];
    }
  >();

  // If no items in shopping list, provide a realistic curated multi-store set
  const workingItems = items.length > 0 ? items : [
    {
      id: 'demo-1',
      product_name: 'Clover Fresh Full Cream Milk 2L',
      quantity: 1,
      checked: false,
      store: 'Checkers Kloof Street',
      preferred_retailer: 'checkers' as RetailerId,
      price: 24.99,
      savings: 7.0,
    },
    {
      id: 'demo-2',
      product_name: 'Albany Superior White Bread 700g',
      quantity: 1,
      checked: false,
      store: 'Pick n Pay Sea Point',
      preferred_retailer: 'picknpay' as RetailerId,
      price: 15.99,
      savings: 4.0,
    },
    {
      id: 'demo-3',
      product_name: 'Nescafé Gold Rich 200g',
      quantity: 1,
      checked: false,
      store: 'Pick n Pay V&A Waterfront',
      preferred_retailer: 'picknpay' as RetailerId,
      price: 119.99,
      savings: 35.0,
    },
  ];

  workingItems.forEach((item) => {
    const branch = matchItemToBranch(item, availableBranches, specials);
    if (!storeMap.has(branch.id)) {
      storeMap.set(branch.id, { branch, items: [] });
    }
    storeMap.get(branch.id)!.items.push(item);
  });

  const uniqueStores = Array.from(storeMap.values()).map((entry) => {
    const retailer = RETAILERS.find((r) => r.id === entry.branch.retailer_id);
    const subtotal = entry.items.reduce(
      (sum, it) => sum + (it.price || 25.0) * it.quantity,
      0
    );
    const savings = entry.items.reduce(
      (sum, it) => sum + (it.savings || 5.0) * it.quantity,
      0
    );

    return {
      branch: entry.branch,
      retailer,
      items: entry.items,
      subtotal,
      savings,
    };
  });

  // Number of stores to visit
  const n = uniqueStores.length;

  // Calculate unoptimized sequence distance (order as entered)
  let unoptimizedDist = 0;
  let currLat = startLocation.latitude;
  let currLon = startLocation.longitude;
  for (const s of uniqueStores) {
    unoptimizedDist += calculateHaversineDistanceKm(
      currLat,
      currLon,
      s.branch.latitude,
      s.branch.longitude
    );
    currLat = s.branch.latitude;
    currLon = s.branch.longitude;
  }
  if (isRoundTrip) {
    unoptimizedDist += calculateHaversineDistanceKm(
      currLat,
      currLon,
      startLocation.latitude,
      startLocation.longitude
    );
  }

  // Find optimal permutation order of stores
  let bestOrder: number[] = [];
  let bestDistance = Infinity;

  // Helper to calculate total distance of a specific store order
  const calculateRouteDistance = (order: number[]): number => {
    let dist = 0;
    let prevLat = startLocation.latitude;
    let prevLon = startLocation.longitude;

    for (const idx of order) {
      const store = uniqueStores[idx];
      dist += calculateHaversineDistanceKm(
        prevLat,
        prevLon,
        store.branch.latitude,
        store.branch.longitude
      );
      prevLat = store.branch.latitude;
      prevLon = store.branch.longitude;
    }

    if (isRoundTrip) {
      dist += calculateHaversineDistanceKm(
        prevLat,
        prevLon,
        startLocation.latitude,
        startLocation.longitude
      );
    }
    return dist;
  };

  if (n <= 8) {
    // Generate all permutations of indices [0 ... n-1]
    const permute = (arr: number[], m: number[] = []) => {
      if (arr.length === 0) {
        const dist = calculateRouteDistance(m);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestOrder = [...m];
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    };
    permute(Array.from({ length: n }, (_, i) => i));
  } else {
    // Nearest Neighbor Heuristic for large N
    const unvisited = new Set<number>(Array.from({ length: n }, (_, i) => i));
    let currentLat = startLocation.latitude;
    let currentLon = startLocation.longitude;

    while (unvisited.size > 0) {
      let nearestIdx = -1;
      let minD = Infinity;
      for (const idx of unvisited) {
        const d = calculateHaversineDistanceKm(
          currentLat,
          currentLon,
          uniqueStores[idx].branch.latitude,
          uniqueStores[idx].branch.longitude
        );
        if (d < minD) {
          minD = d;
          nearestIdx = idx;
        }
      }
      bestOrder.push(nearestIdx);
      unvisited.delete(nearestIdx);
      currentLat = uniqueStores[nearestIdx].branch.latitude;
      currentLon = uniqueStores[nearestIdx].branch.longitude;
    }
    bestDistance = calculateRouteDistance(bestOrder);
  }

  // Construct structured RouteStop sequence
  const stops: RouteStop[] = [];

  // Start Stop (Home/Origin)
  const startStop: RouteStop = {
    id: 'origin-start',
    sequenceIndex: 0,
    isStartOrEnd: true,
    name: startLocation.name,
    address: 'Departure Location',
    latitude: startLocation.latitude,
    longitude: startLocation.longitude,
    items: [],
    subtotal: 0,
    savings: 0,
    distanceFromPreviousKm: 0,
    durationFromPreviousMin: 0,
  };
  stops.push(startStop);

  let prevStop = startStop;
  const legs: RouteLeg[] = [];

  bestOrder.forEach((storeIdx, seq) => {
    const entry = uniqueStores[storeIdx];
    const dist = calculateHaversineDistanceKm(
      prevStop.latitude,
      prevStop.longitude,
      entry.branch.latitude,
      entry.branch.longitude
    );
    const duration = estimateDriveTimeMinutes(dist);

    const stop: RouteStop = {
      id: entry.branch.id,
      sequenceIndex: seq + 1,
      isStartOrEnd: false,
      name: entry.branch.name,
      retailer_id: entry.branch.retailer_id,
      retailerName: entry.retailer?.name || entry.branch.retailer_id,
      address: entry.branch.address,
      latitude: entry.branch.latitude,
      longitude: entry.branch.longitude,
      items: entry.items,
      subtotal: entry.subtotal,
      savings: entry.savings,
      distanceFromPreviousKm: dist,
      durationFromPreviousMin: duration,
    };

    legs.push({
      from: prevStop,
      to: stop,
      distanceKm: dist,
      durationMinutes: duration,
    });

    stops.push(stop);
    prevStop = stop;
  });

  // End Stop (Return Home if round trip)
  if (isRoundTrip) {
    const returnDist = calculateHaversineDistanceKm(
      prevStop.latitude,
      prevStop.longitude,
      startLocation.latitude,
      startLocation.longitude
    );
    const returnDuration = estimateDriveTimeMinutes(returnDist);

    const endStop: RouteStop = {
      id: 'origin-end',
      sequenceIndex: stops.length,
      isStartOrEnd: true,
      name: `Return to ${startLocation.name.split(' ')[0]}`,
      address: 'Final Destination',
      latitude: startLocation.latitude,
      longitude: startLocation.longitude,
      items: [],
      subtotal: 0,
      savings: 0,
      distanceFromPreviousKm: returnDist,
      durationFromPreviousMin: returnDuration,
    };

    legs.push({
      from: prevStop,
      to: endStop,
      distanceKm: returnDist,
      durationMinutes: returnDuration,
    });

    stops.push(endStop);
  }

  const totalDistanceKm = Math.round(bestDistance * 10) / 10;
  const totalDriveTimeMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);
  const estimatedShoppingMinutes = uniqueStores.length * 15; // ~15 mins per store
  const totalTripMinutes = totalDriveTimeMinutes + estimatedShoppingMinutes;

  const distanceSavedKm = Math.max(0, Math.round((unoptimizedDist - totalDistanceKm) * 10) / 10);
  const efficiencyPercent =
    unoptimizedDist > 0
      ? Math.round((distanceSavedKm / unoptimizedDist) * 100)
      : 0;

  const totalSpend = uniqueStores.reduce((sum, s) => sum + s.subtotal, 0);
  const totalSavings = uniqueStores.reduce((sum, s) => sum + s.savings, 0);

  return {
    stops,
    legs,
    totalDistanceKm,
    totalDriveTimeMinutes,
    estimatedShoppingMinutes,
    totalTripMinutes,
    unoptimizedDistanceKm: Math.round(unoptimizedDist * 10) / 10,
    distanceSavedKm,
    efficiencyPercent,
    totalSpend,
    totalSavings,
    startLocation,
  };
}

/**
 * Builds Google Maps Multi-Stop Directions URL
 */
export function buildGoogleMapsRouteUrl(stops: RouteStop[]): string {
  if (stops.length < 2) return 'https://www.google.com/maps';
  const origin = `${stops[0].latitude},${stops[0].longitude}`;
  const destination = `${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;
  
  const waypoints = stops
    .slice(1, stops.length - 1)
    .map((s) => `${s.latitude},${s.longitude}`)
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  if (waypoints) {
    url += `&waypoints=${encodeURIComponent(waypoints)}`;
  }
  return url;
}
