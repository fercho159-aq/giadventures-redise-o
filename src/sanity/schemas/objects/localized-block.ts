import { defineType, defineField } from 'sanity'

export const localizedBlock = defineType({
  name: 'localizedBlock',
  title: 'Texto enriquecido localizado',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Espanol',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
