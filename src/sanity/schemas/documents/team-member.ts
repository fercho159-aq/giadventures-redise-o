import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Miembro del equipo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Puesto / Rol',
      type: 'localizedString',
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'localizedBlock',
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'certifications',
      title: 'Certificaciones',
      description: 'Certificaciones de montanismo, primeros auxilios, etc.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
    }),
    defineField({
      name: 'isCeo',
      title: 'Es CEO / Fundador',
      type: 'boolean',
      initialValue: false,
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
      title: 'name',
      role: 'role.es',
      media: 'photo',
      isCeo: 'isCeo',
    },
    prepare({ title, role, media, isCeo }) {
      return {
        title: isCeo ? `${title} (CEO)` : title,
        subtitle: role || '',
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
