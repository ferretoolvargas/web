export const BRAND_INFO = {
  name: 'Ferretool Vargas',
  siteUrl: 'https://ferretoolvargas.github.io/web',
  location: 'Mallasa, La Paz, Bolivia',
  phoneDisplay: '+591 60514138',
  whatsappUrl: 'https://wa.me/59160514138',
  email: 'ferretools.vargas@gmail.com',
  instagramUrl: 'https://www.instagram.com/ferretools.vargas/',
  tiktokUrl: 'https://www.tiktok.com/@ferretools.vargas',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61593272297661',
  address: null,
  openingHours: null,
} as const;

/** TODO: confirmar información comercial antes de habilitarla en el sitio público. */
export const COMMERCIAL_STATUS = {
  pricesConfirmed: false,
  inventoryConfirmed: false,
  campaignsConfirmed: false,
} as const;
