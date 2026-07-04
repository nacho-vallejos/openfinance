"use client";

import { useState } from "react";
import { Bell, CheckCircle2, ChevronDown, Menu, ShieldCheck, User } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    title: "Conexion exitosa",
    description: "Banco Santa Fe conectado correctamente.",
    time: "Hace 5 min",
    unread: true,
  },
  {
    id: 2,
    title: "Certificado disponible",
    description: "Tu certificado fiscal y crediticio ya esta listo.",
    time: "Hace 2 horas",
    unread: true,
  },
  {
    id: 3,
    title: "Credito pre-aprobado",
    description: "Tenes una nueva oferta en pesos con TNA preferencial.",
    time: "Hace 1 dia",
    unread: false,
  },
];

export default function Navbar() {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [profileNotice, setProfileNotice] = useState("Cuenta verificada");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const runProfileAction = (label: string) => {
    setProfileNotice(`${label}: accion mock ejecutada`);
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
            OpenFinance<span className="font-extrabold text-emerald-600">+</span>
          </span>
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Santa Fe MVP
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Conexion cifrada SSL
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={cn(
              "relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none",
              showNotifications && "bg-slate-100 text-slate-900"
            )}
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 pb-3">
                  <span className="text-sm font-semibold text-slate-800">Notificaciones</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Marcar todas como leidas
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex flex-col gap-1 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50",
                        n.unread && "bg-emerald-50/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn("text-xs font-semibold text-slate-800", n.unread && "text-slate-900")}>
                          {n.title}
                        </span>
                        {n.unread && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500">{n.description}</p>
                      <span className="mt-0.5 text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full p-1 pr-3 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none",
              showProfile && "bg-slate-100"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <User className="h-4.5 w-4.5" />
            </span>
            <span className="hidden flex-col items-start text-left md:flex">
              <span className="text-xs font-semibold leading-none text-slate-800">Martina Alvarez</span>
              <span className="mt-1 text-[10px] text-slate-500">Comercio santafesino</span>
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-slate-100 px-3 py-2 pb-3">
                  <p className="text-xs font-semibold text-slate-800">Martina Alvarez</p>
                  <p className="truncate text-[10px] text-slate-500">
                    martina.alvarez@openfinanceplus.com.ar
                  </p>
                  <div className="mt-2 flex w-fit items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {profileNotice}
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => runProfileAction("Mi perfil")}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Mi perfil
                  </button>
                  <button
                    onClick={() => runProfileAction("Configuracion de cuentas")}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Configuracion de cuentas
                  </button>
                  <button
                    onClick={() => runProfileAction("Seguridad y claves")}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Seguridad y claves
                  </button>
                </div>
                <div className="mt-1 border-t border-slate-100 pt-1">
                  <button
                    onClick={() => runProfileAction("Cerrar sesion")}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                  >
                    Cerrar sesion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
