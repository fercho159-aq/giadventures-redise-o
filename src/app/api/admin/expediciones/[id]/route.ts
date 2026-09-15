import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const expedition = await prisma.expedition.findUnique({
      where: { id },
      include: {
        itinerary: { orderBy: { dayNumber: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
        includedItems: true,
        dates: { orderBy: { startDate: "asc" } },
        priceTiers: { orderBy: { minPeople: "asc" } },
      },
    });

    if (!expedition) {
      return NextResponse.json(
        { error: "Expedicion no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(expedition);
  } catch (error) {
    console.error("[Admin Expedicion GET]", error);
    return NextResponse.json(
      { error: "Error al obtener expedicion" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify expedition exists
    const existing = await prisma.expedition.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Expedicion no encontrada" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      itinerary,
      gallery,
      includedItems,
      dates,
      priceTiers,
      ...expeditionData
    } = body;

    // Auto-generate slug from titleEs if slug is empty and titleEs changed
    if (
      !expeditionData.slug &&
      expeditionData.titleEs &&
      expeditionData.titleEs !== existing.titleEs
    ) {
      expeditionData.slug = generateSlug(expeditionData.titleEs);
    }

    // Check slug uniqueness if slug is being changed
    if (expeditionData.slug && expeditionData.slug !== existing.slug) {
      const existingSlug = await prisma.expedition.findUnique({
        where: { slug: expeditionData.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        expeditionData.slug = `${expeditionData.slug}-${Date.now()}`;
      }
    }

    // Remove fields that should not be updated directly
    delete expeditionData.id;
    delete expeditionData.createdAt;
    delete expeditionData.updatedAt;

    const expedition = await prisma.$transaction(async (tx) => {
      // Delete existing nested records to recreate them
      await tx.itineraryDay.deleteMany({ where: { expeditionId: id } });
      await tx.galleryItem.deleteMany({ where: { expeditionId: id } });
      await tx.includedItem.deleteMany({ where: { expeditionId: id } });
      await tx.expeditionDate.deleteMany({ where: { expeditionId: id } });
      await tx.priceTier.deleteMany({ where: { expeditionId: id } });

      // Update expedition and recreate nested records
      const updated = await tx.expedition.update({
        where: { id },
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

      return updated;
    });

    return NextResponse.json(expedition);
  } catch (error) {
    console.error("[Admin Expedicion PUT]", error);
    return NextResponse.json(
      { error: "Error al actualizar expedicion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.expedition.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Expedicion no encontrada" },
        { status: 404 }
      );
    }

    // Cascade delete handles nested records automatically
    await prisma.expedition.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Expedicion DELETE]", error);
    return NextResponse.json(
      { error: "Error al eliminar expedicion" },
      { status: 500 }
    );
  }
}
