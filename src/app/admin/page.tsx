import Link from "next/link";
import { verifySession } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  let stats = { total: 0, active: 0, featured: 0 };
  let dbError = false;

  try {
    const [total, active, featured] = await Promise.all([
      prisma.expedition.count(),
      prisma.expedition.count({ where: { isActive: true } }),
      prisma.expedition.count({ where: { isFeatured: true } }),
    ]);
    stats = { total, active, featured };
  } catch {
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
