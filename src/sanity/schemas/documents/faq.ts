import { defineType, defineField } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'localizedBlock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'package',
      title: 'Paquete',
      description: 'Dejar vacio si es una pregunta general. Seleccionar paquete si es especifica.',
      type: 'reference',
      to: [{ type: 'package' }],
    }),
    defineField({
      name: 'faqCategory',
      title: 'Categoria de FAQ',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Equipo', value: 'equipo' },
          { title: 'Pagos', value: 'pagos' },
          { title: 'Preparacion', value: 'preparacion' },
          { title: 'Seguridad', value: 'seguridad' },
        ],
      },
      initialValue: 'general',
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
      question: 'question.es',
      category: 'faqCategory',
      packageTitle: 'package.title.es',
    },
    prepare({ question, category, packageTitle }) {
      const categoryLabels: Record<string, string> = {
        general: 'General',
        equipo: 'Equipo',
        pagos: 'Pagos',
        preparacion: 'Preparacion',
        seguridad: 'Seguridad',
      }
      const parts = [categoryLabels[category] || category]
      if (packageTitle) parts.push(packageTitle)
      return {
        title: question || 'Sin pregunta',
        subtitle: parts.join(' | '),
      }
    },
  },
  orderings: [
    {
      title: 'Orden manual',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Categoria',
      name: 'categoryAsc',
      by: [{ field: 'faqCategory', direction: 'asc' }],
    },
  ],
})
