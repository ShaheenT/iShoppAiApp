import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Navigation,
  MapPin,
  Clock,
  Car,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Layers,
  Store,
  Compass,
  Check,
} from 'lucide-react';
import { ShoppingListItem, Special, RetailerId } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';
import {
  computeOptimalRoute,
  RouteStop,
  OptimizedRoutePlan,
  buildGoogleMapsRouteUrl,
  getDefaultUserLocation,
} from '../utils/routeOptimizer.js';

interface RouteOptimizerViewProps {
  items: ShoppingListItem[];
  specials?: Special[];
  userCity?: string;
  onClose?: () => void;
  onToggleItemCheck?: (itemId: string) => void;
}

export const RouteOptimizerView: React.FC<RouteOptimizerViewProps> = ({
  items,
  specials = [],
  userCity = 'Cape Town',
  onClose,
  onToggleItemCheck,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Configuration state
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary'>('map');
  const [showSatelliteGrid, setShowSatelliteGrid] = useState(true);
  const [checkedItemIds, setCheckedItemIds] = useState<Set<string>>(new Set());

  // Available starting locations
  const startOptions = useMemo(() => [
    getDefaultUserLocation(userCity),
    {
      name: 'V&A Waterfront Marina',
      latitude: -33.905,
      longitude: 18.421,
    },
    {
      name: 'Gardens Centre, Cape Town',
      latitude: -33.935,
      longitude: 18.415,
    },
    {
      name: 'Claremont / Cavendish',
      latitude: -33.981,
      longitude: 18.465,
    },
  ], [userCity]);

  const [selectedStartLocation, setSelectedStartLocation] = useState(startOptions[0]);

  // Compute the optimal route plan whenever inputs change
  const routePlan: OptimizedRoutePlan = useMemo(() => {
    return computeOptimalRoute(
      items,
      userCity,
      selectedStartLocation,
      isRoundTrip,
      specials
    );
  }, [items, userCity, selectedStartLocation, isRoundTrip, specials]);

  // Handle local item checks
  const handleToggleCheck = (itemId: string) => {
    if (onToggleItemCheck) {
      onToggleItemCheck(itemId);
    }
    setCheckedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Render the D3 map visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean previous render

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create GeoJSON representation of stops and route lines for d3.geoMercator fitting
    const coordinates: [number, number][] = routePlan.stops.map((s) => [s.longitude, s.latitude]);

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        },
        ...routePlan.stops.map((s) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [s.longitude, s.latitude] as [number, number],
          },
          properties: { name: s.name },
        })),
      ],
    };

    // Calculate margins for badges and labels
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };

    // D3 Geo Mercator projection fitted strictly to all stops
    const projection = d3
      .geoMercator()
      .fitExtent(
        [
          [margin.left, margin.top],
          [width - margin.right, height - margin.bottom],
        ],
        geojson
      );

    // Zoom container
    const g = svg.append('g').attr('class', 'map-root-group');

    // Attach d3.zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 1. Map Grid & Coordinate Lines (Stylized Cartographic Canvas)
    const gridGroup = g.append('g').attr('class', 'carto-grid');

    // Background water/land ambient styling
    gridGroup
      .append('rect')
      .attr('x', -width * 2)
      .attr('y', -height * 2)
      .attr('width', width * 5)
      .attr('height', height * 5)
      .attr('fill', '#0B132B'); // Deep marine cartographic slate

    if (showSatelliteGrid) {
      // Radial distance rings around starting location
      const startCoord = projection([
        selectedStartLocation.longitude,
        selectedStartLocation.latitude,
      ]) || [width / 2, height / 2];

      [60, 130, 210, 310].forEach((r, idx) => {
        gridGroup
          .append('circle')
          .attr('cx', startCoord[0])
          .attr('cy', startCoord[1])
          .attr('r', r)
          .attr('fill', 'none')
          .attr('stroke', '#1E293B')
          .attr('stroke-dasharray', '3 4')
          .attr('stroke-width', 1);

        gridGroup
          .append('text')
          .attr('x', startCoord[0] + r + 4)
          .attr('y', startCoord[1] - 4)
          .attr('fill', '#475569')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .text(`${(idx + 1) * 2} km`);
      });

      // Subtle longitude & latitude grid
      for (let x = -width; x < width * 2; x += 80) {
        gridGroup
          .append('line')
          .attr('x1', x)
          .attr('y1', -height)
          .attr('x2', x)
          .attr('y2', height * 2)
          .attr('stroke', '#1E293B')
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.4);
      }
      for (let y = -height; y < height * 2; y += 80) {
        gridGroup
          .append('line')
          .attr('x1', -width)
          .attr('y1', y)
          .attr('x2', width * 2)
          .attr('y2', y)
          .attr('stroke', '#1E293B')
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.4);
      }
    }

    // 2. Projected coordinates for legs and stops
    const projectedStops = routePlan.stops.map((stop) => {
      const coords = projection([stop.longitude, stop.latitude]) || [0, 0];
      return {
        ...stop,
        x: coords[0],
        y: coords[1],
      };
    });

    // 3. Draw Route Legs (Curved Paths with D3)
    const routeGroup = g.append('g').attr('class', 'route-paths');

    // D3 Line Generator using Catmull-Rom spline for smooth road-like curves
    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Under-glow path
    routeGroup
      .append('path')
      .datum(projectedStops)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 8)
      .attr('stroke-opacity', 0.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGenerator);

    // Primary route line
    const mainPath = routeGroup
      .append('path')
      .datum(projectedStops)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 3.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGenerator);

    // Animated dashed direction line showing traversal order
    routeGroup
      .append('path')
      .datum(projectedStops)
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8 8')
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator)
      .attr('class', 'animate-route-flow');

    // 4. Distance & Drive Time Callouts at Midpoints of Legs
    const calloutGroup = g.append('g').attr('class', 'leg-callouts');

    for (let i = 0; i < projectedStops.length - 1; i++) {
      const p1 = projectedStops[i];
      const p2 = projectedStops[i + 1];
      const leg = routePlan.legs[i];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      // Pill group
      const pill = calloutGroup
        .append('g')
        .attr('transform', `translate(${midX}, ${midY})`)
        .attr('cursor', 'pointer');

      pill
        .append('rect')
        .attr('x', -46)
        .attr('y', -12)
        .attr('width', 92)
        .attr('height', 24)
        .attr('rx', 12)
        .attr('fill', '#0F172A')
        .attr('stroke', '#334155')
        .attr('stroke-width', 1.5)
        .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))');

      pill
        .append('text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#38BDF8')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'sans-serif')
        .text(`${leg ? leg.distanceKm : 1.2} km • ${leg ? leg.durationMinutes : 4}m`);
    }

    // 5. Store Nodes & Start/End Markers
    const nodesGroup = g.append('g').attr('class', 'route-nodes');

    projectedStops.forEach((stop) => {
      const isSelected = selectedStopId === stop.id;
      const nodeG = nodesGroup
        .append('g')
        .attr('transform', `translate(${stop.x}, ${stop.y})`)
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedStopId(stop.id);
        });

      if (stop.isStartOrEnd) {
        // Pulse ring around start/end
        nodeG
          .append('circle')
          .attr('r', 22)
          .attr('fill', '#10B981')
          .attr('opacity', 0.25)
          .attr('class', 'animate-ping')
          .style('animation-duration', '3s');

        // Center circle
        nodeG
          .append('circle')
          .attr('r', 16)
          .attr('fill', '#10B981')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 2.5);

        // Icon representation (Home or Flag)
        nodeG
          .append('text')
          .attr('x', 0)
          .attr('y', 4.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '11px')
          .attr('font-weight', 'black')
          .text(stop.sequenceIndex === 0 ? '⌂' : '🏁');

        // Label Pill
        const labelG = nodeG.append('g').attr('transform', 'translate(0, 28)');

        labelG
          .append('rect')
          .attr('x', -54)
          .attr('y', -9)
          .attr('width', 108)
          .attr('height', 18)
          .attr('rx', 9)
          .attr('fill', '#0F172A')
          .attr('stroke', '#10B981')
          .attr('stroke-width', 1);

        labelG
          .append('text')
          .attr('x', 0)
          .attr('y', 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#E2E8F0')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text(stop.sequenceIndex === 0 ? 'Start (Home)' : 'Return Home');
      } else {
        // STORE NODE
        const retailer = RETAILERS.find((r) => r.id === stop.retailer_id);
        const color = retailer?.primaryColor || '#0284C7';

        // Outer glow if selected
        if (isSelected) {
          nodeG
            .append('circle')
            .attr('r', 28)
            .attr('fill', color)
            .attr('opacity', 0.4)
            .attr('class', 'animate-pulse');
        }

        // Store Pin circle
        nodeG
          .append('circle')
          .attr('r', isSelected ? 20 : 17)
          .attr('fill', color)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', isSelected ? 3 : 2)
          .attr('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))');

        // Store initial or icon
        const initial = stop.retailerName ? stop.retailerName.charAt(0) : 'S';
        nodeG
          .append('text')
          .attr('x', 0)
          .attr('y', 4.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '12px')
          .attr('font-weight', 'black')
          .text(initial);

        // Sequence badge on top-right (1, 2, 3...)
        const seqBadge = nodeG.append('g').attr('transform', 'translate(12, -12)');

        seqBadge
          .append('circle')
          .attr('r', 9)
          .attr('fill', '#F59E0B') // Bright Amber order indicator
          .attr('stroke', '#0F172A')
          .attr('stroke-width', 2);

        seqBadge
          .append('text')
          .attr('x', 0)
          .attr('y', 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#0F172A')
          .attr('font-size', '9px')
          .attr('font-weight', 'black')
          .text(stop.sequenceIndex);

        // Store Name & Item Count Pill Label
        const namePill = nodeG.append('g').attr('transform', 'translate(0, 30)');

        const nameLength = Math.min(stop.name.length * 5.5 + 34, 150);

        namePill
          .append('rect')
          .attr('x', -nameLength / 2)
          .attr('y', -10)
          .attr('width', nameLength)
          .attr('height', 20)
          .attr('rx', 10)
          .attr('fill', isSelected ? '#1E293B' : '#0F172A')
          .attr('stroke', isSelected ? color : '#334155')
          .attr('stroke-width', isSelected ? 2 : 1)
          .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))');

        namePill
          .append('text')
          .attr('x', 0)
          .attr('y', 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text(`${stop.name.split(' ')[0]} • ${stop.items.length} items`);
      }
    });

    // Reset zoom helper function attached to window/ref
    (svgRef.current as any).__resetZoom = () => {
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
    };
    (svgRef.current as any).__zoomIn = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    };
    (svgRef.current as any).__zoomOut = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    };
  }, [routePlan, selectedStopId, showSatelliteGrid, selectedStartLocation]);

  // Selected stop details
  const activeStop = routePlan.stops.find((s) => s.id === selectedStopId) || routePlan.stops[1] || routePlan.stops[0];

  return (
    <div
      id="route-optimizer-container"
      className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Multi-Store Route Optimizer
              </h2>
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                D3 Cartographic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimized traveling sequence to fulfill your grocery list with minimum driving distance
            </p>
          </div>
        </div>

        {/* Global Controls & Google Maps Link */}
        <div className="flex items-center gap-2">
          <a
            href={buildGoogleMapsRouteUrl(routePlan.stops)}
            target="_blank"
            rel="noopener noreferrer"
            id="open-google-maps-btn"
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 hover:scale-102"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Turn-by-Turn GPS</span>
          </a>

          {onClose && (
            <button
              onClick={onClose}
              id="close-route-optimizer-btn"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* KPI Performance Bar: Distance, Time, Savings & Efficiency */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Route
              </div>
              <div className="font-black text-slate-100 text-sm">
                {routePlan.totalDistanceKm} km
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Drive Time
              </div>
              <div className="font-black text-slate-100 text-sm">
                ~{routePlan.totalDriveTimeMinutes} mins
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Route Efficiency
              </div>
              <div className="font-black text-emerald-400 text-sm">
                Saved {routePlan.distanceSavedKm} km ({routePlan.efficiencyPercent}%)
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Deals Unlocked
              </div>
              <div className="font-black text-rose-400 text-sm">
                Save R{routePlan.totalSavings.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher (Map vs Itinerary on Mobile) */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            D3 Map
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'itinerary'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Stop Itinerary ({routePlan.stops.length - (isRoundTrip ? 2 : 1)} stores)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Side-by-side or stacked */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: D3 Interactive Canvas */}
        <div
          ref={containerRef}
          className={`flex-1 relative bg-slate-950 overflow-hidden min-h-[340px] lg:min-h-0 ${
            activeTab === 'map' ? 'flex' : 'hidden lg:flex'
          } flex-col`}
        >
          {/* D3 SVG Container */}
          <svg
            ref={svgRef}
            id="d3-route-optimizer-svg"
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          />

          {/* D3 Map Canvas Overlay Controls */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {/* Origin Selector */}
            <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-2xl p-2.5 shadow-xl text-xs max-w-xs">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                Departure Origin
              </label>
              <select
                value={selectedStartLocation.name}
                onChange={(e) => {
                  const opt = startOptions.find((o) => o.name === e.target.value);
                  if (opt) setSelectedStartLocation(opt);
                }}
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                {startOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Round trip toggle */}
            <button
              onClick={() => setIsRoundTrip(!isRoundTrip)}
              className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRoundTrip ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{isRoundTrip ? 'Round Trip (Return Home)' : 'One-Way Trip'}</span>
            </button>
          </div>

          {/* Map Controls (Zoom +, -, Reset) */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-1.5 shadow-2xl">
            <button
              onClick={() => (svgRef.current as any)?.__zoomIn?.()}
              id="d3-zoom-in-btn"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => (svgRef.current as any)?.__zoomOut?.()}
              id="d3-zoom-out-btn"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => (svgRef.current as any)?.__resetZoom?.()}
              id="d3-zoom-reset-btn"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSatelliteGrid(!showSatelliteGrid)}
              id="d3-toggle-grid-btn"
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                showSatelliteGrid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Cartographic Grid"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Legend / Flow Indicator */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-2xl px-3.5 py-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Start/End</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Optimal Sequence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-white" />
              <span>Direction Flow</span>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Stop Itinerary & Store Shopping Cards */}
        <div
          className={`w-full lg:w-[420px] bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden ${
            activeTab === 'itinerary' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Itinerary Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
            <div>
              <h3 className="font-extrabold text-sm text-white">Optimal Visit Schedule</h3>
              <p className="text-xs text-slate-400">
                Sorted by distance & efficiency • Check items off in store
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-xl border border-slate-700">
              {routePlan.legs.length} Legs
            </span>
          </div>

          {/* Scrollable list of stops */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {routePlan.stops.map((stop, index) => {
              const isSelected = stop.id === activeStop.id;
              const retailer = RETAILERS.find((r) => r.id === stop.retailer_id);

              return (
                <div
                  key={`${stop.id}-${index}`}
                  id={`itinerary-stop-${index}`}
                  onClick={() => setSelectedStopId(stop.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Stop header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                          stop.isStartOrEnd
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {stop.isStartOrEnd ? (index === 0 ? 'S' : 'E') : stop.sequenceIndex}
                      </div>

                      <div>
                        <div className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
                          <span>{stop.name}</span>
                          {stop.items.length > 0 && (
                            <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-md">
                              {stop.items.length} items
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {stop.address}
                        </p>
                      </div>
                    </div>

                    {/* Leg distance info */}
                    {index > 0 && (
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-sky-400">
                          +{stop.distanceFromPreviousKm} km
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~{stop.durationFromPreviousMin} min
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items to buy at this stop */}
                  {stop.items.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Items to collect at this store:</span>
                        <span className="text-emerald-400">
                          Subtotal: R{stop.subtotal.toFixed(2)}
                        </span>
                      </div>

                      {stop.items.map((it) => {
                        const isChecked = checkedItemIds.has(it.id) || it.checked;
                        return (
                          <div
                            key={it.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCheck(it.id);
                            }}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                              isChecked
                                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                                : 'bg-slate-900 border-slate-800/90 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                    : 'border-slate-600'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span
                                className={`text-xs truncate ${
                                  isChecked ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {it.product_name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs shrink-0">
                              <span className="font-mono text-slate-300">
                                R{((it.price || 25.0) * it.quantity).toFixed(2)}
                              </span>
                              {it.savings && it.savings > 0 && (
                                <span className="text-[10px] font-bold text-emerald-400">
                                  -R{(it.savings * it.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Leg summary connector */}
                  {index < routePlan.stops.length - 1 && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <div className="h-px bg-slate-800 flex-1" />
                      <span>
                        Drive {routePlan.legs[index]?.distanceKm || 1.2} km to next stop
                      </span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Action Card */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Estimated Trip Time:</span>
              <span className="font-mono font-bold text-slate-200">
                {routePlan.totalDriveTimeMinutes}m drive + ~{routePlan.estimatedShoppingMinutes}m in-store
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Groceries Subtotal:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                R{routePlan.totalSpend.toFixed(2)} (Save R{routePlan.totalSavings.toFixed(2)})
              </span>
            </div>

            <a
              href={buildGoogleMapsRouteUrl(routePlan.stops)}
              target="_blank"
              rel="noopener noreferrer"
              id="itinerary-start-nav-btn"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Car className="w-4 h-4" />
              <span>Launch Multi-Stop GPS Navigation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
