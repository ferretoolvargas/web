import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private storage = inject(StorageService);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly dark = signal(this.browser && this.initial());
  constructor() {
    this.apply();
  }
  toggle(): void {
    if (!this.browser) return;
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
    if (!this.browser) return;
    this.document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }
}
