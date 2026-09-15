import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[Admin Reservas GET]", error);
    return NextResponse.json(
      { error: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}
