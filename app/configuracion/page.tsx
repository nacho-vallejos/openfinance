"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck2,
  Fingerprint,
  Key,
  QrCode,
  Save,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Perfil", icon: User },
  { name: "Seguridad", icon: Key },
  { name: "Notificaciones", icon: Bell },
  { name: "Facturacion", icon: CreditCard },
];

const certificate = {
  holder: "Martina Alvarez",
  dni: "DNI 32.458.901",
  id: "OF-CERT-2026-07-03291",
  issuedAt: "03 Jul 2026",
  validUntil: "03 Oct 2026",
  income: "$ 2.040.000",
  status: "Verificado",
};

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
          Perfil y certificado
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Modifica los datos del comercio y revisa en paralelo el certificado vigente
          que se comparte con bancos y motores de credito.
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
              <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
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

                <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Certificado vigente
                      </p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">
                        {certificate.holder}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {certificate.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-2xl bg-white p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-slate-500">
                        <Fingerprint className="h-4 w-4 text-emerald-600" />
                        DNI
                      </span>
                      <strong className="text-right text-slate-900">{certificate.dni}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-slate-500">
                        <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
                        Validez
                      </span>
                      <strong className="text-right text-slate-900">{certificate.validUntil}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Ingreso validado</span>
                      <strong className="text-right text-slate-900">{certificate.income}</strong>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-3">
                    <QrCode className="h-20 w-20 text-slate-950" strokeWidth={1.5} />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      ID certificado
                    </p>
                    <p className="mt-1 break-all text-xs font-black text-slate-900">
                      {certificate.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSavedMessage("Descarga mock iniciada: certificado_OF_plus.pdf.")
                    }
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    Descargar certificado
                  </button>
                </aside>
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
