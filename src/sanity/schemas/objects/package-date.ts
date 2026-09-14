import { defineType, defineField } from 'sanity'

export const packageDate = defineType({
  name: 'packageDate',
  title: 'Fecha de salida',
  type: 'object',
  fields: [
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spotsTotal',
      title: 'Lugares totales',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'spotsTaken',
      title: 'Lugares ocupados',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'available' },
          { title: 'Lleno', value: 'full' },
          { title: 'Garantizado', value: 'guaranteed' },
        ],
      },
      initialValue: 'available',
    }),
  ],
  preview: {
    select: {
      startDate: 'startDate',
      endDate: 'endDate',
      status: 'status',
      spotsTotal: 'spotsTotal',
      spotsTaken: 'spotsTaken',
    },
    prepare({ startDate, endDate, status, spotsTotal, spotsTaken }) {
      const statusLabels: Record<string, string> = {
        available: 'Disponible',
        full: 'Lleno',
        guaranteed: 'Garantizado',
      }
      return {
        title: `${startDate || '?'} → ${endDate || '?'}`,
        subtitle: `${statusLabels[status] || status} - ${spotsTaken || 0}/${spotsTotal || '?'} lugares`,
      }
    },
  },
})
