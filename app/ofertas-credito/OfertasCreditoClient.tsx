"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HandCoins,
  Home,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";
const DEMO_USER_ID = "99999999-1111-1111-1111-111111111111";

const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

type CreditOffer = {
  id: string;
  title: string;
  description: string;
  rate: number;
  rateLabel: string;
  maxTerm: number;
  maxAmount: number;
  badge: string;
  source: "mock" | "api";
  bankCode?: string;
  riskMultiplier?: number;
  score?: number;
};

type CotizacionApiItem = {
  banco_id: string;
  codigo_bcra: string;
  banco: string;
  tasa_base_tna: number;
  multiplicador_riesgo: number;
  tna_personalizada: number;
  limite_aprobado: number;
  usuario?: {
    score_veraz_actual?: number;
    situacion_bcra_actual?: number;
  };
};

const fallbackOffers: CreditOffer[] = [
  {
    id: "capital-local",
    title: "Capital de trabajo comercio local",
    description: "Para stock, proveedores y flujo operativo de comercios santafesinos.",
    rate: 0.42,
    rateLabel: "42% TNA",
    maxTerm: 18,
    maxAmount: 12800000,
    badge: "Mejor ajuste",
    source: "mock",
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
    source: "mock",
  },
];

const steps = [
  "Elegis una linea",
  "Ajustas monto y plazo",
  "Enviamos legajo al banco",
];

type OfertasCreditoClientProps = {
  embedded?: boolean;
};

