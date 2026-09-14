import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.es',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripcion',
      type: 'localizedString',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      description: 'Nombre del icono de Lucide (ej: mountain, tent, compass)',
      type: 'string',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      description: 'Numero para ordenar manualmente (menor = primero)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Sin titulo',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Orden manual',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})
