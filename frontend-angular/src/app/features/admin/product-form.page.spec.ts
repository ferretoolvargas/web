import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductFormPage } from './product-form.page';

describe('ProductFormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: AdminCatalogService, useValue: { all: () => of([]) } },
        {
          provide: CatalogService,
          useValue: { slugAvailable: () => of(true), save: (product: unknown) => of(product) },
        },
      ],
    }).compileComponents();
  });

  it('sugiere slug editable a partir del nombre', () => {
    const component = TestBed.createComponent(ProductFormPage).componentInstance;
    component.form.controls.name.setValue('Taladro Percutor 650 W');
    expect(component.form.controls.slug.value).toBe('taladro-percutor-650-w');
  });

  it('agrega y quita especificaciones y variantes sin perder validación', () => {
    const component = TestBed.createComponent(ProductFormPage).componentInstance;
    component.addSpecification();
    component.addVariant();
    expect(component.specifications.length).toBe(1);
    expect(component.variants.length).toBe(1);
    expect(component.variants.at(0).invalid).toBe(true);
    component.variants.at(0).patchValue({
      sku: 'VAR-01',
      attribute: 'Tamaño',
      attributeValue: '13 mm',
      price: 10,
      stock: 0,
    });
    expect(component.variants.at(0).valid).toBe(true);
    component.specifications.removeAt(0);
    component.variants.removeAt(0);
    expect(component.specifications.length).toBe(0);
    expect(component.variants.length).toBe(0);
  });

  it('rechaza precios, stock mínimo y existencias negativas', () => {
    const component = TestBed.createComponent(ProductFormPage).componentInstance;
    component.form.patchValue({ price: -1, minimumStock: -1, stock: -1 });
    expect(component.form.controls.price.hasError('min')).toBe(true);
    expect(component.form.controls.minimumStock.hasError('min')).toBe(true);
    expect(component.form.controls.stock.hasError('min')).toBe(true);
  });

  it('mantiene una sola imagen principal y reasigna al quitarla', () => {
    const component = TestBed.createComponent(ProductFormPage).componentInstance;
    component.addImage();
    component.addImage();
    expect(component.images.controls.map((group) => group.controls['primary'].value)).toEqual([
      true,
      false,
    ]);
    component.setPrimaryImage(1);
    expect(component.images.controls.map((group) => group.controls['primary'].value)).toEqual([
      false,
      true,
    ]);
    component.removeImage(1);
    expect(component.images.at(0).controls['primary'].value).toBe(true);
  });
});
