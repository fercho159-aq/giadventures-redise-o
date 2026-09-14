import { NextResponse } from "next/server";

interface ContactPayload {
  nombre: string;
  email: string;
  telefono?: string;
  tipoConsulta?: string;
  mensaje: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const { nombre, email, mensaje } = body;

    // Validate required fields
    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return NextResponse.json(
        { error: "Nombre is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
      return NextResponse.json(
        { error: "Mensaje is required" },
        { status: 400 }
      );
    }

    // Log the contact form submission (Resend integration later)
    console.log("[Contact Form]", {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: body.telefono?.trim() || "",
      tipoConsulta: body.tipoConsulta || "",
      mensaje: mensaje.trim(),
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with Resend to send email notification

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
