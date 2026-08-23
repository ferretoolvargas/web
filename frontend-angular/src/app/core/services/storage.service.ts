import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string): T | null {
    if (!this.browser) return null;

    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }
  set<T>(key: string, value: T): void {
    if (!this.browser) return;

    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    if (!this.browser) return;

    localStorage.removeItem(key);
  }
  removeMany(keys: readonly string[]): void {
    for (const key of keys) this.remove(key);
  }
}
