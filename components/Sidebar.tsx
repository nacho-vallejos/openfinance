"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  FileSignature,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Scale,
  X,
  Shield,
  Settings,
  Building2,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";

const routes = [
  {
    name: "Inicio",
    path: "/home",
    icon: LayoutDashboard,
    description: "Vision consolidada en pesos",
  },
  {
    name: "Catalogo Bancario",
    path: "/catalogo-bancos",
    icon: Building2,
    description: "Politicas y tasas base",
  },
  {
    name: "Conexiones",
    path: "/conexiones",
    icon: Link2,
    description: "Bancos, wallets y ARCA",
  },
  {
    name: "Emisor Creditos",
    path: "/emisor-creditos",
    icon: FileSignature,
    description: "Contratos y cuadre",
  },
  {
    name: "Elegibilidad",
    path: "/simulador-elegibilidad",
    icon: CreditCard,
    description: "Tarjetas y prestamos",
  },
  {
    name: "Asistente Fiscal",
    path: "/asistente-fiscal",
    icon: Scale,
    description: "Fiscal, caja y credito",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isHydrated } =
    useSidebar();
  const { canAccessPath } = useAuth();
  const visibleRoutes = routes.filter((route) => canAccessPath(route.path));
  const showExpandedContent = !isCollapsed || isMobileOpen;
  const showCollapsedTooltips = isCollapsed && !isMobileOpen;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[min(18rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col border-r border-slate-200 bg-white transition-all duration-300 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-20" : "md:w-64",
          !isHydrated && "md:transition-none"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all duration-200",
              isCollapsed && !isMobileOpen && "md:w-full md:justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white shadow-md shadow-emerald-600/20">
              OF
            </div>
            {showExpandedContent && (
              <span className="whitespace-nowrap font-sans text-lg font-bold tracking-tight text-slate-900 animate-in fade-in duration-300">
                OpenFinance<span className="font-extrabold text-emerald-600">+</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
          {visibleRoutes.map((route) => {
            const isActive =
              pathname === route.path ||
              (route.path === "/home" && (pathname === "/" || pathname === "/dashboard"));
            const Icon = route.icon;

            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  isCollapsed && !isMobileOpen && "md:justify-center md:px-0",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-emerald-600" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />

                {showExpandedContent ? (
                  <div className="flex flex-col text-left">
                    <span className="font-semibold leading-none">{route.name}</span>
                    <span className="mt-1 text-[10px] font-normal leading-none text-slate-400">
                      {route.description}
                    </span>
                  </div>
                ) : showCollapsedTooltips ? (
                  <div className="absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-md group-hover:block">
                    <p className="font-semibold text-slate-100">{route.name}</p>
                    <p className="mt-0.5 text-[10px] font-normal text-slate-400">
                      {route.description}
                    </p>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-slate-100 bg-slate-50/50 p-4">
          <Link
            href="/configuracion"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800",
              isCollapsed && !isMobileOpen && "md:justify-center md:px-0"
            )}
          >
            <Settings className="h-4.5 w-4.5 shrink-0 text-slate-400 group-hover:text-slate-600" />
            {showExpandedContent ? (
              <span className="font-semibold">Perfil y certificado</span>
            ) : showCollapsedTooltips ? (
              <div className="absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-md group-hover:block">
                Perfil y certificado
              </div>
            ) : null}
          </Link>

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-2.5 text-[10px] text-slate-500 shadow-sm transition-all duration-200",
              isCollapsed && !isMobileOpen ? "md:justify-center" : "px-3"
            )}
          >
            <Shield className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
            {showExpandedContent && (
              <div className="flex flex-col">
                <span className="font-semibold leading-tight text-slate-700">MVP monolitico</span>
                <span className="mt-0.5 text-[9px] text-slate-400">Datos cifrados OF+</span>
              </div>
            )}
          </div>

          <div className="hidden pt-1 md:block">
            <button
              type="button"
              onClick={toggleCollapse}
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
              aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Colapsar</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
