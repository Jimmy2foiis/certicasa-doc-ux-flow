import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Local storage based cache utility for Catastro API requests
class CatastroCache {
  private cache: Record<string, any> = {};
  private readonly CACHE_PREFIX = "catastro_cache_";
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.loadCacheFromStorage();
  }

  // Load cache from localStorage
  private loadCacheFromStorage(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            if (item && item.expiry && item.expiry > Date.now()) {
              const cacheKey = key.replace(this.CACHE_PREFIX, "");
              this.cache[cacheKey] = item.data;
            } else {
              // Remove expired item
              localStorage.removeItem(key);
            }
          } catch (e) {
            console.error("Error parsing cache item:", e);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.error("Error loading cache from storage:", e);
    }
  }

  // Set cache item both in memory and localStorage
  set(key: string, value: any): void {
    try {
      this.cache[key] = value;
      
      const item = {
        data: value,
        expiry: Date.now() + this.CACHE_EXPIRY
      };
      
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(item));
    } catch (e) {
      console.error("Error setting cache item:", e);
    }
  }

  // Get cache item
  get(key: string): any {
    return this.cache[key] || null;
  }

  // Check if key exists in cache
  has(key: string): boolean {
    return key in this.cache;
  }

  // Clear entire cache or specific key
  clear(key?: string): void {
    try {
      if (key) {
        delete this.cache[key];
        localStorage.removeItem(this.CACHE_PREFIX + key);
      } else {
        this.cache = {};
        Object.keys(localStorage).forEach(storageKey => {
          if (storageKey.startsWith(this.CACHE_PREFIX)) {
            localStorage.removeItem(storageKey);
          }
        });
      }
    } catch (e) {
      console.error("Error clearing cache:", e);
    }
  }

  // Create a cache key from request parameters
  createCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
      
    return `${endpoint}_${sortedParams}`;
  }

  // Handle API response by storing in cache
  cacheResponse(key: string, data: any): any {
    this.set(key, data);
    return data;
  }

  // Attempt to fetch data from cache first, otherwise fetch from API
  async getOrFetch(key: string, fetchFn: () => Promise<any>): Promise<any> {
    try {
      // Check if data exists in cache
      if (this.has(key)) {
        console.log("Using cached data for:", key);
        return this.get(key);
      }
      
      // Otherwise fetch new data
      console.log("Fetching fresh data for:", key);
      const data = await fetchFn();
      return this.cacheResponse(key, data);
    } catch (error: any) {
      console.error("Error in getOrFetch:", error);
      // If there's a storage quota error, clear the cache and try again
      if (error instanceof Error && error.message.includes('exceeded')) {
        console.warn("Storage quota exceeded, clearing cache and retrying");
        this.clear();
        return fetchFn();
      }
      throw error;
    }
  }
  
  // Store coordinates for an address
  storeCoordinatesForAddress(address: string, coordinates: any): void {
    try {
      const key = `coordinates_${address.toLowerCase().replace(/\s+/g, '_')}`;
      this.set(key, coordinates);
    } catch (e) {
      console.error("Error storing coordinates:", e);
    }
  }
}

// Singleton instance
export const catastroCache = new CatastroCache();
