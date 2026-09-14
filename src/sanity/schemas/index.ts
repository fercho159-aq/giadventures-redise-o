import type { SchemaTypeDefinition } from 'sanity'

// Objects
import { localizedString } from './objects/localized-string'
import { localizedBlock } from './objects/localized-block'
import { itineraryDay } from './objects/itinerary-day'
import { packageDate } from './objects/package-date'
import { galleryItem } from './objects/gallery-item'
import { priceTier } from './objects/price-tier'
import { includedItem } from './objects/included-item'
import { seo } from './objects/seo'

// Documents
import { adventurePackage } from './documents/package'
import { category } from './documents/category'
import { review } from './documents/review'
import { teamMember } from './documents/team-member'
import { faq } from './documents/faq'
import { siteSettings } from './documents/site-settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localizedString,
  localizedBlock,
  itineraryDay,
  packageDate,
  galleryItem,
  priceTier,
  includedItem,
  seo,

  // Documents
  adventurePackage,
  category,
  review,
  teamMember,
  faq,
  siteSettings,
]
