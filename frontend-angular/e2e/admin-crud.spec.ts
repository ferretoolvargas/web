import { expect, Page, test } from '@playwright/test';

async function login(page: Page): Promise<void> {
  await page.goto('/admin/login');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test('crea, edita, desactiva y persiste un catálogo', async ({ page }) => {
  await login(page);
  await page.goto('/admin/catalogos');

  await page.getByLabel('Nombre', { exact: true }).fill('Seguridad industrial');
  await expect(page.getByLabel('Slug', { exact: true })).toHaveValue('seguridad-industrial');
  await page.getByLabel('Descripción').fill('Protección para trabajos en taller y obra.');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();

  let row = page.getByRole('row').filter({ hasText: 'Seguridad industrial' });
  await expect(row).toBeVisible();
  await page.reload();
  row = page.getByRole('row').filter({ hasText: 'Seguridad industrial' });
  await expect(row).toBeVisible();

  await row.getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Nombre', { exact: true }).fill('Seguridad y protección');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  row = page.getByRole('row').filter({ hasText: 'Seguridad y protección' });
  await expect(row).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: 'Desactivar' }).click();
  await expect(row).toContainText('Inactivo');
});

test('crea un producto y lo conserva en administración y catálogo público', async ({ page }) => {
  await login(page);
  await page.goto('/admin/productos/nuevo');

  await page.getByLabel('Nombre', { exact: true }).fill('Guante de prueba E2E');
  await page.getByLabel('SKU', { exact: true }).fill('FV-E2E-GUA-001');
  await expect(page.getByLabel('Slug', { exact: true })).toHaveValue('guante-de-prueba-e2e');
  const category = page.locator('select[formcontrolname="categoryId"]');
  await expect(category.locator('option')).not.toHaveCount(1);
  await category.selectOption({ index: 1 });
  await page.locator('select[formcontrolname="quality"]').selectOption('ECONOMICO');
  await page.getByLabel(/Resumen/).fill('Guante de prueba para validar el flujo administrativo.');
  await page.getByLabel(/¿Qué es?/).fill('Producto simulado creado únicamente por la prueba E2E.');
  await page.getByLabel('Precio (Bs)').fill('49.90');
  const unit = page.locator('select[formcontrolname="unitId"]');
  await expect(unit.locator('option')).not.toHaveCount(1);
  await unit.selectOption({ index: 1 });
  await page.locator('select[formcontrolname="stockStatus"]').selectOption('disponible');
  await page.getByRole('button', { name: 'Guardar producto' }).click();

  await expect(page).toHaveURL(/\/admin\/productos$/);
  await page.getByLabel('Buscar').fill('Guante de prueba E2E');
  const row = page.getByRole('row').filter({ hasText: 'Guante de prueba E2E' });
  await expect(row).toContainText('FV-E2E-GUA-001');
  await expect(row).toContainText('Esencial');
  await page.reload();
  await expect(page.getByRole('row').filter({ hasText: 'Guante de prueba E2E' })).toBeVisible();

  await page.goto('/productos/guante-de-prueba-e2e');
  await expect(page.getByRole('heading', { name: 'Guante de prueba E2E' })).toBeVisible();
  await expect(page.locator('.detail-price')).toContainText(/49[,.]90/);
});

test('crea, edita, desactiva y persiste una promoción', async ({ page }) => {
  await login(page);
  await page.goto('/admin/promociones');
  await page.getByRole('button', { name: 'Promociones', exact: true }).click();

  await page.getByLabel('Nombre', { exact: true }).fill('Semana del taller E2E');
  await page.getByLabel('Slug', { exact: true }).fill('semana-taller-e2e');
  await page.getByLabel('Descripción').fill('Promoción simulada para validar persistencia.');
  await page.getByLabel('Condiciones visibles').fill('Consulta disponibilidad antes de comprar.');
  await page.getByLabel('Inicio').fill('2026-08-01T08:00');
  await page.getByLabel('Final').fill('2027-08-31T20:00');
  await page.getByRole('button', { name: 'Guardar promoción' }).click();

  let row = page.getByRole('row').filter({ hasText: 'Semana del taller E2E' });
  await expect(row).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Promociones', exact: true }).click();
  row = page.getByRole('row').filter({ hasText: 'Semana del taller E2E' });
  await expect(row).toBeVisible();

  await row.getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Nombre', { exact: true }).fill('Semana profesional E2E');
  await page.getByRole('button', { name: 'Guardar promoción' }).click();
  row = page.getByRole('row').filter({ hasText: 'Semana profesional E2E' });
  await expect(row).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: 'Desactivar' }).click();
  await expect(row).toContainText('Inactiva');
});
