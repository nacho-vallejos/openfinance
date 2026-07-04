"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  FileCheck2,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";
import { useTheme } from "@/components/ThemeContext";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  home: "Inicio",
  dashboard: "Inicio",
  conexiones: "Conexiones",
  certificado: "Certificado",
  "certificado-fiscal": "Certificado",
  "ofertas-credito": "Ofertas de Credito",
  "asistente-fiscal": "Asistente Fiscal",
  "catalogo-bancos": "Catalogo Bancario",
  configuracion: "Configuracion",
  onboarding: "Onboarding",
};

const searchItems = [
  { label: "Conectar Mercado Pago", href: "/conexiones" },
  { label: "Ver Score de Salud Financiera", href: "/home" },
  { label: "Simular credito productivo", href: "/ofertas-credito" },
  { label: "Revisar asistente fiscal", href: "/asistente-fiscal" },
  { label: "Consultar catalogo bancario", href: "/catalogo-bancos" },
  { label: "Descargar certificado fiscal", href: "/certificado" },
  { label: "Consultar datos compartidos", href: "/conexiones" },
  { label: "Ayuda sobre Decreto 353/2025", href: "/conexiones" },
];

const notifications = [
  {
    title: "Oferta lista para revision",
    detail: "Capital de trabajo pre-aprobado por ingresos consolidados.",
    time: "Hace 8 min",
    icon: TrendingUp,
  },
  {
    title: "ARCA sincronizado",
    detail: "Tu certificado fiscal fue actualizado correctamente.",
    time: "Hace 1 h",
    icon: ShieldCheck,
  },
  {
    title: "Nuevo movimiento relevante",
    detail: "Mercado Pago incremento 15% el volumen mensual.",
    time: "Hoy",
    icon: Bell,
  },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, isHydrated, setIsMobileOpen } = useSidebar();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      return [{ label: "Inicio", href: "/home" }];
    }

    return parts.map((part, index) => {
      const href = `/${parts.slice(0, index + 1).join("/")}`;
      return {
        href,
        label: routeLabels[part] ?? part.replaceAll("-", " "),
      };
    });
  }, [pathname]);

  const filteredResults = searchItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/home");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[margin] duration-300 dark:border-slate-800 dark:bg-slate-950/80",
        isCollapsed ? "md:ml-20" : "md:ml-64",
        !isHydrated && "md:transition-none"
      )}
    >
      <div className="flex min-h-14 items-center gap-1 px-2 sm:gap-2 sm:px-4 md:h-16 md:gap-3 md:px-6">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={goBack}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:h-10 md:w-10"
          aria-label="Volver atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => router.push("/home")}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:h-10 md:w-10"
          aria-label="Volver al inicio"
        >
          <Home className="h-5 w-5" />
        </button>

        <nav className="hidden min-w-0 flex-1 items-center gap-1 text-sm font-semibold text-slate-500 md:flex">
          <button
            onClick={() => router.push("/home")}
            className="rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            OpenFinance+
          </button>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <span key={crumb.href} className="flex min-w-0 items-center gap-1">
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                <button
                  onClick={() => !isLast && router.push(crumb.href)}
                  disabled={isLast}
                  className={cn(
                    "truncate rounded-lg px-2 py-1 capitalize transition-colors",
                    isLast
                      ? "cursor-default text-slate-950"
                      : "hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {crumb.label}
                </button>
              </span>
            );
          })}
        </nav>

        <div className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              setIsSearchOpen(true);
            }}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Buscar operaciones, ofertas o ayuda..."
            className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-20 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:ring-emerald-950"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-400 shadow-sm">
            Ctrl K
          </kbd>

          {isSearchOpen && (query || isSearchFocused) && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Cerrar busqueda"
                onClick={() => setIsSearchOpen(false)}
              />
              <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resultados simulados
                </div>
                {(filteredResults.length ? filteredResults : [{ label: "Sin resultados", href: "" }]).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                      }
                      setQuery(item.label);
                      setIsSearchOpen(false);
                    }}
                    disabled={!item.href}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Search className="h-4 w-4 text-emerald-600" />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => {
            setIsSearchOpen(true);
            inputRef.current?.focus();
          }}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:h-10 md:w-10"
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo noche"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen((current) => !current)}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:h-10 md:w-10"
            aria-expanded={isNotificationsOpen}
            aria-label="Abrir notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          {isNotificationsOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Cerrar notificaciones"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 top-12 z-20 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-black text-slate-950 dark:text-white">
                      Notificaciones
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Alertas financieras y operativas
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {notifications.length} nuevas
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {notifications.map((notification) => {
                    const Icon = notification.icon;

                    return (
                      <button
                        key={notification.title}
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          router.push(
                            notification.title.includes("Oferta")
                              ? "/ofertas-credito"
                              : notification.title.includes("ARCA")
                                ? "/certificado"
                                : "/home"
                          );
                        }}
                        className="flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-black text-slate-900 dark:text-white">
                            {notification.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {notification.detail}
                          </span>
                          <span className="mt-1 block text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            {notification.time}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((current) => !current)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-0 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:h-10 md:w-auto md:gap-2 md:rounded-full md:p-1 md:pr-3"
            aria-expanded={isProfileOpen}
            aria-label="Abrir perfil"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden lg:inline">Martina</span>
          </button>

          {isProfileOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Cerrar perfil"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-12 z-20 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                  <p className="text-sm font-black text-slate-950 dark:text-white">
                    Martina Alvarez
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Comercio santafesino - Perfil verificado
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/certificado");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <FileCheck2 className="h-4 w-4 text-emerald-600" />
                    Ver certificado crediticio
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/configuracion");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    Ajustes de cuenta
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-slate-500" />
                    )}
                    {isDark ? "Usar modo claro" : "Usar modo noche"}
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/onboarding");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4 text-slate-500" />
                    Reiniciar demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar operaciones, ofertas o ayuda..."
            className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-400">
            Ctrl K
          </kbd>
        </div>
      </div>
    </header>
  );
}
