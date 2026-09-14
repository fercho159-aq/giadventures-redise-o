import { defineType, defineField, defineArrayMember } from 'sanity'

export const adventurePackage = defineType({
  name: 'package',
  title: 'Paquete de aventura',
  type: 'document',
  groups: [
    { name: 'contenido', title: 'Contenido', default: true },
    { name: 'detalles', title: 'Detalles' },
    { name: 'precios', title: 'Precios y fechas' },
    { name: 'itinerario', title: 'Itinerario' },
    { name: 'incluye', title: 'Incluye / No incluye' },
    { name: 'requisitos', title: 'Requisitos' },
    { name: 'galeria', title: 'Galeria' },
    { name: 'seo', title: 'SEO' },
    { name: 'configuracion', title: 'Configuracion' },
  ],
  fields: [
    // --- Contenido ---
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'localizedString',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'contenido',
      options: {
        source: 'title.es',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitulo',
      type: 'localizedString',
      group: 'contenido',
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      description: 'Resumen corto (~160 caracteres) para previsualizaciones y meta descripcion',
      type: 'localizedString',
      group: 'contenido',
    }),
    defineField({
      name: 'description',
      title: 'Descripcion completa',
      type: 'localizedBlock',
      group: 'contenido',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'contenido',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'contenido',
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
      validation: (Rule) => Rule.required(),
    }),

    // --- Detalles ---
    defineField({
      name: 'duration',
      title: 'Duracion',
      type: 'object',
      group: 'detalles',
      fields: [
        defineField({
          name: 'days',
          title: 'Dias',
          type: 'number',
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'nights',
          title: 'Noches',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
        }),
      ],
    }),
    defineField({
      name: 'difficulty',
      title: 'Dificultad',
      type: 'string',
      group: 'detalles',
      options: {
        list: [
          { title: 'Principiante', value: 'principiante' },
          { title: 'Intermedio', value: 'intermedio' },
          { title: 'Avanzado', value: 'avanzado' },
          { title: 'Alto rendimiento', value: 'alto-rendimiento' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'altitude',
      title: 'Altitud maxima (msnm)',
      description: 'Altitud maxima en metros sobre el nivel del mar',
      type: 'number',
      group: 'detalles',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'groupSize',
      title: 'Tamano del grupo',
      type: 'object',
      group: 'detalles',
      fields: [
        defineField({
          name: 'min',
          title: 'Minimo',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        }),
        defineField({
          name: 'max',
          title: 'Maximo',
          type: 'number',
          validation: (Rule) => Rule.min(1),
        }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Ubicacion',
      type: 'object',
      group: 'detalles',
      fields: [
        defineField({
          name: 'name',
          title: 'Nombre del lugar',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Pais',
          type: 'string',
          options: {
            list: [
              { title: 'Mexico', value: 'Mexico' },
              { title: 'Ecuador', value: 'Ecuador' },
              { title: 'Peru', value: 'Peru' },
              { title: 'Canada', value: 'Canada' },
            ],
          },
        }),
        defineField({
          name: 'coordinates',
          title: 'Coordenadas',
          type: 'geopoint',
        }),
      ],
    }),

    // --- Itinerario ---
    defineField({
      name: 'itinerary',
      title: 'Itinerario',
      type: 'array',
      group: 'itinerario',
      of: [
        defineArrayMember({
          type: 'itineraryDay',
        }),
      ],
    }),

    // --- Precios y fechas ---
    defineField({
      name: 'pricePerPerson',
      title: 'Precio por persona',
      description: 'Precio base por persona',
      type: 'number',
      group: 'precios',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      group: 'precios',
      options: {
        list: [
          { title: 'MXN (Peso mexicano)', value: 'MXN' },
          { title: 'USD (Dolar americano)', value: 'USD' },
        ],
      },
      initialValue: 'MXN',
    }),
    defineField({
      name: 'priceTiers',
      title: 'Rangos de precio',
      description: 'Precios escalonados por numero de personas',
      type: 'array',
      group: 'precios',
      of: [
        defineArrayMember({
          type: 'priceTier',
        }),
      ],
    }),
    defineField({
      name: 'availableDates',
      title: 'Fechas disponibles',
      type: 'array',
      group: 'precios',
      of: [
        defineArrayMember({
          type: 'packageDate',
        }),
      ],
    }),

    // --- Incluye / No incluye ---
    defineField({
      name: 'included',
      title: 'Incluye',
      type: 'array',
      group: 'incluye',
      of: [
        defineArrayMember({
          type: 'includedItem',
        }),
      ],
    }),
    defineField({
      name: 'notIncluded',
      title: 'No incluye',
      type: 'array',
      group: 'incluye',
      of: [
        defineArrayMember({
          type: 'includedItem',
        }),
      ],
    }),

    // --- Requisitos ---
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'localizedBlock',
      group: 'requisitos',
    }),
    defineField({
      name: 'whatToBring',
      title: 'Que llevar',
      type: 'localizedBlock',
      group: 'requisitos',
    }),

    // --- Galeria ---
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      group: 'galeria',
      of: [
        defineArrayMember({
          type: 'galleryItem',
        }),
      ],
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),

    // --- Configuracion ---
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      description: 'Mostrar en la seccion de paquetes destacados',
      type: 'boolean',
      group: 'configuracion',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Activo',
      description: 'Desactivar para ocultar del sitio sin eliminar',
      type: 'boolean',
      group: 'configuracion',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      description: 'Numero para ordenar manualmente (menor = primero)',
      type: 'number',
      group: 'configuracion',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      media: 'mainImage',
      difficulty: 'difficulty',
      price: 'pricePerPerson',
      currency: 'currency',
    },
    prepare({ title, media, difficulty, price, currency }) {
      const difficultyLabels: Record<string, string> = {
        principiante: 'Principiante',
        intermedio: 'Intermedio',
        avanzado: 'Avanzado',
        'alto-rendimiento': 'Alto rendimiento',
      }
      const diffLabel = difficulty ? difficultyLabels[difficulty] || difficulty : ''
      const priceLabel = price
        ? `$${price.toLocaleString('es-MX')} ${currency || 'MXN'}`
        : ''
      const parts = [diffLabel, priceLabel].filter(Boolean)
      return {
        title: title || 'Sin titulo',
        subtitle: parts.join(' | '),
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
    {
      title: 'Titulo A-Z',
      name: 'titleAsc',
      by: [{ field: 'title.es', direction: 'asc' }],
    },
    {
      title: 'Precio (menor a mayor)',
      name: 'priceAsc',
      by: [{ field: 'pricePerPerson', direction: 'asc' }],
    },
  ],
})
