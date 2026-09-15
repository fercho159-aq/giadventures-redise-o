import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'cdn.sanity.io' },
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
      // Photos uploaded from the admin (Vercel Blob)
      { protocol: 'https' as const, hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      // Old WordPress URLs -> new routes
      { source: '/nevado', destination: '/expediciones/nevado-de-toluca', permanent: true },
      { source: '/nevado/', destination: '/expediciones/nevado-de-toluca', permanent: true },
      { source: '/malinche', destination: '/expediciones/la-malinche', permanent: true },
      { source: '/malinche/', destination: '/expediciones/la-malinche', permanent: true },
      { source: '/izta-avanzado', destination: '/expediciones/iztaccihuatl', permanent: true },
      { source: '/izta-avanzado/', destination: '/expediciones/iztaccihuatl', permanent: true },
      { source: '/pico-avanzado', destination: '/expediciones/pico-de-orizaba', permanent: true },
      { source: '/pico-avanzado/', destination: '/expediciones/pico-de-orizaba', permanent: true },
      { source: '/ecuador', destination: '/expediciones/cotopaxi', permanent: true },
      { source: '/ecuador/', destination: '/expediciones/cotopaxi', permanent: true },
      { source: '/peru', destination: '/expediciones/alpamayo', permanent: true },
      { source: '/peru/', destination: '/expediciones/alpamayo', permanent: true },
      // No category pages yet — old category URLs go to the expeditions listing
      { source: '/principiante-e-intermedio', destination: '/expediciones', permanent: true },
      { source: '/principiante-e-intermedio/', destination: '/expediciones', permanent: true },
      { source: '/avanzados', destination: '/expediciones', permanent: true },
      { source: '/avanzados/', destination: '/expediciones', permanent: true },
      { source: '/alto-rendimiento', destination: '/expediciones', permanent: true },
      { source: '/alto-rendimiento/', destination: '/expediciones', permanent: true },
      { source: '/expediciones-internacionales', destination: '/expediciones', permanent: true },
      { source: '/expediciones-internacionales/', destination: '/expediciones', permanent: true },
      // /nosotros, /nuestra-ceo, /contacto keep same paths — no redirect needed
      { source: '/galeria-profesional', destination: '/galeria', permanent: true },
      { source: '/nuestros-clientes', destination: '/nosotros', permanent: true },
      { source: '/personaliza-tu-aventura', destination: '/contacto', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
