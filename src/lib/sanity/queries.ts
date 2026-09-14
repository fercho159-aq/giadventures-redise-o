import { groq } from 'next-sanity';

// ---------------------------------------------------------------------------
// Packages (Expeditions)
// ---------------------------------------------------------------------------

export const getAllPackagesQuery = groq`
  *[_type == "package" && isActive == true] | order(sortOrder asc) {
    _id,
    "title": title[$locale],
    "slug": slug.current,
    "subtitle": subtitle[$locale],
    "excerpt": excerpt[$locale],
    mainImage,
    difficulty,
    altitude,
    duration,
    pricePerPerson,
    currency,
    "category": category->{
      "title": title[$locale],
      "slug": slug.current
    },
    availableDates[status != "full"],
    isFeatured
  }
`;

export const getPackageBySlugQuery = groq`
  *[_type == "package" && slug.current == $slug][0] {
    _id,
    "title": title[$locale],
    "slug": slug.current,
    "subtitle": subtitle[$locale],
    "description": description[$locale],
    "excerpt": excerpt[$locale],
    mainImage,
    gallery,
    difficulty,
    altitude,
    duration,
    pricePerPerson,
    currency,
    "category": category->{
      "title": title[$locale],
      "slug": slug.current
    },
    "included": included[$locale],
    "notIncluded": notIncluded[$locale],
    "itinerary": itinerary[] {
      "title": title[$locale],
      "description": description[$locale],
      day
    },
    "requirements": requirements[$locale],
    "whatToBring": whatToBring[$locale],
    map,
    availableDates[] {
      date,
      status,
      spotsLeft,
      maxSpots
    },
    isFeatured,
    seo,
    "reviews": *[_type == "review" && package._ref == ^._id && isApproved == true] | order(date desc) {
      _id,
      name,
      rating,
      "comment": comment[$locale],
      date,
      avatar,
      expeditionDate
    },
    "faqs": *[_type == "faq" && package._ref == ^._id] | order(sortOrder asc) {
      _id,
      "question": question[$locale],
      "answer": answer[$locale]
    },
    "related": *[_type == "package" && isActive == true && slug.current != $slug && category._ref == ^.category._ref] | order(sortOrder asc) [0...3] {
      _id,
      "title": title[$locale],
      "slug": slug.current,
      mainImage,
      difficulty,
      altitude,
      duration,
      pricePerPerson,
      currency
    }
  }
`;

export const getFeaturedPackagesQuery = groq`
  *[_type == "package" && isActive == true && isFeatured == true] | order(sortOrder asc) {
    _id,
    "title": title[$locale],
    "slug": slug.current,
    "subtitle": subtitle[$locale],
    "excerpt": excerpt[$locale],
    mainImage,
    difficulty,
    altitude,
    duration,
    pricePerPerson,
    currency,
    "category": category->{
      "title": title[$locale],
      "slug": slug.current
    },
    availableDates[status != "full"][0],
    isFeatured
  }
`;

export const getPackagesByCategoryQuery = groq`
  *[_type == "package" && isActive == true && category->slug.current == $categorySlug] | order(sortOrder asc) {
    _id,
    "title": title[$locale],
    "slug": slug.current,
    "subtitle": subtitle[$locale],
    "excerpt": excerpt[$locale],
    mainImage,
    difficulty,
    altitude,
    duration,
    pricePerPerson,
    currency,
    "category": category->{
      "title": title[$locale],
      "slug": slug.current
    },
    availableDates[status != "full"],
    isFeatured
  }
`;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const getAllCategoriesQuery = groq`
  *[_type == "category"] | order(sortOrder asc) {
    _id,
    "title": title[$locale],
    "slug": slug.current,
    "description": description[$locale],
    image
  }
`;

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const getAllReviewsQuery = groq`
  *[_type == "review" && isApproved == true] | order(date desc) {
    _id,
    name,
    rating,
    "comment": comment[$locale],
    date,
    avatar,
    expeditionDate,
    "package": package->{
      "title": title[$locale],
      "slug": slug.current
    }
  }
`;

export const getFeaturedReviewsQuery = groq`
  *[_type == "review" && isApproved == true && isFeatured == true] | order(date desc) [0...6] {
    _id,
    name,
    rating,
    "comment": comment[$locale],
    date,
    avatar,
    expeditionDate,
    "package": package->{
      "title": title[$locale],
      "slug": slug.current
    }
  }
`;

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export const getTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(sortOrder asc) {
    _id,
    name,
    "role": role[$locale],
    "bio": bio[$locale],
    photo,
    certifications,
    socialLinks
  }
`;

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------

export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "heroTitle": heroTitle[$locale],
    "heroSubtitle": heroSubtitle[$locale],
    heroBgImage,
    statsClimbers,
    statsExpeditions,
    statsYears,
    statsSuccessRate,
    "aboutText": aboutText[$locale],
    "missionText": missionText[$locale],
    logoLight,
    logoDark
  }
`;

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export const getFaqsByPackageQuery = groq`
  *[_type == "faq" && package._ref == $packageId] | order(sortOrder asc) {
    _id,
    "question": question[$locale],
    "answer": answer[$locale]
  }
`;

export const getGeneralFaqsQuery = groq`
  *[_type == "faq" && !defined(package)] | order(sortOrder asc) {
    _id,
    "question": question[$locale],
    "answer": answer[$locale]
  }
`;
