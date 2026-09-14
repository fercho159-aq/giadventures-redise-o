import { defineType, defineField } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Elemento de galeria',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Importante para accesibilidad y SEO',
        }),
      ],
      hidden: ({ parent }) => parent?.type === 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del video',
      description: 'URL de YouTube o Vimeo',
      type: 'url',
      hidden: ({ parent }) => parent?.type === 'image',
    }),
    defineField({
      name: 'caption',
      title: 'Leyenda',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      media: 'image',
      caption: 'caption.es',
    },
    prepare({ type, media, caption }) {
      return {
        title: caption || (type === 'video' ? 'Video' : 'Imagen'),
        subtitle: type === 'video' ? 'Video' : 'Imagen',
        media,
      }
    },
  },
})
