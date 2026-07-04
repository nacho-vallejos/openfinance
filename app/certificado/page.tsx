"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  Download,
  FileCheck2,
  Fingerprint,
  Landmark,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";

const user = {
  name: "Martina Alvarez",
  dni: "DNI 32.458.901",
  certificateId: "OF-CERT-2026-07-03291",
  issuedAt: "03 Jul 2026",
  validUntil: "03 Oct 2026",
};

const incomeSummary = [
  {
    label: "Ingresos formales",
    value: "$ 1.120.000",
    detail: "Recibos y transferencias bancarias",
    icon: Landmark,
  },
  {
    label: "Wallets y QR",
    value: "$ 610.000",
    detail: "Cobros digitales validados",
    icon: WalletCards,
  },
  {
    label: "Actividad crypto",
    value: "$ 310.000",
    detail: "Liquidez declarada computable",
    icon: Banknote,
  },
];

export default function CertificadoPage() {
  const [notice, setNotice] = useState("Certificado listo para compartir.");
  const [offerAccepted, setOfferAccepted] = useState(false);

  const downloadCertificate = () => {
    setNotice("Descarga mock iniciada: certificado_OF_plus.pdf. El archivo quedo registrado en auditoria.");
  };

  const acceptOffer = () => {
    setOfferAccepted(true);
    setNotice("Oferta aceptada. Un asesor comercial recibira la solicitud.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <FileCheck2 className="h-4 w-4" />
            Certificado Fiscal y Capacidad Crediticia
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            Resultado verificado de Open Finance+
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Una credencial digital que consolida identidad, ingresos validados y
            capacidad financiera para presentar ante entidades de credito.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadCertificate}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Download className="h-4 w-4 text-emerald-600" />
          Descargar PDF
        </button>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
        {notice}
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-[5rem] bg-emerald-50" />
        <div className="absolute bottom-0 left-0 h-32 w-56 rounded-tr-[5rem] bg-sky-50/80" />

        <div className="relative grid gap-6 p-4 sm:p-6 md:p-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-900/10 sm:h-16 sm:w-16">
                  OF
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Credencial digital oficial
                  </p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    {user.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                      {user.dni}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      <CalendarCheck2 className="h-3.5 w-3.5 text-sky-600" />
                      Emitido {user.issuedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-800">
                <div className="flex items-center gap-2 text-sm font-black">
                  <BadgeCheck className="h-5 w-5" />
                  Certificado Verificado
                </div>
                <p className="mt-1 text-xs font-semibold text-emerald-700">
                  via Open Finance+
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {incomeSummary.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">{item.value}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Resumen validado
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">$ 2.040.000</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Ingreso mensual promedio consolidado de los ultimos 90 dias.
                  </p>
                </div>
                <div className="grid gap-2 text-sm font-semibold text-slate-600">
                  {[
                    "Datos de solo lectura",
                    "Fuentes reconciliadas",
                    "Hash de auditoria activo",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
            <div>
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-600 shadow-sm">
                  Vigente
                </span>
              </div>
              <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                <QrCode className="h-24 w-24 text-slate-900" strokeWidth={1.5} />
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  ID certificado
                </p>
                <p className="mt-1 break-all text-sm font-black text-slate-900">
                  {user.certificateId}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="font-semibold text-slate-500">Validez</span>
                <span className="font-black text-slate-900">{user.validUntil}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Nivel KYC</span>
                <span className="font-black text-emerald-700">Completo</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-xs font-bold text-slate-600">
                <LockKeyhole className="h-4 w-4 text-emerald-600" />
                Firmado digitalmente por OF+ Trust Layer
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-[2rem] border border-emerald-200 bg-emerald-600 p-1 shadow-xl shadow-emerald-600/15">
        <div className="grid gap-6 rounded-[1.8rem] bg-white p-4 sm:p-6 md:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>
            <div>
              <div className="mb-2 flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                Oferta hiper-personalizada
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Credito Pre-Aprobado para Capital de Trabajo
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Basado en tus ingresos validados y tu volumen en wallets, tenes
                una linea disponible con desembolso acelerado y evaluacion sin
                documentacion adicional.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 lg:min-w-80">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monto pre-aprobado
            </p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">$ 12.800.000</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
              <div className="rounded-xl bg-white p-3">
                TNA
                <span className="mt-1 block text-base font-black text-emerald-700">42%</span>
              </div>
              <div className="rounded-xl bg-white p-3">
                Plazo
                <span className="mt-1 block text-base font-black text-slate-950">18 meses</span>
              </div>
            </div>
            <button
              type="button"
              onClick={acceptOffer}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-700"
            >
              Aceptar Oferta
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {offerAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            aria-label="Cerrar confirmacion de oferta"
            onClick={() => setOfferAccepted(false)}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accepted-offer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setOfferAccepted(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 id="accepted-offer-title" className="mt-5 text-xl font-black text-slate-950 dark:text-white">
              Oferta aceptada
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Generamos una solicitud simulada para el banco con certificado,
              ingresos validados y capacidad crediticia. Estado: pendiente de contacto.
            </p>
            <button
              type="button"
              onClick={() => setOfferAccepted(false)}
              className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
