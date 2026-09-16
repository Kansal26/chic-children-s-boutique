import { createFileRoute, Outlet, Link, redirect, useRouterState, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Layers, 
  LogOut,
  PackageSearch
} from "lucide-react";

// Mock auth state (in memory for prototype)
export const adminAuth = {
  isAuthenticated: false,
  login: () => { adminAuth.isAuthenticated = true; },
  logout: () => { adminAuth.isAuthenticated = false; }
};

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (!adminAuth.isAuthenticated && location.pathname !== "/admin/login") {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: AdminLayout,
});

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: Package, label: "Products", to: "/admin/products" },
  { icon: PackageSearch, label: "Inventory", to: "/admin/inventory" },
  { icon: FolderTree, label: "Categories", to: "/admin/categories" },
  { icon: Layers, label: "Collections", to: "/admin/collections" },
];

function AdminLayout() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  
  // Don't show sidebar on login page
  if (routerState.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/admin" className="font-serif text-xl tracking-wide text-foreground">
            Maison Petit
          </Link>
          <span className="ml-2 text-[0.6rem] uppercase tracking-widest text-muted-foreground font-sans">Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors [&.active]:bg-slate-900 [&.active]:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => {
              adminAuth.logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center px-8 shrink-0 shadow-sm">
          <h1 className="text-sm font-medium text-slate-500 capitalize">
            {routerState.location.pathname.split("/").slice(2).join(" / ") || "Dashboard"}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
