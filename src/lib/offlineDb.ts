import { Special, ShoppingListItem } from '../types/index.js';

const DB_NAME = 'ishopp_offline_db';
const DB_VERSION = 1;

export interface OfflineMetadata {
  key: string;
  value: any;
  updatedAt: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  action: 'ADD_SHOPPING_ITEM' | 'TOGGLE_SHOPPING_ITEM' | 'REMOVE_SHOPPING_ITEM' | 'PUBLISH_DEAL' | 'VERIFY_DEAL';
  payload: any;
  timestamp: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initializes and returns a singleton connection to IndexedDB.
 * Handles schema creation for specials, shopping_list, sync_queue, and metadata.
 */
export function getOfflineDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Store specials collection
      if (!db.objectStoreNames.contains('specials')) {
        const specialsStore = db.createObjectStore('specials', { keyPath: 'id' });
        specialsStore.createIndex('category', 'category', { unique: false });
        specialsStore.createIndex('retailer_id', 'retailer_id', { unique: false });
        specialsStore.createIndex('created_at', 'created_at', { unique: false });
      }

      // 2. Store shopping list items
      if (!db.objectStoreNames.contains('shopping_list')) {
        const listStore = db.createObjectStore('shopping_list', { keyPath: 'id' });
        listStore.createIndex('checked', 'checked', { unique: false });
        listStore.createIndex('added_at', 'added_at', { unique: false });
      }

      // 3. Offline action queue for background sync
      if (!db.objectStoreNames.contains('sync_queue')) {
        const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 4. Metadata store (last sync times, stats)
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

// ==========================================
// STORE SPECIALS CACHING
// ==========================================

/**
 * Saves an array of store specials to IndexedDB.
 */
export async function saveOfflineSpecials(specials: Special[]): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['specials', 'metadata'], 'readwrite');
      const store = tx.objectStore('specials');
      const metaStore = tx.objectStore('metadata');

      // Put each special into the store
      specials.forEach((special) => {
        store.put(special);
      });

      // Update metadata
      metaStore.put({
        key: 'last_specials_sync',
        value: new Date().toISOString(),
        count: specials.length,
        updatedAt: new Date().toISOString(),
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save specials to IndexedDB fallback:', err);
    try {
      localStorage.setItem('ishopp_specials_cache', JSON.stringify(specials));
    } catch {}
  }
}

/**
 * Retrieves all stored specials from IndexedDB.
 */
export async function getOfflineSpecials(): Promise<Special[]> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('specials', 'readonly');
      const store = tx.objectStore('specials');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to read specials from IndexedDB, trying localStorage:', err);
    try {
      const cached = localStorage.getItem('ishopp_specials_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
}

/**
 * Adds or updates a single special in IndexedDB (e.g. freshly scanned deal).
 */
export async function putOfflineSpecial(special: Special): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('specials', 'readwrite');
      const store = tx.objectStore('specials');
      store.put(special);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to put single special in IndexedDB:', err);
  }
}

// ==========================================
// SHOPPING LIST CACHING
// ==========================================

/**
 * Saves the entire shopping list to IndexedDB.
 */
export async function saveOfflineShoppingList(items: ShoppingListItem[]): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['shopping_list', 'metadata'], 'readwrite');
      const store = tx.objectStore('shopping_list');
      const metaStore = tx.objectStore('metadata');

      // Clear old entries and rewrite fresh state
      store.clear().onsuccess = () => {
        items.forEach((item) => store.put(item));
        metaStore.put({
          key: 'last_shopping_list_sync',
          value: new Date().toISOString(),
          count: items.length,
          updatedAt: new Date().toISOString(),
        });
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save shopping list to IndexedDB, fallback to localStorage:', err);
    try {
      localStorage.setItem('ishopp_shopping_list_cache', JSON.stringify(items));
    } catch {}
  }
}

/**
 * Retrieves the shopping list from IndexedDB.
 */
export async function getOfflineShoppingList(): Promise<ShoppingListItem[]> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('shopping_list', 'readonly');
      const store = tx.objectStore('shopping_list');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to read shopping list from IndexedDB, checking localStorage:', err);
    try {
      const cached = localStorage.getItem('ishopp_shopping_list_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
}

/**
 * Adds or updates a single shopping list item in IndexedDB.
 */
export async function putOfflineShoppingItem(item: ShoppingListItem): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('shopping_list', 'readwrite');
      const store = tx.objectStore('shopping_list');
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to put shopping item in IndexedDB:', err);
  }
}

/**
 * Deletes an item from the shopping list in IndexedDB.
 */
export async function deleteOfflineShoppingItem(id: string): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('shopping_list', 'readwrite');
      const store = tx.objectStore('shopping_list');
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to delete shopping item in IndexedDB:', err);
  }
}

// ==========================================
// OFFLINE SYNC QUEUE
// ==========================================

/**
 * Queues an action taken while offline (e.g. verifying a deal or adding item)
 * to be synced when the network reconnects.
 */
export async function enqueueOfflineSync(
  action: OfflineSyncQueueItem['action'],
  payload: any
): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const queueItem: OfflineSyncQueueItem = {
        id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        payload,
        timestamp: new Date().toISOString(),
      };
      store.put(queueItem);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to enqueue offline action:', err);
  }
}

/**
 * Retrieves all pending offline sync actions.
 */
export async function getOfflineSyncQueue(): Promise<OfflineSyncQueueItem[]> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Clears the offline sync queue once actions are successfully sent to the server.
 */
export async function clearOfflineSyncQueue(): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear sync queue:', err);
  }
}

// ==========================================
// METADATA HELPERS
// ==========================================

export async function getOfflineMetadata(key: string): Promise<any> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('metadata', 'readonly');
      const store = tx.objectStore('metadata');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function setOfflineMetadata(key: string, value: any): Promise<void> {
  try {
    const db = await getOfflineDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('metadata', 'readwrite');
      const store = tx.objectStore('metadata');
      store.put({
        key,
        value,
        updatedAt: new Date().toISOString(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to set metadata:', err);
  }
}
