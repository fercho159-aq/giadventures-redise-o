import Link from "next/link";
import { verifySession } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  let stats = { total: 0, active: 0, featured: 0, bookings: 0, paid: 0, pending: 0 };
  let recentBookings: Awaited<ReturnType<typeof prisma.booking.findMany>> = [];
  let dbError = false;

  try {
    const [total, active, featured, bookings, paid, pending, recent] = await Promise.all([
      prisma.expedition.count(),
      prisma.expedition.count({ where: { isActive: true } }),
      prisma.expedition.count({ where: { isFeatured: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "paid" } }),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    stats = { total, active, featured, bookings, paid, pending };
    recentBookings = recent;
  } catch (error) {
    console.error("[Admin Dashboard] DB Error:", error);
    console.error("[Admin Dashboard] DATABASE_URL set:", !!process.env.DATABASE_URL);
    dbError = true;
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wider text-slate-900">
          Panel de Administracion
        </h1>
        <p className="text-slate-500 mt-1">
          Bienvenido al panel de administracion de Adventures GI
        </p>
      </div>

      {dbError ? (
        <div className="bg-summit-50 border border-summit-200 rounded-xl p-6">
          <h2 className="font-heading text-xl text-summit-800 mb-2">
            Base de datos no conectada
          </h2>
          <p className="text-summit-700 text-sm mb-4">
            No se pudo conectar a la base de datos. Verifica la configuracion:
          </p>
          <ol className="list-decimal list-inside text-sm text-summit-700 space-y-1">
            <li>
              Configura la variable <code className="bg-summit-100 px-1 py-0.5 rounded">DATABASE_URL</code> en tu archivo <code className="bg-summit-100 px-1 py-0.5 rounded">.env</code>
            </li>
            <li>
              Ejecuta <code className="bg-summit-100 px-1 py-0.5 rounded">npx prisma db push</code> para sincronizar el esquema
            </li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Total expediciones</p>
              <p className="text-3xl font-semibold text-slate-900">
                {stats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Activas</p>
              <p className="text-3xl font-semibold text-forest-700">
                {stats.active}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Destacadas</p>
              <p className="text-3xl font-semibold text-summit-600">
                {stats.featured}
              </p>
            </div>
          </div>

          {/* Booking stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Reservas</p>
              <p className="text-3xl font-semibold text-slate-900">
                {stats.bookings}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Pagadas</p>
              <p className="text-3xl font-semibold text-forest-700">
                {stats.paid}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Pendientes</p>
              <p className="text-3xl font-semibold text-summit-600">
                {stats.pending}
              </p>
            </div>
          </div>

          {/* Recent bookings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl tracking-wider text-slate-900">
                Ultimas reservas
              </h2>
              <Link
                href="/admin/reservas"
                className="text-sm font-medium text-forest-700 hover:text-forest-800"
              >
                Ver todas
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-slate-500">Aun no hay reservas.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">
                        {b.customerName}{" "}
                        <span className="font-normal text-slate-500">· {b.expeditionName}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.people} {b.people === 1 ? "persona" : "personas"} ·{" "}
                        {new Intl.NumberFormat("es-MX", { style: "currency", currency: b.currency }).format(b.totalPrice)}
                        {b.paymentMethod === "test" && " · Pago de prueba"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {b.status === "paid" ? "Pagada" : b.status === "cancelled" ? "Cancelada" : "Pendiente"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-heading text-xl tracking-wider text-slate-900 mb-4">
              Acciones rapidas
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/expediciones/nuevo"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-700 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
              >
                + Nueva Expedicion
              </Link>
              <Link
                href="/admin/expediciones"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Ver todas las expediciones
              </Link>
              <Link
                href="/admin/reservas"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Ver reservas
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
