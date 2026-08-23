import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG, appConfigValue } from '../config/app-config';
import { Product } from '../models/domain.models';
import { CatalogService } from './catalog.service';

const product = (id: string, name: string, quality: Product['quality'] = 'ESTANDAR') =>
  ({
    id,
    name,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    sku: `SKU-${id}`,
    active: true,
    publicVisible: true,
    quality,
    keywords: [],
    price: Number(id) * 10,
    categoryId: 'herramientas',
    summary: 'Resumen',
    description: 'Descripción',
    uses: 'Uso',
    packageContents: 'Una unidad',
    cost: 1,
    unitId: 'unidad',
    featured: false,
    isNew: false,
    stock: 10,
    minimumStock: 2,
    stockStatus: 'disponible',
    images: [],
    specifications: [],
    variants: [],
    createdAt: '2026-01-01T00:00:00Z',
  }) satisfies Product;

describe('CatalogService', () => {
  let service: CatalogService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { ...appConfigValue, mockLatencyMs: 0 } },
      ],
    });
    service = TestBed.inject(CatalogService);
  });
  it('conserva el precio sin oferta vigente', () => {
    expect(service.finalPrice({ price: 100 } as Product, [])).toBe(100);
  });
  it('restaura semillas eliminando persistencia', () => {
    localStorage.setItem('fv-products', '[]');
    service.reset();
    expect(localStorage.getItem('fv-products')).toBeNull();
  });
  it('pagina, busca y filtra sin cargar todo en el componente', async () => {
    localStorage.setItem(
      'fv-products',
      JSON.stringify([
        product('1', 'Taladro Uno'),
        product('2', 'Taladro Dos', 'PROFESIONAL'),
        product('3', 'Martillo'),
      ]),
    );
    const result = await firstValueFrom(
      service.products({
        page: 1,
        limit: 1,
        search: 'taladro',
        filters: { quality: 'PROFESIONAL' },
      }),
    );
    expect(result.data.map((item) => item.id)).toEqual(['2']);
    expect(result.meta).toEqual({ page: 1, limit: 1, total: 1, totalPages: 1 });
  });
  it('persiste una edición mock en el almacenamiento encapsulado', async () => {
    localStorage.setItem('fv-products', JSON.stringify([product('1', 'Taladro')]));
    await firstValueFrom(service.save(product('1', 'Taladro actualizado')));
    expect(JSON.parse(localStorage.getItem('fv-products') ?? '[]')[0].name).toBe(
      'Taladro actualizado',
    );
  });
  it('valida slug único y ordena precios numéricamente', async () => {
    localStorage.setItem(
      'fv-products',
      JSON.stringify([product('2', 'Producto caro'), product('10', 'Producto económico')]),
    );
    expect(await firstValueFrom(service.slugAvailable('producto-caro'))).toBe(false);
    expect(await firstValueFrom(service.slugAvailable('producto-caro', '2'))).toBe(true);
    const result = await firstValueFrom(
      service.products({ page: 1, limit: 10, sortBy: 'price', sortOrder: 'asc' }),
    );
    expect(result.data.map((item) => item.price)).toEqual([20, 100]);
  });
});

describe('CatalogService con API HTTP', () => {
  it('cambia de fuente mediante useMocks y conserva la consulta paginada', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { ...appConfigValue, useMocks: false } },
      ],
    });
    const service = TestBed.inject(CatalogService);
    const http = TestBed.inject(HttpTestingController);
    const response = {
      data: [product('1', 'Taladro')],
      meta: { page: 2, limit: 25, total: 30, totalPages: 2 },
    };
    const resultPromise = firstValueFrom(
      service.products({ page: 2, limit: 25, search: 'taladro', sortBy: 'name' }),
    );
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/products' &&
        candidate.params.get('page') === '2' &&
        candidate.params.get('search') === 'taladro',
    );
    request.flush(response);
    expect(await resultPromise).toEqual(response);
    http.verify();
  });
});
