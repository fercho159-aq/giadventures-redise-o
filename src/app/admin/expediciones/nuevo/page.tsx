"use client";

import ExpeditionForm from "@/components/admin/ExpeditionForm";

export default function NuevaExpedicionPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl tracking-wider text-slate-900">
          Nueva Expedicion
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Completa los campos para crear una nueva expedicion
        </p>
      </div>
      <ExpeditionForm />
    </div>
  );
}
