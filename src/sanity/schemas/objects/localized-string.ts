import { defineType, defineField } from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Texto localizado',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Espanol',
      type: 'string',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
  ],
})
