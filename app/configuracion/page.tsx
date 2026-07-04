"use client";

import { useState } from "react";
import { Bell, CheckCircle2, CreditCard, Key, Save, Settings, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Perfil", icon: User },
  { name: "Seguridad", icon: Key },
  { name: "Notificaciones", icon: Bell },
  { name: "Facturacion", icon: CreditCard },
];

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("Perfil");
  const [savedMessage, setSavedMessage] = useState("Cambios locales sin enviar.");
  const [form, setForm] = useState({
    businessName: "Alvarez Insumos Comerciales",
    cuit: "CUIT 27-32458901-4",
    email: "martina.alvarez@openfinanceplus.com.ar",
    phone: "+54 342 555-0188",
  });

  const save = () => {
    setSavedMessage(`Mock guardado: ${form.businessName}.`);
  };

  const cancel = () => {
    setForm({
      businessName: "Alvarez Insumos Comerciales",
      cuit: "CUIT 27-32458901-4",
      email: "martina.alvarez@openfinanceplus.com.ar",
      phone: "+54 342 555-0188",
    });
    setSavedMessage("Cambios descartados y formulario restaurado.");
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Ajustes generales
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Configura el espacio de trabajo del comercio, permisos, alertas y datos fiscales
          para operar el MVP santafesino.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {tabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSavedMessage(`Seccion activa: ${item.name}.`);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeTab === "Perfil" ? "Perfil del comercio" : activeTab}
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Estos controles son mock, pero cambian estado y dejan feedback visible.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {savedMessage}
              </span>
            </div>

            {activeTab === "Perfil" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Razon social
                  </span>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, businessName: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CUIT
                  </span>
                  <input
                    type="text"
                    value={form.cuit}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, cuit: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Correo administrativo
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Telefono
                  </span>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {activeTab} configurado para demo
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Esta seccion queda preparada para el MVP. El boton de guardar confirma la
                  accion sin llamar a backend real.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={cancel}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/10 transition-colors hover:bg-emerald-700"
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <Settings className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-black text-slate-900">Estado del MVP</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  La configuracion queda local al navegador durante la demo. Es intencional
                  para mostrar flujo monolitico sin persistencia real todavia.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
