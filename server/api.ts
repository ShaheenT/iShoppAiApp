import { Router, Request, Response } from 'express';
import {
  ScanImageRequestSchema,
  ShareDealRequestSchema,
  AssistantQuerySchema,
  OptimizeListSchema,
  Special,
} from '../src/types/index.js';
import {
  RETAILERS,
  BRANCHES,
  PRODUCTS,
  INITIAL_SPECIALS,
  PRICE_HISTORY,
  LEADERBOARD,
} from './seedData.js';
import { getSupabase, isSupabaseConfigured } from './supabase.js';
import { scanSpecialImage, askShoppingAssistant, scanPantryFinishedItem } from './gemini.js';

export const apiRouter = Router();

// In-memory persistent state ensuring uninterrupted real-time feed updates
let liveSpecials: Special[] = [...INITIAL_SPECIALS];
let userPoints: number = 250;
let userSavingsUnlocked: number = 340.0;

// Health Endpoint
apiRouter.get('/health', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  let dbStatus = 'connected_or_ready';
  let storageStatus = 'ready';

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('retailers').select('count', { count: 'exact', head: true });
      if (error) {
        dbStatus = 'connecting';
      } else {
        dbStatus = 'healthy';
      }
    } catch {
      dbStatus = 'degraded';
    }
  } else {
    dbStatus = 'local_resilient_store';
  }

  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'iShopp AI South Africa',
    database: dbStatus,
    auth: isSupabaseConfigured() ? 'supabase_auth' : 'local_ready',
    storage: storageStatus,
    gemini_ai: process.env.GEMINI_API_KEY ? 'configured' : 'pending_key',
    timestamp: new Date().toISOString(),
  });
});

// Snap / Upload Endpoint
apiRouter.post('/upload', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    // In production with Supabase Storage, upload to 'specials' bucket
    const supabase = getSupabase();
    let publicUrl = image;

    if (isSupabaseConfigured() && supabase && image.startsWith('data:')) {
      try {
        const base64Data = image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `special-${Date.now()}.jpg`;
        const { data, error } = await supabase.storage.from('specials').upload(filename, buffer, {
          contentType: mimeType || 'image/jpeg',
          upsert: true,
        });
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('specials').getPublicUrl(filename);
          publicUrl = publicUrlData.publicUrl;
        }
      } catch (uploadErr) {
        console.warn('Storage upload error, using direct image data:', uploadErr);
      }
    }

    res.json({
      success: true,
      imageUrl: publicUrl,
      id: `up-${Date.now()}`,
      status: 'uploaded',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// AI Scan Endpoint (Feature Two — AI Scan)
apiRouter.post('/scan', async (req: Request, res: Response) => {
  try {
    const parseResult = ScanImageRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.issues,
      });
    }

    const { imageUrl } = parseResult.data;
    const extracted = await scanSpecialImage(imageUrl);

    res.json({
      success: true,
      data: extracted,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Scan API error:', err);
    res.status(500).json({ error: 'AI Scanning failed', message: err.message });
  }
});

// Share Endpoint (Feature Three — Share / Publish Deal)
apiRouter.post('/share', async (req: Request, res: Response) => {
  try {
    const parseResult = ShareDealRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid deal data',
        details: parseResult.error.issues,
      });
    }

    const data = parseResult.data;
    const originalPrice = data.original_price || data.price * 1.25;
    const savings = Math.max(0, originalPrice - data.price);
    const savingsPercentage = Math.round((savings / originalPrice) * 100);

    const retailer = RETAILERS.find((r) => r.id === data.retailer_id) || RETAILERS[0];

    const newSpecial: Special = {
      id: `s-${Date.now()}`,
      product_id: `p-${Date.now()}`,
      product_name: data.product_name,
      brand: data.brand,
      unit_size: data.unit_size,
      category: data.category as any,
      branch_id: data.branch_id || 'b-pnp-vna',
      branch_name: data.branch_name || `${retailer.name} Nearby`,
      retailer_id: retailer.id,
      retailer_name: retailer.name,
      price: Number(data.price),
      original_price: Number(originalPrice.toFixed(2)),
      savings: Number(savings.toFixed(2)),
      savings_percentage: savingsPercentage,
      expires_at: data.expires_at || new Date(Date.now() + 6 * 86400000).toISOString(),
      confidence_score: data.confidence_score || 95,
      promotion_text: data.promotion_text || 'Community verified special',
      image_url: data.image_url,
      user_id: data.user_id || 'u-current',
      user_name: data.user_name || 'You (Deal Hunter)',
      user_reputation: 150,
      created_at: 'Just now',
      verified_count: 1,
      distance_km: 1.2,
    };

    // Insert to head of feed
    liveSpecials.unshift(newSpecial);

    // Gamification points boost
    userPoints += 50;
    userSavingsUnlocked += savings;

    // Try Supabase insert if connected
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('specials').insert({
          retailer_id: newSpecial.retailer_id,
          price: newSpecial.price,
          original_price: newSpecial.original_price,
          confidence_score: newSpecial.confidence_score,
          promotion_text: newSpecial.promotion_text,
          image_url: newSpecial.image_url,
          user_name: newSpecial.user_name,
        });
      } catch (dbErr) {
        console.warn('Supabase sync warning:', dbErr);
      }
    }

    res.status(201).json({
      success: true,
      deal: newSpecial,
      pointsEarned: 50,
      totalPoints: userPoints,
      totalSavingsUnlocked: userSavingsUnlocked,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to publish deal', message: err.message });
  }
});

