import { defineType, defineField } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Titulo meta',
      type: 'localizedString',
      description: 'Titulo para motores de busqueda (50-60 caracteres recomendados)',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descripcion meta',
      type: 'localizedString',
      description: 'Descripcion para motores de busqueda (150-160 caracteres recomendados)',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen Open Graph',
      description: 'Imagen que se muestra al compartir en redes sociales (1200x630px recomendado)',
      type: 'image',
    }),
  ],
})
