import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  removeMany(keys: readonly string[]): void {
    for (const key of keys) this.remove(key);
  }
}
