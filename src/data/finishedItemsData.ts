import { Special, Category, RetailerId, DeliveryTier } from '../types/index.js';

export interface FinishedPantryItemPreset {
  id: string;
  product_name: string;
  brand: string;
  unit_size: string;
  category: Category;
  container_type: string;
  barcode: string;
  image_url: string;
  icon: string;
  best_deal: {
    retailer_id: RetailerId;
    retailer_name: string;
    branch_name: string;
    price: number;
    original_price: number;
    savings: number;
  };
  other_retailers: {
    retailer_name: string;
    price: number;
  }[];
}

export const COMMON_FINISHED_ITEMS: FinishedPantryItemPreset[] = [
  {
    id: 'fin-milk',
    product_name: 'Clover Fresh Full Cream Milk 2L',
    brand: 'Clover',
    unit_size: '2L',
    category: 'Groceries',
    container_type: 'Empty Milk Plastic Bottle',
    barcode: '6001000001015',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    icon: '🥛',
    best_deal: {
      retailer_id: 'checkers',
      retailer_name: 'Checkers',
      branch_name: 'Checkers Kloof Street',
      price: 27.99,
      original_price: 34.99,
      savings: 7.0,
    },
    other_retailers: [
      { retailer_name: 'Pick n Pay', price: 29.99 },
      { retailer_name: 'Woolworths', price: 33.99 },
    ],
  },
  {
    id: 'fin-bread',
    product_name: 'Albany Superior Thick Sliced White Bread 700g',
    brand: 'Albany',
    unit_size: '700g',
    category: 'Groceries',
    container_type: 'Finished Bread Packaging Bag',
    barcode: '6001007010454',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    icon: '🍞',
    best_deal: {
      retailer_id: 'picknpay',
      retailer_name: 'Pick n Pay',
      branch_name: 'Pick n Pay Sea Point',
      price: 15.99,
      original_price: 19.99,
      savings: 4.0,
    },
    other_retailers: [
      { retailer_name: 'Checkers', price: 17.49 },
      { retailer_name: 'Spar', price: 18.99 },
    ],
  },
  {
    id: 'fin-coffee',
    product_name: 'Nescafé Gold Rich & Smooth 200g',
    brand: 'Nescafé',
    unit_size: '200g',
    category: 'Groceries',
    container_type: 'Empty Glass Coffee Jar',
    barcode: '7613035123456',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    icon: '☕',
    best_deal: {
      retailer_id: 'picknpay',
      retailer_name: 'Pick n Pay',
      branch_name: 'Pick n Pay V&A Waterfront',
      price: 119.99,
      original_price: 154.99,
      savings: 35.0,
    },
    other_retailers: [
      { retailer_name: 'Checkers', price: 129.99 },
      { retailer_name: 'Makro', price: 124.99 },
    ],
  },
  {
    id: 'fin-dishwash',
    product_name: 'Sunlight Dishwashing Liquid Lemon 750ml',
    brand: 'Sunlight',
    unit_size: '750ml',
    category: 'Household',
    container_type: 'Empty Green Squeeze Bottle',
    barcode: '6001087361234',
    image_url: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=400&q=80',
    icon: '🧴',
    best_deal: {
      retailer_id: 'checkers',
      retailer_name: 'Checkers',
      branch_name: 'Checkers Regent Road',
      price: 29.99,
      original_price: 39.99,
      savings: 10.0,
    },
    other_retailers: [
      { retailer_name: 'Pick n Pay', price: 34.99 },
      { retailer_name: 'Dis-Chem', price: 32.99 },
    ],
  },
  {
    id: 'fin-cereal',
    product_name: 'Bokomo Weet-Bix Wholegrain 450g',
    brand: 'Bokomo',
    unit_size: '450g',
    category: 'Groceries',
    container_type: 'Empty Cereal Box',
    barcode: '6001008003421',
    image_url: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=400&q=80',
    icon: '🥣',
    best_deal: {
      retailer_id: 'picknpay',
      retailer_name: 'Pick n Pay',
      branch_name: 'Pick n Pay Sea Point',
      price: 26.99,
      original_price: 33.99,
      savings: 7.0,
    },
    other_retailers: [
      { retailer_name: 'Checkers', price: 29.99 },
      { retailer_name: 'Woolworths', price: 32.99 },
    ],
  },
  {
    id: 'fin-beans',
    product_name: 'Koo Baked Beans in Tomato Sauce 410g',
    brand: 'Koo',
    unit_size: '410g',
    category: 'Groceries',
    container_type: 'Empty Tin Can',
    barcode: '6001024001235',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    icon: '🥫',
    best_deal: {
      retailer_id: 'checkers',
      retailer_name: 'Checkers',
      branch_name: 'Checkers Kloof Street',
      price: 13.99,
      original_price: 18.99,
      savings: 5.0,
    },
    other_retailers: [
      { retailer_name: 'Pick n Pay', price: 15.99 },
      { retailer_name: 'Shoprite', price: 14.5 },
    ],
  },
  {
    id: 'fin-eggs',
    product_name: 'Nulaid Extra Large Fresh Eggs 18-Pack',
    brand: 'Nulaid',
    unit_size: '18s',
    category: 'Groceries',
    container_type: 'Empty Egg Carton Tray',
    barcode: '6001087000123',
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    icon: '🥚',
    best_deal: {
      retailer_id: 'picknpay',
      retailer_name: 'Pick n Pay',
      branch_name: 'Pick n Pay V&A Waterfront',
      price: 49.99,
      original_price: 64.99,
      savings: 15.0,
    },
    other_retailers: [
      { retailer_name: 'Checkers', price: 54.99 },
      { retailer_name: 'Woolworths', price: 62.99 },
    ],
  },
  {
    id: 'fin-toothpaste',
    product_name: 'Colgate Total 12 Active Fresh Toothpaste 75ml',
    brand: 'Colgate',
    unit_size: '75ml',
    category: 'Household',
    container_type: 'Empty Squeezed Tube',
    barcode: '6001067890123',
    image_url: 'https://images.unsplash.com/photo-1559591937-e10b14c330df?auto=format&fit=crop&w=400&q=80',
    icon: '🪥',
    best_deal: {
      retailer_id: 'dischem',
      retailer_name: 'Dis-Chem',
      branch_name: 'Dis-Chem Sea Point',
      price: 24.99,
      original_price: 32.99,
      savings: 8.0,
    },
    other_retailers: [
      { retailer_name: 'Clicks', price: 27.99 },
      { retailer_name: 'Checkers', price: 29.99 },
    ],
  },
];