export default function OfertasCreditoClient({ embedded = false }: OfertasCreditoClientProps) {
  const [creditOffers, setCreditOffers] = useState<CreditOffer[]>(fallbackOffers);
  const [amount, setAmount] = useState(8500000);
  const [term, setTerm] = useState(18);
  const [selectedOfferId, setSelectedOfferId] = useState(fallbackOffers[0].id);
  const [message, setMessage] = useState("Simulacion lista para enviar.");
  const [approvalState, setApprovalState] = useState<"idle" | "reviewing" | "approved">("idle");
  const [showSummary, setShowSummary] = useState(false);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteSource, setQuoteSource] = useState<"mock" | "api">("mock");
  const approvalTimerRef = useRef<number | null>(null);
  const router = useRouter();

  const selectedOffer =
    creditOffers.find((offer) => offer.id === selectedOfferId) ?? creditOffers[0];
  const normalizedAmount = Math.min(amount, selectedOffer.maxAmount);
  const normalizedTerm = Math.min(term, selectedOffer.maxTerm);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = selectedOffer.rate / 12;

    if (normalizedTerm <= 0) return normalizedAmount;
    if (monthlyRate <= 0) return Math.round(normalizedAmount / normalizedTerm);

    const payment =
      (normalizedAmount * monthlyRate * Math.pow(1 + monthlyRate, normalizedTerm)) /
      (Math.pow(1 + monthlyRate, normalizedTerm) - 1);

    return Math.round(payment);
  }, [normalizedAmount, normalizedTerm, selectedOffer.rate]);

  const totalCost = monthlyPayment * normalizedTerm;
  const affordability = Math.min(Math.round((monthlyPayment / 2100000) * 100), 100);
  const availableAmount = Math.max(selectedOffer.maxAmount - normalizedAmount, 0);

  const fetchCotizacion = async () => {
    setIsFetchingQuotes(true);
    setQuoteError(null);
    setMessage("Consultando API bancaria local y politicas de riesgo...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/cotizar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: DEMO_USER_ID,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "No se pudo obtener la cotizacion desde la API local."
        );
      }

      const apiOffers = ((payload?.data || []) as CotizacionApiItem[]).map((item) => ({
        id: item.banco_id,
        title: item.banco,
        description: `Oferta calculada por Prisma/PostgreSQL con score ${
          item.usuario?.score_veraz_actual ?? "validado"
        } y Situacion BCRA ${item.usuario?.situacion_bcra_actual ?? "1"}.`,
        rate: item.tna_personalizada / 100,
        rateLabel: `${item.tna_personalizada}% TNA`,
        maxTerm: item.limite_aprobado >= 10000000 ? 24 : 18,
        maxAmount: item.limite_aprobado,
        badge: `BCRA ${item.codigo_bcra}`,
        source: "api" as const,
        bankCode: item.codigo_bcra,
        riskMultiplier: item.multiplicador_riesgo,
        score: item.usuario?.score_veraz_actual,
      }));

      if (apiOffers.length === 0) {
        throw new Error("La API respondio sin ofertas aplicables para este perfil.");
      }

      setCreditOffers(apiOffers);
      setSelectedOfferId(apiOffers[0].id);
      setAmount((current) => Math.min(current, apiOffers[0].maxAmount));
      setTerm((current) => Math.min(current, apiOffers[0].maxTerm));
      setQuoteSource("api");
      setApprovalState("idle");
      setMessage(`Cotizacion actualizada desde API: ${apiOffers.length} bancos disponibles.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "La API local no respondio. Se mantienen ofertas mock.";

      setQuoteError(errorMessage);
      setQuoteSource("mock");
      setCreditOffers(fallbackOffers);
      setSelectedOfferId((current) =>
        fallbackOffers.some((offer) => offer.id === current)
          ? current
          : fallbackOffers[0].id
      );
      setMessage("No se pudo conectar con la API local. La simulacion continua en modo mock.");
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  const selectOffer = (offerId: string) => {
    const offer = creditOffers.find((item) => item.id === offerId);
    if (!offer) return;

    setSelectedOfferId(offer.id);
    setAmount((current) => Math.min(current, offer.maxAmount));
    setTerm((current) => Math.min(current, offer.maxTerm));
    setApprovalState("idle");
    setMessage(`Linea seleccionada: ${offer.title}. Ajusta el simulador.`);
  };

  useEffect(() => {
    fetchCotizacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {!embedded && (
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navegacion
          </p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
            Simulador de ofertas de credito
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-emerald-700"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>
        </div>
      </div>
      )}

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
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={fetchCotizacion}
                disabled={isFetchingQuotes}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500 sm:w-fit"
              >
                {isFetchingQuotes ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Consultando API
                  </>
                ) : (
                  <>
                    Actualizar con API local <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <span className="text-xs font-semibold text-slate-400">
                {quoteSource === "api"
                  ? `Datos reales desde ${API_BASE_URL}/api/cotizar`
                  : "Modo mock activo si la API local no esta disponible"}
              </span>
            </div>
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
            {creditOffers.map((offer) => {
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
                    {offer.source === "api" && (
                      <div className="col-span-2 rounded-xl bg-white px-3 py-2">
                        <span className="block text-slate-400">Motor API</span>
                        <strong>
                          Multiplicador{" "}
                          {typeof offer.riskMultiplier === "number"
                            ? `x${offer.riskMultiplier.toFixed(2)}`
                            : "validado"}{" "}
                          - Score{" "}
                          {offer.score ?? "validado"}
                        </strong>
                      </div>
                    )}
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
                {isFetchingQuotes ? "Actualizando..." : selectedOffer.rateLabel}
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

            {quoteError && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                API local no disponible: {quoteError}
              </div>
            )}

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
                disabled={approvalState === "reviewing" || isFetchingQuotes}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-center text-sm font-black text-white shadow-md shadow-emerald-600/10 transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-500"
              >
                {approvalState === "reviewing" || isFetchingQuotes ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isFetchingQuotes ? "Esperando cotizacion API" : "Evaluando solicitud"}
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
            <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
              <BadgeDollarSign className="h-5 w-5 text-emerald-600" />
              Estado de integracion
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                <span className="font-semibold text-slate-500">Endpoint</span>
                <strong className="text-right text-xs text-slate-900">
                  {API_BASE_URL}/api/cotizar
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                <span className="font-semibold text-slate-500">Fuente</span>
                <strong className="text-right text-slate-900">
                  {quoteSource === "api" ? "API + PostgreSQL" : "Mock local"}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                <span className="font-semibold text-slate-500">Ofertas</span>
                <strong className="text-right text-slate-900">{creditOffers.length}</strong>
              </div>
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
