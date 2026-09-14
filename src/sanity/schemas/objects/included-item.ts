import { defineType, defineField } from 'sanity'

export const includedItem = defineType({
  name: 'includedItem',
  title: 'Elemento incluido',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      description: 'Nombre del icono de Lucide (ej: mountain, tent, utensils)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'text.es',
      icon: 'icon',
    },
    prepare({ title, icon }) {
      return {
        title: title || 'Sin texto',
        subtitle: icon ? `Icono: ${icon}` : undefined,
      }
    },
  },
})
