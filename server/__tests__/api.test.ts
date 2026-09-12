import { describe, it, expect } from 'vitest';
import {
  ScanImageRequestSchema,
  ShareDealRequestSchema,
  AssistantQuerySchema,
  OptimizeListSchema,
} from '../../src/types/index.js';
import { RETAILERS, PRODUCTS, INITIAL_SPECIALS, PRICE_HISTORY } from '../seedData.js';

describe('iShopp AI Data Models & Validation', () => {
  it('validates supported South African top retailers', () => {
    const retailerIds = RETAILERS.map((r) => r.id);
    expect(retailerIds).toContain('picknpay');
    expect(retailerIds).toContain('checkers');
    expect(retailerIds).toContain('shoprite');
    expect(retailerIds).toContain('woolworths');
    expect(retailerIds).toContain('spar');
    expect(retailerIds).toContain('boxer');
    expect(retailerIds).toContain('makro');
    expect(retailerIds).toContain('game');
    expect(retailerIds).toContain('dischem');
    expect(retailerIds).toContain('clicks');
  });

  it('validates ScanImageRequestSchema with valid payload', () => {
    const valid = {
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD',
      clientLocation: {
        latitude: -33.9249,
        longitude: 18.4241,
        city: 'Cape Town',
      },
    };
    const result = ScanImageRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects empty imageUrl in ScanImageRequestSchema', () => {
    const invalid = { imageUrl: '' };
    const result = ScanImageRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates ShareDealRequestSchema and calculates savings accurately', () => {
    const deal = {
      product_name: 'Coca-Cola 2L',
      brand: 'Coca-Cola',
      unit_size: '2L',
      category: 'Groceries',
      price: 19.99,
      original_price: 29.99,
      retailer_id: 'picknpay',
      image_url: 'https://images.unsplash.com/coke',
    };
    const result = ShareDealRequestSchema.safeParse(deal);
    expect(result.success).toBe(true);
    if (result.success) {
      const savings = (result.data.original_price || 0) - result.data.price;
      expect(savings).toBeCloseTo(10.0, 2);
    }
  });

  it('verifies Price Intelligence history structure matching Milk 2L specification', () => {
    const milkHistory = PRICE_HISTORY['p-milk-2l'];
    expect(milkHistory).toBeDefined();
    expect(milkHistory.length).toBeGreaterThanOrEqual(3);
    // Specification example: Monday R34, Tuesday R31, Friday R28
    const mondayEntry = milkHistory.find((p) => p.day_label === 'Monday');
    expect(mondayEntry?.price).toBe(34.0);
  });

  it('validates AssistantQuerySchema and OptimizeListSchema', () => {
    const query = {
      query: 'Where can I buy the cheapest braai meat today?',
      city: 'Cape Town',
    };
    expect(AssistantQuerySchema.safeParse(query).success).toBe(true);

    const list = {
      items: ['Milk', 'Eggs', 'Bread'],
      city: 'Cape Town',
    };
    expect(OptimizeListSchema.safeParse(list).success).toBe(true);
  });
});
