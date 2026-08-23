import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG, appConfigValue } from '../config/app-config';
import { Offer } from '../models/domain.models';
import { CampaignService } from './campaign.service';

const offer: Offer = {
  id: 'o1',
  name: 'Oferta taladro',
  slug: 'oferta-taladro',
  active: true,
  productIds: ['p1'],
  normalPrice: 500,
  promotionalPrice: 400,
  startsAt: '2026-08-01T00:00:00-04:00',
  endsAt: '2026-09-01T00:00:00-04:00',
  priority: 10,
};

describe('CampaignService', () => {
  let service: CampaignService;
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('fv-offers', JSON.stringify([offer]));
    localStorage.setItem('fv-promotions', '[]');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { ...appConfigValue, mockLatencyMs: 0 } },
      ],
    });
    service = TestBed.inject(CampaignService);
  });
  it('calcula descuento y vigencia de forma predecible', () => {
    expect(service.discount(offer)).toBe(20);
    expect(service.isCurrent(offer, Date.parse('2026-08-22T12:00:00-04:00'))).toBe(true);
    expect(service.isCurrent(offer, Date.parse('2026-10-01T12:00:00-04:00'))).toBe(false);
  });
  it('rechaza descuentos negativos o precios incoherentes', async () => {
    await expect(
      firstValueFrom(service.saveOffer({ ...offer, promotionalPrice: 550 })),
    ).rejects.toMatchObject({ statusCode: 422 });
  });
  it('pagina y filtra campañas vigentes desde el repositorio', async () => {
    const result = await firstValueFrom(
      service.listOffers({ page: 1, limit: 10, filters: { validity: 'current' } }),
    );
    expect(result.meta.total).toBe(1);
    expect(result.data[0].id).toBe('o1');
  });
  it('emite sin aplazar cuando la latencia mock está desactivada', () => {
    let emitted = false;
    service.listOffers({ page: 1, limit: 10 }).subscribe(() => (emitted = true));
    expect(emitted).toBe(true);
  });
});
