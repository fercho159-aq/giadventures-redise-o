"use client";

import { use, useEffect, useState } from "react";
import ExpeditionForm from "@/components/admin/ExpeditionForm";
import type { ExpeditionData } from "@/components/admin/ExpeditionForm";

export default function EditExpedicionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [expedition, setExpedition] = useState<ExpeditionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpedition() {
      try {
        const res = await fetch(`/api/admin/expediciones/${id}`);
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/admin/login";
            return;
          }
          throw new Error("Expedicion no encontrada");
        }
        const data = await res.json();
        setExpedition(data);
      } catch {
        setError("Error al cargar la expedicion");
      } finally {
        setLoading(false);
      }
    }

    fetchExpedition();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-forest-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm mt-3">
              Cargando expedicion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !expedition) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error || "Expedicion no encontrada"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl tracking-wider text-slate-900">
          Editar Expedicion
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Modifica los datos de {expedition.titleEs}
        </p>
      </div>
      <ExpeditionForm expedition={expedition} isEdit />
    </div>
  );
}
