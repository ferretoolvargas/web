import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private storage = inject(StorageService);
  private readonly dataKeys = [
    'fv-products',
    'fv-offers',
    'fv-promotions',
    'fv-admin-catalogs',
  ] as const;

  reset(): void {
    this.storage.removeMany(this.dataKeys);
  }
}
