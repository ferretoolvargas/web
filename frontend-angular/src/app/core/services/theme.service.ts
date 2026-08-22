import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private storage = inject(StorageService);
  readonly dark = signal(this.initial());
  constructor() {
    this.apply();
  }
  toggle(): void {
    this.dark.update((value) => !value);
    this.storage.set('fv-theme', this.dark() ? 'dark' : 'light');
    this.apply();
  }
  private initial(): boolean {
    const saved = this.storage.get<string>('fv-theme');
    return saved
      ? saved === 'dark'
      : (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  }
  private apply(): void {
    this.document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }
}
