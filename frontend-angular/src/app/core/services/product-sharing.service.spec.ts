import { Product, ProductVariant } from '../models/domain.models';
import { ProductSharingService } from './product-sharing.service';

const product = {
  name: 'Taladro percutor 650 W',
  sku: 'FV-TAL-650',
  quality: 'ESTANDAR',
  stockStatus: 'pocas-unidades',
} as Product;

describe('ProductSharingService', () => {
  const service = new ProductSharingService();
  const canonical = 'https://ferretoolvargas.github.io/web/productos/taladro-percutor-650w';

  it('comparte nombre, línea, precio, disponibilidad y URL canónica', () => {
    const message = decodeURIComponent(service.share(product, 'Rendimiento', canonical, 419));
    expect(message).toContain('Taladro percutor 650 W');
    expect(message).toContain('Línea Rendimiento');
    expect(message).toContain('Bs 419.00');
    expect(message).toContain('Pocas unidades');
    expect(message).toContain(canonical);
  });

  it('consulta al número comercial e incluye la variante seleccionada', () => {
    const variant = {
      id: 'v1',
      sku: 'FV-TAL-650-13',
      attributes: { Mandril: '13 mm' },
      price: 450,
      stock: 2,
    } satisfies ProductVariant;
    const url = service.consult(product, variant, canonical, 450);
    expect(url).toContain('wa.me/59160514138');
    const message = decodeURIComponent(url);
    expect(message).toContain('13 mm');
    expect(message).toContain('FV-TAL-650-13');
    expect(message).toContain('Bs 450.00');
  });
});
