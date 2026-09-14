import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'cdn.sanity.io' },
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // Old WordPress URLs -> new routes
      { source: '/nevado', destination: '/expediciones/nevado-de-toluca', permanent: true },
      { source: '/nevado/', destination: '/expediciones/nevado-de-toluca', permanent: true },
      { source: '/malinche', destination: '/expediciones/malinche', permanent: true },
      { source: '/malinche/', destination: '/expediciones/malinche', permanent: true },
      { source: '/izta-avanzado', destination: '/expediciones/iztaccihuatl', permanent: true },
      { source: '/izta-avanzado/', destination: '/expediciones/iztaccihuatl', permanent: true },
      { source: '/pico-avanzado', destination: '/expediciones/pico-de-orizaba', permanent: true },
      { source: '/pico-avanzado/', destination: '/expediciones/pico-de-orizaba', permanent: true },
      { source: '/ecuador', destination: '/expediciones/ecuador', permanent: true },
      { source: '/ecuador/', destination: '/expediciones/ecuador', permanent: true },
      { source: '/peru', destination: '/expediciones/peru', permanent: true },
      { source: '/peru/', destination: '/expediciones/peru', permanent: true },
      { source: '/principiante-e-intermedio', destination: '/categorias/principiante-intermedio', permanent: true },
      { source: '/principiante-e-intermedio/', destination: '/categorias/principiante-intermedio', permanent: true },
      { source: '/avanzados', destination: '/categorias/avanzado', permanent: true },
      { source: '/avanzados/', destination: '/categorias/avanzado', permanent: true },
      { source: '/alto-rendimiento', destination: '/categorias/alto-rendimiento', permanent: true },
      { source: '/alto-rendimiento/', destination: '/categorias/alto-rendimiento', permanent: true },
      { source: '/expediciones-internacionales', destination: '/categorias/internacionales', permanent: true },
      { source: '/expediciones-internacionales/', destination: '/categorias/internacionales', permanent: true },
      // /nosotros, /nuestra-ceo, /contacto keep same paths — no redirect needed
      { source: '/galeria-profesional', destination: '/galeria', permanent: true },
      { source: '/nuestros-clientes', destination: '/clientes', permanent: true },
      { source: '/personaliza-tu-aventura', destination: '/personaliza', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
