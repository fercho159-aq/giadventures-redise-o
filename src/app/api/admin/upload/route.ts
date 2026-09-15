import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/admin/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

// Photos are downscaled in the browser first; Vercel caps request bodies at 4.5 MB
const MAX_SIZE = 4.5 * 1024 * 1024;

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporciono un archivo" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "No se pudo leer la foto. Usa una foto JPG o PNG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "La foto es demasiado pesada. Usa una de menos de 4 MB." },
        { status: 400 }
      );
    }

    // Sanitize original filename
    const originalName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");

    const filename = `${Date.now()}-${originalName}`;

    // Production: Vercel Blob (the serverless filesystem is read-only)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`expediciones/${filename}`, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ success: true, url: blob.url, filename });
    }

    if (process.env.NODE_ENV === "production") {
      console.error("[Admin Upload] BLOB_READ_WRITE_TOKEN is not set");
      return NextResponse.json(
        { error: "El almacenamiento de fotos no esta configurado. Avisa al equipo tecnico." },
        { status: 503 }
      );
    }

    // Local development: public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename });
  } catch (error) {
    console.error("[Admin Upload]", error);
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    );
  }
}
