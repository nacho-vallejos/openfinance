"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Coins,
  FileCheck2,
  HandCoins,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const offers = [
  {
    id: "capital-local",
    title: "Capital de trabajo comercio local",
    description: "Para stock, proveedores y flujo operativo de comercios santafesinos.",
    rate: 0.42,
    rateLabel: "42% TNA",
    maxTerm: 18,
    maxAmount: 12800000,
    badge: "Mejor ajuste",
  },
  {
    id: "agro-servicios",
    title: "Linea pyme agro-servicios",
    description: "Para servicios vinculados a campo, maquinaria, insumos o temporada.",
    rate: 0.39,
    rateLabel: "39% TNA",
    maxTerm: 24,
    maxAmount: 25000000,
    badge: "Mayor cupo",
  },
];

const steps = [
  "Elegis una linea",
  "Ajustas monto y plazo",
  "Enviamos legajo al banco",
];

export default function OfertasCreditoClient() {
  const [amount, setAmount] = useState(8500000);
  const [term, setTerm] = useState(18);
  const [selectedOfferId, setSelectedOfferId] = useState(offers[0].id);
  const [message, setMessage] = useState("Simulacion lista para enviar.");
  const [approvalState, setApprovalState] = useState<"idle" | "reviewing" | "approved">("idle");
  const [showSummary, setShowSummary] = useState(false);
  const approvalTimerRef = useRef<number | null>(null);

  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId) ?? offers[0];
  const normalizedAmount = Math.min(amount, selectedOffer.maxAmount);
  const normalizedTerm = Math.min(term, selectedOffer.maxTerm);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = selectedOffer.rate / 12;
    const payment =
      (normalizedAmount * monthlyRate * Math.pow(1 + monthlyRate, normalizedTerm)) /
      (Math.pow(1 + monthlyRate, normalizedTerm) - 1);

    return Math.round(payment);
  }, [normalizedAmount, normalizedTerm, selectedOffer.rate]);

  const totalCost = monthlyPayment * normalizedTerm;
  const affordability = Math.min(Math.round((monthlyPayment / 2100000) * 100), 100);
  const availableAmount = selectedOffer.maxAmount - normalizedAmount;

  const selectOffer = (offerId: string) => {
    const offer = offers.find((item) => item.id === offerId);
    if (!offer) return;

    setSelectedOfferId(offer.id);
    setAmount((current) => Math.min(current, offer.maxAmount));
    setTerm((current) => Math.min(current, offer.maxTerm));
    setApprovalState("idle");
    setMessage(`Linea seleccionada: ${offer.title}. Ajusta el simulador.`);
  };

  useEffect(() => {
    if (!showSummary) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSummary(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showSummary]);

  useEffect(() => {
    return () => {
      if (approvalTimerRef.current) {
        window.clearTimeout(approvalTimerRef.current);
      }
    };
  }, []);

  const requestApproval = () => {
    if (approvalTimerRef.current) {
      window.clearTimeout(approvalTimerRef.current);
    }
    setApprovalState("reviewing");
    setMessage("Analizando score, ingresos consolidados y capacidad de repago...");
    approvalTimerRef.current = window.setTimeout(() => {
      setApprovalState("approved");
      setShowSummary(true);
      setMessage(
        `Pre-aprobacion emitida: ${selectedOffer.title} por $ ${formatNumber(
          normalizedAmount
        )} a ${normalizedTerm} meses.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 md:space-y-8 md:p-0 animate-in fade-in duration-500">
      <header className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div className="min-w-0">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <BadgeDollarSign className="h-4 w-4" />
              Motor de originacion crediticia
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              Ofertas de Credito
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Simula lineas en pesos para comercios, profesionales y pymes santafesinas.
              El banco recibe monto, plazo, score y certificado fiscal en un legajo unico.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Flujo de solicitud
            </p>
            <div className="mt-4 space-y-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <section className="space-y-5 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {offers.map((offer) => {
              const isSelected = selectedOffer.id === offer.id;

              return (
                <article
                  key={offer.id}
                  onClick={() => selectOffer(offer.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectOffer(offer.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`cursor-pointer rounded-[1.35rem] border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-100"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-emerald-700">
                        {offer.badge}
                      </span>
                      <h2 className="mt-3 text-base font-black text-slate-950">
                        {offer.title}
                      </h2>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{offer.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <span className="block text-slate-400">Tasa</span>
                      <strong className="text-emerald-700">{offer.rateLabel}</strong>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <span className="block text-slate-400">Cupo</span>
                      <strong>$ {formatNumber(offer.maxAmount)}</strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Simulador de credito productivo
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ajusta el monto y plazo. La cuota se recalcula en tiempo real.
                </p>
              </div>
              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {selectedOffer.rateLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-semibold text-slate-600 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Score OF+ 82/100
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                Certificado fiscal listo
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <Clock3 className="h-4 w-4 text-emerald-600" />
                Respuesta estimada: 24hs
              </div>
            </div>

            <div className="mt-6 space-y-7">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-slate-500">Monto solicitado</span>
                  <span className="text-right text-xl font-black text-slate-950">
                    $ {formatNumber(normalizedAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max={selectedOffer.maxAmount}
                  step="100000"
                  value={normalizedAmount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-emerald-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>$ 500.000</span>
                  <span>Cupo maximo $ {formatNumber(selectedOffer.maxAmount)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-slate-500">Plazo de devolucion</span>
                  <span className="text-right text-xl font-black text-slate-950">
                    {normalizedTerm} meses
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max={selectedOffer.maxTerm}
                  step="1"
                  value={normalizedTerm}
                  onChange={(event) => setTerm(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-emerald-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>6 meses</span>
                  <span>Hasta {selectedOffer.maxTerm} meses</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center md:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cuota mensual
                  </span>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    $ {formatNumber(monthlyPayment)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total estimado
                  </span>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    $ {formatNumber(totalCost)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cupo disponible
                  </span>
                  <p className="mt-1 text-2xl font-black text-emerald-700">
                    $ {formatNumber(availableAmount)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3 text-sm font-bold">
                  <span className="text-slate-600">Peso de la cuota sobre ingresos</span>
                  <span className="text-slate-950">{affordability}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${affordability}%` }}
                  />
                </div>
                <p className="mt-3 flex gap-2 text-xs leading-5 text-slate-500">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Referencia mock: ingresos consolidados estimados en $ 2.100.000 mensuales.
                </p>
              </div>

              <button
                type="button"
                onClick={requestApproval}
                disabled={approvalState === "reviewing"}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-center text-sm font-black text-white shadow-md shadow-emerald-600/10 transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-500"
              >
                {approvalState === "reviewing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluando solicitud
                  </>
                ) : (
                  <>
                    Solicitar pre-aprobacion bancaria <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{message}</span>
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-5 lg:col-span-4">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
              <HandCoins className="h-5 w-5 text-emerald-600" />
              Resumen para el banco
            </h2>
            <div className="mt-5 space-y-3">
              {[
                ["Linea", selectedOffer.title],
                ["Monto", `$ ${formatNumber(normalizedAmount)}`],
                ["Plazo", `${normalizedTerm} meses`],
                ["Cuota", `$ ${formatNumber(monthlyPayment)}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-3 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <strong className="text-right text-slate-950">{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
              Por que calificas
            </h2>
            <div className="space-y-3">
              {[
                "Ingresos QR y wallets en crecimiento",
                "Certificado fiscal validado",
                "Comportamiento de caja estable",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-black text-slate-950">Proximo paso</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Al solicitar, se genera un legajo con score OF+, ingresos consolidados y
              certificado fiscal para analisis bancario.
            </p>
          </section>
        </aside>
      </div>

      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            aria-label="Cerrar resumen de oferta"
            onClick={() => setShowSummary(false)}
          />
          <div
            className="relative z-10 w-full max-w-lg rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 id="approval-title" className="text-xl font-black text-slate-950 dark:text-white">
                  Oferta pre-aprobada
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  El banco recibe una solicitud ordenada con score, ingresos validados
                  y certificado fiscal asociado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSummary(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar resumen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Linea</span>
                <strong className="text-right text-slate-900">{selectedOffer.title}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Monto solicitado</span>
                <strong className="text-slate-900">$ {formatNumber(normalizedAmount)}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Cuota estimada</span>
                <strong className="text-slate-900">$ {formatNumber(monthlyPayment)}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSummary(false);
                setMessage("Legajo confirmado. El banco recibio la solicitud simulada.");
              }}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700"
            >
              Confirmar envio del legajo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
