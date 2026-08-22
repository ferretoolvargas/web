import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { DashboardData } from '../../core/models/domain.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardPage } from './dashboard.page';

const populated: DashboardData = {
  salesToday: 1500,
  activeProducts: 20,
  lowStock: 3,
  activeOffers: 2,
  recentMovements: [
    {
      id: 'm1',
      description: 'Producto actualizado',
      type: 'producto',
      occurredAt: '2026-08-22T09:00:00-04:00',
    },
  ],
  popularProducts: [{ productId: 'p1', name: 'Taladro', consultations: 8 }],
};

const empty: DashboardData = {
  salesToday: 0,
  activeProducts: 0,
  lowStock: 0,
  activeOffers: 0,
  recentMovements: [],
  popularProducts: [],
};

describe('DashboardPage', () => {
  async function render(
    response: Observable<DashboardData>,
  ): Promise<ComponentFixture<DashboardPage>> {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: DashboardService, useValue: { getSummary: () => response } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra una carga exitosa proveniente del repositorio', async () => {
    const fixture = await render(of(populated));
    expect(fixture.componentInstance.data()?.salesToday).toBe(1500);
    expect(fixture.nativeElement.textContent).toContain('Taladro');
  });

  it('muestra error y una acción de reintento', async () => {
    const fixture = await render(throwError(() => new Error('fallo')));
    expect(fixture.nativeElement.textContent).toContain('No pudimos cargar');
    expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('Reintentar');
  });

  it('muestra el estado vacío sin inventar métricas', async () => {
    const fixture = await render(of(empty));
    expect(fixture.nativeElement.textContent).toContain('Todavía no hay actividad');
  });
});
