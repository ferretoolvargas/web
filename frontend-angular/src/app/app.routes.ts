import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home.page').then((m) => m.HomePage),
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./features/public/catalog.page').then((m) => m.CatalogPage),
      },
      {
        path: 'ofertas',
        loadComponent: () => import('./features/public/offers.page').then((m) => m.OffersPage),
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/public/contact.page').then((m) => m.ContactPage),
      },
      {
        path: 'productos/:slug',
        loadComponent: () =>
          import('./features/public/product-detail.page').then((m) => m.ProductDetailPage),
      },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/admin/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'productos/nuevo',
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./features/admin/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'productos/:id/editar',
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./features/admin/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'productos',
        loadComponent: () => import('./features/admin/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'catalogos',
        loadComponent: () => import('./features/admin/catalogs.page').then((m) => m.CatalogsPage),
      },
      {
        path: 'promociones',
        loadComponent: () =>
          import('./features/admin/promotions.page').then((m) => m.PromotionsPage),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/public/not-found.page').then((m) => m.NotFoundPage),
  },
];