// Live Feed Endpoint
apiRouter.get('/feed', (req: Request, res: Response) => {
  const { retailer, category, sort } = req.query;

  let filtered = [...liveSpecials];

  if (retailer && retailer !== 'all') {
    filtered = filtered.filter((s) => s.retailer_id === retailer);
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((s) => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (sort === 'savings') {
    filtered.sort((a, b) => b.savings - a.savings);
  } else if (sort === 'distance') {
    filtered.sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
  } else if (sort === 'price') {
    filtered.sort((a, b) => a.price - b.price);
  }

  res.json({
    success: true,
    count: filtered.length,
    specials: filtered,
    userStats: {
      points: userPoints,
      savingsUnlocked: userSavingsUnlocked,
    },
  });
});

// Products & Price Intelligence Endpoint (Feature: Price History)
apiRouter.get('/products', (_req: Request, res: Response) => {
  res.json({
    success: true,
    products: PRODUCTS,
    priceHistory: PRICE_HISTORY,
  });
});

// Single Product Price History
apiRouter.get('/products/:id/history', (req: Request, res: Response) => {
  const history = PRICE_HISTORY[req.params.id] || [];
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  res.json({
    success: true,
    product,
    history,
  });
});

// Smart Search Endpoint
apiRouter.get('/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  if (!q) {
    return res.json({
      results: liveSpecials.slice(0, 5),
      trending: ['Milk 2L', 'Chicken Braai Pack', 'Coca-Cola', 'Jacobs Coffee', 'Pampers Size 4'],
    });
  }

  const results = liveSpecials.filter(
    (s) =>
      s.product_name.toLowerCase().includes(q) ||
      s.brand.toLowerCase().includes(q) ||
      s.retailer_name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );

  res.json({
    query: q,
    count: results.length,
    results,
    recommendation: results.length > 0 ? `Cheapest price found at ${results[0].retailer_name} for R${results[0].price}` : null,
  });
});

// Nearby Discovery Endpoint (Map)
apiRouter.get('/nearby', (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Cape Town';
  const cityBranches = BRANCHES.filter((b) => b.city.toLowerCase() === city.toLowerCase() || city === 'all');

  const branchesWithDeals = cityBranches.map((b) => {
    const deals = liveSpecials.filter((s) => s.branch_id === b.id || s.retailer_id === b.retailer_id);
    const retailer = RETAILERS.find((r) => r.id === b.retailer_id);
    return {
      ...b,
      retailer,
      active_deals_count: deals.length,
      top_deal: deals[0] || null,
    };
  });

  res.json({
    city,
    branches: branchesWithDeals,
    total_active_specials: liveSpecials.length,
  });
});

