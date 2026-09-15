"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Expedition {
  id: string;
  titleEs: string;
  slug: string;
  mainImage: string | null;
  difficulty: string;
  pricePerPerson: number;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
}

const difficultyLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  "alto-rendimiento": "Alto Rendimiento",
};

export default function ExpedicionesPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchExpeditions() {
    try {
      const res = await fetch("/api/admin/expediciones");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Error al obtener expediciones");
      }
      const data = await res.json();
      setExpeditions(data);
    } catch {
      setError("Error al cargar las expediciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExpeditions();
  }, []);

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/expediciones/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setDeleteId(null);
      fetchExpeditions();
    } catch {
      setError("Error al eliminar la expedicion");
    } finally {
      setDeleting(false);
    }
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
    }).format(price);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl tracking-wider text-slate-900">
          Expediciones
        </h1>
        <Link
          href="/admin/expediciones/nuevo"
          className="adm-nueva inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-forest-700 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Expedicion
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-forest-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm mt-3">
            Cargando expediciones...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && expeditions.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            No hay expediciones registradas
          </p>
          <Link
            href="/admin/expediciones/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-700 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear primera expedicion
          </Link>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && expeditions.length > 0 && (
        <ul className="adm-exp-cards sm:hidden space-y-3">
          {expeditions.map((exp) => (
            <li
              key={exp.id}
              className="adm-exp-card flex gap-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm"
            >
              <Link
                href={`/admin/expediciones/${exp.id}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100"
              >
                {exp.mainImage ? (
                  <Image src={exp.mainImage} alt={exp.titleEs} fill className="object-cover" sizes="80px" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-slate-400">Sin img</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/expediciones/${exp.id}`} className="block">
                  <p className="font-medium text-slate-900 truncate">{exp.titleEs}</p>
                  <p className="text-sm text-slate-600">
                    {formatPrice(exp.pricePerPerson, exp.currency)}
                    <span className="text-xs text-slate-400"> · {difficultyLabels[exp.difficulty] || exp.difficulty}</span>
                  </p>
                </Link>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      exp.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {exp.isActive ? "Activa" : "Inactiva"}
                  </span>
                  {exp.isFeatured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-summit-100 text-summit-700">
                      Destacada
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-between">
                <Link
                  href={`/admin/expediciones/${exp.id}`}
                  className="adm-editar p-2 text-slate-500 hover:text-forest-600 hover:bg-slate-100 rounded-lg"
                  title="Editar"
                  aria-label={`Editar ${exp.titleEs}`}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteId(exp.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Eliminar"
                  aria-label={`Eliminar ${exp.titleEs}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Table */}
      {!loading && expeditions.length > 0 && (
        <div className="hidden sm:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Imagen
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Titulo
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                    Dificultad
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                    Precio
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">
                    Destacada
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expeditions.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {exp.mainImage ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative">
                          <Image
                            src={exp.mainImage}
                            alt={exp.titleEs}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-400 text-xs">
                            Sin img
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {exp.titleEs}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        /{exp.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-600">
                        {difficultyLabels[exp.difficulty] || exp.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-600">
                        {formatPrice(exp.pricePerPerson, exp.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          exp.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {exp.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {exp.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-summit-100 text-summit-700">
                          Destacada
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/expediciones/${exp.id}`}
                          className="p-2 text-slate-400 hover:text-forest-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(exp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="font-heading text-xl text-slate-900 mb-2">
              Eliminar expedicion
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta accion no se puede deshacer. Se eliminara permanentemente
              esta expedicion y toda su informacion asociada. Sus reservas se
              conservan en la seccion Reservas.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
