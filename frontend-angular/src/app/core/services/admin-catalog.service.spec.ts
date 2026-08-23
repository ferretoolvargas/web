import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG, appConfigValue } from '../config/app-config';
import { AdminCatalogItem } from '../models/admin-catalog.models';
import { AdminCatalogService } from './admin-catalog.service';

const category = (index: number, active = true): AdminCatalogItem => ({
  id: `cat-${index}`,
  kind: 'categories',
  name: `Categoría ${String(index).padStart(2, '0')}`,
  slug: `categoria-${index}`,
  description: `Descripción ${index}`,
  active,
});

describe('AdminCatalogService', () => {
  let service: AdminCatalogService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { ...appConfigValue, mockLatencyMs: 0 } },
      ],
    });
    service = TestBed.inject(AdminCatalogService);
  });

  it('combina paginación, búsqueda, estado y orden', async () => {
    localStorage.setItem(
      'fv-admin-catalogs',
      JSON.stringify(Array.from({ length: 14 }, (_, index) => category(index + 1, index !== 0))),
    );
    const result = await firstValueFrom(
      service.list('categories', {
        page: 2,
        limit: 5,
        search: 'Categoría',
        sortOrder: 'desc',
        filters: { active: true },
      }),
    );
    expect(result.meta).toEqual({ page: 2, limit: 5, total: 13, totalPages: 3 });
    expect(result.data).toHaveLength(5);
    expect(result.data[0].name > result.data[1].name).toBe(true);
  });

  it('crea, edita, activa/desactiva y persiste un registro', async () => {
    localStorage.setItem('fv-admin-catalogs', '[]');
    const created = category(1);
    await firstValueFrom(service.save(created));
    await firstValueFrom(service.save({ ...created, name: 'Categoría editada' }));
    await firstValueFrom(service.toggle(created.id));
    const persisted = JSON.parse(
      localStorage.getItem('fv-admin-catalogs') ?? '[]',
    ) as AdminCatalogItem[];
    expect(persisted).toHaveLength(1);
    expect(persisted[0].name).toBe('Categoría editada');
    expect(persisted[0].active).toBe(false);
  });

  it('rechaza duplicados y ciclos de categorías', async () => {
    localStorage.setItem('fv-admin-catalogs', JSON.stringify([category(1)]));
    await expect(
      firstValueFrom(service.save({ ...category(2), name: category(1).name })),
    ).rejects.toMatchObject({
      statusCode: 422,
    });
    await expect(
      firstValueFrom(service.save({ ...category(2), parentId: category(2).id })),
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});