// AI Shopping Assistant Endpoint
apiRouter.post('/assistant', async (req: Request, res: Response) => {
  try {
    const parseResult = AssistantQuerySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const { query } = parseResult.data;
    const answer = await askShoppingAssistant(query, liveSpecials);

    res.json({
      query,
      answer,
      suggestedItems: ['Braai Boerewors', 'Clover Milk 2L', 'Coke 2L', 'Nulaid Extra Large Eggs'],
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Assistant failed', message: err.message });
  }
});

// Instant Shopping List Optimization Endpoint
apiRouter.post('/shopping-list/optimize', (req: Request, res: Response) => {
  try {
    const parseResult = OptimizeListSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Items list required' });
    }

    const { items } = parseResult.data;

    // Build smart route optimization
    const matchedItems = items.map((query) => {
      const match = liveSpecials.find((s) => s.product_name.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        return {
          query,
          matched: true,
          product_name: match.product_name,
          price: match.price,
          original_price: match.original_price,
          savings: match.savings,
          retailer_id: match.retailer_id,
          retailer_name: match.retailer_name,
          branch_name: match.branch_name,
        };
      }
      return {
        query,
        matched: false,
        product_name: query,
        price: 25.0,
        original_price: 25.0,
        savings: 0,
        retailer_id: 'checkers',
        retailer_name: 'Checkers',
        branch_name: 'Checkers Kloof Street',
      };
    });

    const totalSpend = matchedItems.reduce((acc, curr) => acc + curr.price, 0);
    const totalSavings = matchedItems.reduce((acc, curr) => acc + curr.savings, 0);

    res.json({
      items: matchedItems,
      total_spend: Number(totalSpend.toFixed(2)),
      total_savings: Number(totalSavings.toFixed(2)),
      recommended_route: [
        { store: 'Checkers Kloof Street', items: matchedItems.filter((i) => i.retailer_id === 'checkers').map((i) => i.product_name) },
        { store: 'Pick n Pay V&A Waterfront', items: matchedItems.filter((i) => i.retailer_id === 'picknpay').map((i) => i.product_name) },
      ].filter((s) => s.items.length > 0),
      summary: `Best route saves you R${totalSavings.toFixed(2)} compared to single-store buying!`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Optimization failed', message: err.message });
  }
});

// Scan Empty / Finished Item at Home (Pantry Scanner)
apiRouter.post('/shopping-list/scan-empty-item', async (req: Request, res: Response) => {
  try {
    const { image, mimeType, barcode } = req.body;
    if (!image && !barcode) {
      return res.status(400).json({ error: 'Image or barcode is required' });
    }

    const pantryResult = await scanPantryFinishedItem(image || '', mimeType);

    // Look for matching active specials in the live store database
    const matchedSpecial = liveSpecials.find(
      (s) =>
        s.product_name.toLowerCase().includes(pantryResult.product_name.toLowerCase()) ||
        pantryResult.product_name.toLowerCase().includes(s.product_name.toLowerCase()) ||
        (pantryResult.brand && s.brand.toLowerCase() === pantryResult.brand.toLowerCase())
    );

    const price = matchedSpecial ? matchedSpecial.price : pantryResult.estimated_price;
    const savings = matchedSpecial ? matchedSpecial.savings : pantryResult.estimated_savings;
    const store = matchedSpecial ? `${matchedSpecial.retailer_name} ${matchedSpecial.branch_name}` : pantryResult.recommended_retailer;

    const shoppingItem = {
      id: `pantry-${Date.now()}`,
      product_name: pantryResult.product_name,
      quantity: 1,
      checked: false,
      store,
      price,
      savings,
      scannedAtHome: true,
      category: pantryResult.category,
      unit_size: pantryResult.unit_size,
      matched_special: matchedSpecial || undefined,
      added_at: new Date().toISOString(),
    };

    res.json({
      success: true,
      pantry_item: pantryResult,
      shopping_item: shoppingItem,
      matched_deal: matchedSpecial ? true : false,
      message: `Identified ${pantryResult.product_name}. Lowest price R${price.toFixed(2)} at ${store}!`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Pantry item scan failed', message: err.message });
  }
});

// Grocery List Delivery & Fulfillment Dispatch Endpoint
apiRouter.post('/shopping-list/deliver', (req: Request, res: Response) => {
  try {
    const { items, address, phone, tier, deliveryTime } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'At least one shopping list item is required' });
    }

    const totalSpend = items.reduce((acc: number, curr: any) => acc + (curr.price || 25), 0);
    const totalSavings = items.reduce((acc: number, curr: any) => acc + (curr.savings || 0), 0);

    const deliveryFees: Record<string, number> = {
      self_shopper: 0,
      ondemand_express: 35.0,
      concierge_multistore: 49.0,
    };

    const fee = deliveryFees[tier] ?? 35.0;
    const orderId = `ISHOPP-${tier === 'concierge_multistore' ? 'VIP' : 'EXPRESS'}-${Math.floor(100000 + Math.random() * 900000)}`;

    const responseOrder = {
      id: orderId,
      tier: tier || 'ondemand_express',
      address: address || 'Sea Point, Cape Town',
      phone: phone || '+27 82 123 4567',
      deliveryTime: deliveryTime || 'Within 45-60 mins',
      itemsCount: items.length,
      totalSpend: Number(totalSpend.toFixed(2)),
      totalSavings: Number(totalSavings.toFixed(2)),
      deliveryFee: fee,
      grandTotal: Number((totalSpend + fee).toFixed(2)),
      status: 'confirmed',
      assignedShopper: tier === 'self_shopper' ? undefined : 'Sipho Ndlovu (iShopp Courier #412)',
      etaMinutes: tier === 'self_shopper' ? 0 : 52,
      storesCovered: Array.from(new Set(items.map((i: any) => i.store || 'Pick n Pay / Checkers'))),
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      order: responseOrder,
      message:
        tier === 'self_shopper'
          ? 'In-store shopping route generated with aisle checklists!'
          : `Grocery list submitted! Driver assigned. Estimated arrival: 45-60 mins.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Delivery submission failed', message: err.message });
  }
});

// Community Verify Deal Endpoint
apiRouter.post('/verify-deal', (req: Request, res: Response) => {
  const { special_id } = req.body;
  const special = liveSpecials.find((s) => s.id === special_id);
  if (special) {
    special.verified_count += 1;
    userPoints += 10;
    return res.json({
      success: true,
      verified_count: special.verified_count,
      pointsEarned: 10,
      totalPoints: userPoints,
    });
  }
  res.status(404).json({ error: 'Special not found' });
});

// Leaderboard Endpoint
apiRouter.get('/leaderboard', (_req: Request, res: Response) => {
  res.json({
    success: true,
    leaderboard: LEADERBOARD,
    currentUser: {
      rank: 12,
      points: userPoints,
      savingsUnlocked: userSavingsUnlocked,
      badge: 'Deal Hunter',
    },
  });
});
