import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuracion del sitio',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contacto', title: 'Contacto' },
    { name: 'redes', title: 'Redes sociales' },
    { name: 'estadisticas', title: 'Estadisticas' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // --- General ---
    defineField({
      name: 'siteName',
      title: 'Nombre del sitio',
      type: 'string',
      group: 'general',
      initialValue: 'Adventures GI',
    }),
    defineField({
      name: 'tagline',
      title: 'Lema / Tagline',
      type: 'localizedString',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (modo oscuro)',
      type: 'image',
      group: 'general',
    }),

    // --- Contacto ---
    defineField({
      name: 'whatsappNumber',
      title: 'Numero de WhatsApp',
      description: 'Con codigo de pais, ej: +5215512345678',
      type: 'string',
      group: 'contacto',
    }),
    defineField({
      name: 'email',
      title: 'Correo electronico',
      type: 'string',
      group: 'contacto',
    }),
    defineField({
      name: 'phone',
      title: 'Telefono',
      type: 'string',
      group: 'contacto',
    }),
    defineField({
      name: 'address',
      title: 'Direccion',
      type: 'text',
      rows: 3,
      group: 'contacto',
    }),

    // --- Redes sociales ---
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      group: 'redes',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'instagramAlpine',
          title: 'Instagram Alpinismo',
          description: 'Cuenta de Instagram dedicada a alpinismo',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
      ],
    }),

    // --- Estadisticas ---
    defineField({
      name: 'statsCounters',
      title: 'Contadores de estadisticas',
      description: 'Numeros que se muestran en la pagina principal',
      type: 'object',
      group: 'estadisticas',
      fields: [
        defineField({
          name: 'totalClimbers',
          title: 'Total de escaladores',
          type: 'number',
        }),
        defineField({
          name: 'totalExpeditions',
          title: 'Total de expediciones',
          type: 'number',
        }),
        defineField({
          name: 'yearsExperience',
          title: 'Anos de experiencia',
          type: 'number',
        }),
        defineField({
          name: 'summitSuccessRate',
          title: 'Tasa de exito en cumbre (%)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
        }),
      ],
    }),

    // --- SEO ---
    defineField({
      name: 'defaultSeo',
      title: 'SEO por defecto',
      description: 'Se usa cuando una pagina no tiene su propio SEO configurado',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuracion del sitio',
      }
    },
  },
})
