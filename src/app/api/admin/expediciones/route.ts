import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const expeditions = await prisma.expedition.findMany({
      include: {
        itinerary: { orderBy: { dayNumber: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
        includedItems: true,
        dates: { orderBy: { startDate: "asc" } },
        priceTiers: { orderBy: { minPeople: "asc" } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(expeditions);
  } catch (error) {
    console.error("[Admin Expediciones GET]", error);
    return NextResponse.json(
      { error: "Error al obtener expediciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      itinerary,
      gallery,
      includedItems,
      dates,
      priceTiers,
      ...expeditionData
    } = body;

    if (!expeditionData.titleEs || typeof expeditionData.titleEs !== "string") {
      return NextResponse.json(
        { error: "El titulo en espanol es requerido" },
        { status: 400 }
      );
    }

    if (
      expeditionData.pricePerPerson === undefined ||
      typeof expeditionData.pricePerPerson !== "number"
    ) {
      return NextResponse.json(
        { error: "El precio por persona es requerido" },
        { status: 400 }
      );
    }

    // Auto-generate slug from titleEs if not provided
    if (!expeditionData.slug) {
      expeditionData.slug = generateSlug(expeditionData.titleEs);
    }

    // Check slug uniqueness
    const existingSlug = await prisma.expedition.findUnique({
      where: { slug: expeditionData.slug },
    });

    if (existingSlug) {
      expeditionData.slug = `${expeditionData.slug}-${Date.now()}`;
    }

    const expedition = await prisma.$transaction(async (tx) => {
      const created = await tx.expedition.create({
        data: {
          ...expeditionData,
          itinerary:
            itinerary?.length > 0
              ? {
                  create: itinerary.map(
                    (day: {
                      dayNumber: number;
                      titleEs: string;
                      titleEn?: string;
                      descriptionEs?: string;
                      descriptionEn?: string;
                      elevation?: number;
                      image?: string;
                    }) => ({
                      dayNumber: day.dayNumber,
                      titleEs: day.titleEs,
                      titleEn: day.titleEn,
                      descriptionEs: day.descriptionEs,
                      descriptionEn: day.descriptionEn,
                      elevation: day.elevation,
                      image: day.image,
                    })
                  ),
                }
              : undefined,
          gallery:
            gallery?.length > 0
              ? {
                  create: gallery.map(
                    (item: {
                      type?: string;
                      imageUrl: string;
                      altText?: string;
                      captionEs?: string;
                      captionEn?: string;
                      sortOrder?: number;
                    }) => ({
                      type: item.type ?? "image",
                      imageUrl: item.imageUrl,
                      altText: item.altText,
                      captionEs: item.captionEs,
                      captionEn: item.captionEn,
                      sortOrder: item.sortOrder ?? 0,
                    })
                  ),
                }
              : undefined,
          includedItems:
            includedItems?.length > 0
              ? {
                  create: includedItems.map(
                    (item: {
                      textEs: string;
                      textEn?: string;
                      icon?: string;
                      isIncluded?: boolean;
                    }) => ({
                      textEs: item.textEs,
                      textEn: item.textEn,
                      icon: item.icon,
                      isIncluded: item.isIncluded ?? true,
                    })
                  ),
                }
              : undefined,
          dates:
            dates?.length > 0
              ? {
                  create: dates.map(
                    (date: {
                      startDate: string;
                      endDate: string;
                      spotsTotal: number;
                      spotsTaken?: number;
                      status?: string;
                    }) => ({
                      startDate: new Date(date.startDate),
                      endDate: new Date(date.endDate),
                      spotsTotal: date.spotsTotal,
                      spotsTaken: date.spotsTaken ?? 0,
                      status: date.status ?? "available",
                    })
                  ),
                }
              : undefined,
          priceTiers:
            priceTiers?.length > 0
              ? {
                  create: priceTiers.map(
                    (tier: {
                      minPeople: number;
                      maxPeople: number;
                      pricePerPerson: number;
                    }) => ({
                      minPeople: tier.minPeople,
                      maxPeople: tier.maxPeople,
                      pricePerPerson: tier.pricePerPerson,
                    })
                  ),
                }
              : undefined,
        },
        include: {
          itinerary: true,
          gallery: true,
          includedItems: true,
          dates: true,
          priceTiers: true,
        },
      });

      return created;
    });

    return NextResponse.json(expedition, { status: 201 });
  } catch (error) {
    console.error("[Admin Expediciones POST]", error);
    return NextResponse.json(
      { error: "Error al crear expedicion" },
      { status: 500 }
    );
  }
}
