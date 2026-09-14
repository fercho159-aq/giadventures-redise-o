import { defineType, defineField } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Resena',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Foto del autor',
      type: 'image',
    }),
    defineField({
      name: 'package',
      title: 'Paquete',
      description: 'Paquete de aventura relacionado',
      type: 'reference',
      to: [{ type: 'package' }],
    }),
    defineField({
      name: 'rating',
      title: 'Calificacion',
      description: 'De 1 a 5 estrellas',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Texto de la resena',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Fecha',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Fuente',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Directa', value: 'direct' },
          { title: 'Instagram', value: 'instagram' },
        ],
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacada',
      description: 'Mostrar en la pagina principal',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      author: 'author',
      rating: 'rating',
      packageTitle: 'package.title.es',
      media: 'avatar',
    },
    prepare({ author, rating, packageTitle, media }) {
      const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : ''
      return {
        title: `${author} ${stars}`,
        subtitle: packageTitle || 'Sin paquete asociado',
        media,
      }
    },
  },
})
