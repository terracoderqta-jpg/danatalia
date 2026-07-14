import { Package, Image as ImageIcon, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getAdminStats, getAdminProducts } from "@/lib/queries";

export default async function AdminDashboard() {
  const [stats, recentProducts] = await Promise.all([
    getAdminStats(),
    getAdminProducts(),
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Bienvenido, Dana
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Productos",
            value: stats.totalProducts,
            icon: Package,
            href: "/admin/productos",
            color: "bg-blue-500",
          },
          {
            label: "Categorías",
            value: stats.totalCategories,
            icon: Tag,
            href: "/admin/categorias",
            color: "bg-green-500",
          },
          {
            label: "Banners",
            value: stats.totalBanners,
            icon: ImageIcon,
            href: "/admin/banners",
            color: "bg-purple-500",
          },
          {
            label: "Destacados",
            value: stats.featuredProducts,
            icon: TrendingUp,
            href: "/admin/productos",
            color: "bg-amber-500",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/productos" className="btn-primary text-xs">
            Gestionar Productos
          </Link>
          <Link href="/admin/banners" className="btn-outline text-xs">
            Gestionar Banners
          </Link>
          <Link href="/admin/categorias" className="btn-outline text-xs">
            Gestionar Categorías
          </Link>
          <Link href="/" className="btn-outline text-xs">
            Ver Sitio Web
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="admin-card mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Productos Recientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Producto
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Precio
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.slice(0, 5).map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-foreground hover:underline text-xs"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No hay productos. Creá el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