export interface DeliveryTierDetail {
  id: DeliveryTier;
  name: string;
  title: string;
  badge: string;
  badgeColor: string;
  deliveryTime: string;
  fee: number;
  highlight: string;
  description: string;
  features: string[];
}

export const DELIVERY_TIERS: DeliveryTierDetail[] = [
  {
    id: 'concierge_multistore',
    name: 'iShopp Smart Concierge (Split-Store)',
    title: 'Smart Multi-Store Saver',
    badge: 'Most Popular • Max Savings',
    badgeColor: 'bg-emerald-500 text-white',
    deliveryTime: '2 - 3 Hours (or Scheduled)',
    fee: 35.0,
    highlight: 'Save up to R75+ on grocery basket',
    description:
      'Our personal shoppers split your list between Checkers and Pick n Pay to get you the lowest specials on every item, consolidated into a single delivery.',
    features: [
      'Multi-store price optimization',
      'Consolidated single delivery to your door',
      'Best expiry dates hand-picked',
      'Real-time WhatsApp & in-app chat with shopper',
    ],
  },
  {
    id: 'ondemand_express',
    name: 'iShopp Express (60 Minutes)',
    title: 'Sixty60 & ASAP Instant',
    badge: 'Ultra Fast',
    badgeColor: 'bg-rose-500 text-white',
    deliveryTime: 'Under 60 Minutes',
    fee: 49.0,
    highlight: 'Dispatched immediately',
    description:
      'Need your groceries right now? Dispatched via our instant courier partner network from the single closest supermarket.',
    features: [
      'Dispatched within 5 minutes',
      'Arrives in under an hour',
      'Live GPS driver tracking',
      'Cooler bags for cold and frozen items',
    ],
  },
  {
    id: 'self_shopper',
    name: 'Self-Shop in Store (Smart Walk Route)',
    title: 'In-Store Walk & Navigate',
    badge: 'Zero Delivery Fee',
    badgeColor: 'bg-slate-900 text-white',
    deliveryTime: 'At your convenience',
    fee: 0.0,
    highlight: 'Save R0 delivery fee',
    description:
      'Walk into your local store with our GPS aisle navigator and interactive checklist to pick items yourself at peak savings.',
    features: [
      'Aisle-by-aisle optimal walking order',
      'Instant shelf verification barcode checker',
      'Trolley running total calculator',
      'No fees or surcharges',
    ],
  },
];
