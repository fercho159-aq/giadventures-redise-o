import { defineType, defineField } from 'sanity'

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Dia de itinerario',
  type: 'object',
  fields: [
    defineField({
      name: 'dayNumber',
      title: 'Numero de dia',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: 'Descripcion',
      type: 'localizedBlock',
    }),
    defineField({
      name: 'elevation',
      title: 'Elevacion (msnm)',
      description: 'Metros sobre el nivel del mar',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      dayNumber: 'dayNumber',
      title: 'title.es',
      media: 'image',
    },
    prepare({ dayNumber, title, media }) {
      return {
        title: `Dia ${dayNumber}: ${title || 'Sin titulo'}`,
        media,
      }
    },
  },
})
