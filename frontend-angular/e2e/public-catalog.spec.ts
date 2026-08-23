import { expect, test } from '@playwright/test';

test('inicio presenta la propuesta comercial y persiste el tema', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'La herramienta correcta para cada trabajo' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorar catálogo' })).toHaveAttribute(
    'href',
    '/catalogo',
  );
  const theme = page.getByRole('button', { name: 'Usar tema oscuro' });
  if (!(await theme.isVisible())) {
    await page.getByRole('button', { name: 'Menú' }).click();
  }
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('catálogo busca, filtra y conserva el estado en la URL', async ({ page }) => {
  await page.goto('/catalogo');
  await expect(page.getByRole('heading', { name: 'Herramientas y materiales' })).toBeVisible();
  await page.getByLabel('Buscar productos').fill('taladro');
  await expect(page).toHaveURL(/q=taladro/);
  await expect(page.getByRole('link', { name: 'Taladro percutor 650 W' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Martillo uña 16 oz' })).toHaveCount(0);
  await expect(page.getByLabel('Precio desde')).toHaveCount(0);
  await expect(page.getByLabel('Disponibilidad')).toHaveCount(0);
  await expect(page.getByLabel('Solo productos en oferta')).toHaveCount(0);
  await expect(page.getByLabel('Ordenar')).not.toContainText('Mayor descuento');
  await page.reload();
  await expect(page.getByLabel('Buscar productos')).toHaveValue('taladro');
});

test('detalle tiene URL canónica y acciones de WhatsApp explícitas', async ({ page }) => {
  await page.goto('/productos/taladro-percutor-650w');
  await expect(page.getByRole('heading', { name: 'Taladro percutor 650 W' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /productos\/taladro-percutor-650w$/,
  );
  await expect(page.getByRole('link', { name: 'Consultar por WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/59160514138\?text=/,
  );
  await expect(page.getByRole('link', { name: 'Compartir por WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me\/\?text=/,
  );
});

test('contacto publica únicamente canales y ubicación confirmados', async ({ page }) => {
  await page.goto('/contacto');
  await expect(page.getByRole('heading', { name: 'Estamos para ayudarte' })).toBeVisible();
  await expect(
    page.locator('#contenido').getByText('Mallasa, La Paz, Bolivia', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Escribir al/ })).toHaveAttribute(
    'href',
    'https://wa.me/59160514138',
  );
  await expect(page.getByRole('link', { name: 'ferretools.vargas@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:ferretools.vargas@gmail.com',
  );
  for (const network of ['Instagram', 'TikTok', 'Facebook']) {
    const link = page.getByRole('link', { name: network }).last();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(page.getByText(/dirección exacta y los horarios se publicarán/i)).toBeVisible();
});

test('controles e imágenes visibles tienen nombre accesible', async ({ page }) => {
  await page.goto('/catalogo');
  const unnamed = await page.locator('button, input, select, textarea, a').evaluateAll((elements) =>
    elements
      .filter((element) => {
        const control = element as HTMLInputElement;
        const text = element.textContent?.trim();
        const aria = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
        const labels = 'labels' in control ? control.labels?.length : 0;
        const imageAlt = element.querySelector('img[alt]');
        return !text && !aria && !labels && !imageAlt;
      })
      .map((element) => element.outerHTML),
  );
  expect(unnamed).toEqual([]);
  await expect(page.locator('img:not([alt])')).toHaveCount(0);
});
