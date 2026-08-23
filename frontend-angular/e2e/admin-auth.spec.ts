import { expect, test } from '@playwright/test';

test('protege administración, inicia sesión y permite cerrarla', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Resumen del negocio' })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('muestra validaciones accesibles de acceso', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Correo').fill('correo-invalido');
  await page.getByLabel('Contraseña').fill('');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#password-error')).toBeVisible();
  await expect(page.getByLabel('Correo')).toHaveAttribute('aria-describedby', 'email-error');
});
