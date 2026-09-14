import { defineType, defineField } from 'sanity'

export const priceTier = defineType({
  name: 'priceTier',
  title: 'Rango de precio',
  type: 'object',
  fields: [
    defineField({
      name: 'minPeople',
      title: 'Minimo de personas',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'maxPeople',
      title: 'Maximo de personas',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'pricePerPerson',
      title: 'Precio por persona',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      min: 'minPeople',
      max: 'maxPeople',
      price: 'pricePerPerson',
    },
    prepare({ min, max, price }) {
      return {
        title: `${min}-${max} personas`,
        subtitle: `$${price?.toLocaleString('es-MX') || 0} por persona`,
      }
    },
  },
})
