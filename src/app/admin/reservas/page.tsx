"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, RefreshCw } from "lucide-react";

interface Booking {
  id: string;
  expeditionId: string | null;
  expeditionSlug: string | null;
  expeditionName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  people: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentId: string | null;
  notes: string | null;
  dateSelected: string | null;
  dateEnd: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagada" },
  { value: "cancelled", label: "Cancelada" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const METHOD_LABELS: Record<string, string> = {
  // Demo checkout (no charge) is presented as a card payment
  test: "Tarjeta",
  stripe: "Stripe",
  paypal: "PayPal",
};

const FILTERS = [{ value: "all", label: "Todas" }, ...STATUS_OPTIONS];

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
}

// Departure dates are calendar days stored at UTC midnight
function formatDay(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/reservas");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Error al obtener reservas");
      }
      setBookings(await res.json());
    } catch {
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reservas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated: Booking = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch {
      setError("Error al actualizar el estado de la reserva");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reservas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setDeleteId(null);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Error al eliminar la reserva");
    } finally {
      setDeleting(false);
    }
  }

  const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const countFor = (value: string) =>
    value === "all" ? bookings.length : bookings.filter((b) => b.status === value).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl tracking-wider text-slate-900">
          Reservas
        </h1>
        <button
          onClick={() => {
            setLoading(true);
            fetchBookings();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
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

      {/* Filters */}
      <div className="adm-filtros flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-forest-700 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f.label} ({countFor(f.value)})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-forest-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm mt-3">Cargando reservas...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && visible.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">
            {bookings.length === 0
              ? "Aun no hay reservas. Las compras hechas desde la web apareceran aqui."
              : "No hay reservas con este estado"}
          </p>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && visible.length > 0 && (
        <ul className="adm-res-cards md:hidden space-y-3">
          {visible.map((b) => (
            <li key={b.id} className="adm-res-card bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{b.customerName}</p>
                  <a
                    href={`mailto:${b.customerEmail}`}
                    className="block text-xs text-slate-500 truncate hover:text-forest-700"
                  >
                    {b.customerEmail}
                  </a>
                  {b.customerPhone && <p className="text-xs text-slate-500">{b.customerPhone}</p>}
                </div>
                <p className="text-base font-semibold text-slate-900 whitespace-nowrap">
                  {formatPrice(b.totalPrice, b.currency)}
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-800">
                  {b.expeditionName}
                  {!b.expeditionId && <span className="text-xs font-normal text-slate-400"> (eliminada)</span>}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDay(b.dateSelected)}
                  {b.dateEnd && b.dateEnd !== b.dateSelected && ` – ${formatDay(b.dateEnd)}`}
                  {" · "}
                  {b.people} {b.people === 1 ? "persona" : "personas"}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <select
                  value={b.status}
                  disabled={updatingId === b.id}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className={`adm-res-estado rounded-full border px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-50 ${
                    STATUS_STYLES[b.status] ?? "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                  aria-label="Estado de la reserva"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {METHOD_LABELS[b.paymentMethod ?? ""] ?? "—"}
                </span>
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="ml-auto p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Eliminar"
                  aria-label={`Eliminar reserva de ${b.customerName}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Folio <span className="font-mono">{b.id}</span> · {formatDateTime(b.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Table */}
      {!loading && visible.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Expedicion</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Personas</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Metodo</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Creada</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.customerName}</p>
                      <a
                        href={`mailto:${b.customerEmail}`}
                        className="block text-xs text-slate-500 hover:text-forest-700"
                      >
                        {b.customerEmail}
                      </a>
                      {b.customerPhone && (
                        <p className="text-xs text-slate-500">{b.customerPhone}</p>
                      )}
                      <p className="text-[11px] text-slate-400 font-mono mt-1">{b.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      {b.expeditionId ? (
                        <Link
                          href={`/admin/expediciones/${b.expeditionId}`}
                          className="font-medium text-slate-900 hover:text-forest-700"
                        >
                          {b.expeditionName}
                        </Link>
                      ) : (
                        <p className="font-medium text-slate-900">
                          {b.expeditionName}{" "}
                          <span className="text-xs font-normal text-slate-400">(eliminada)</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDay(b.dateSelected)}
                        {b.dateEnd && b.dateEnd !== b.dateSelected && ` – ${formatDay(b.dateEnd)}`}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{b.people}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">
                      {formatPrice(b.totalPrice, b.currency)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {METHOD_LABELS[b.paymentMethod ?? ""] ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`rounded-full border px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-50 ${
                          STATUS_STYLES[b.status] ?? "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                        aria-label="Estado de la reserva"
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(b.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setDeleteId(b.id)}
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
              Eliminar reserva
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta accion no se puede deshacer. Si la reserva estaba pagada, sus
              lugares se liberan en la fecha correspondiente.
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
