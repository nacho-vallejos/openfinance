"use client";

import { ArrowLeft, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import GlobalHeader from "@/components/GlobalHeader";
import HelpWidget from "@/components/HelpWidget";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { cn } from "@/lib/utils";

const moduleLabels: Record<string, string> = {
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

function ModuleNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "home";
  const label = moduleLabels[segment] ?? segment.replaceAll("-", " ");

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/home");
  };

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Modulo actual
        </p>
        <p className="mt-1 truncate text-sm font-black capitalize text-slate-900 dark:text-white">
          {label}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          onClick={goBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <button
          onClick={() => router.push("/home")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-emerald-700"
        >
          <Home className="h-4 w-4" />
          Inicio
        </button>
      </div>
    </div>
  );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isHydrated } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100",
        !isHydrated && "opacity-0"
      )}
    >
      <Sidebar />
      <GlobalHeader />
      <main
        className={cn(
          "min-w-0 px-4 py-5 transition-[padding] duration-300 md:pr-8 md:pt-8",
          isCollapsed ? "md:pl-24" : "md:pl-64"
        )}
      >
        <div className="mx-auto w-full max-w-7xl">
          <ModuleNavigation />
          {children}
        </div>
      </main>
      <HelpWidget />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppShellContent>{children}</AppShellContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}
