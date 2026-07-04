"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  ChevronLeft,
  Coins,
  DatabaseZap,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

const entities = [
  {
    id: "arca",
    name: "ARCA",
    description: "Constancias fiscales, facturacion y perfil tributario.",
    icon: Landmark,
    initials: "AR",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "bancos",
    name: "Bancos Tradicionales",
    description: "Cuentas, saldos, movimientos y comportamiento crediticio.",
    icon: Building2,
    initials: "BT",
    accent: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    id: "mercado-pago",
    name: "Mercado Pago",
    description: "Ingresos digitales, cobros, billetera y actividad comercial.",
    icon: WalletCards,
    initials: "MP",
    accent: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    id: "cripto",
    name: "Exchanges Cripto",
    description: "Tenencias declaradas, operaciones y liquidez disponible.",
    icon: Coins,
    initials: "EC",
    accent: "bg-violet-50 text-violet-700 border-violet-100",
  },
];

const loadingLines = [
  "Solicitando consentimiento expreso",
  "Conectando Data Aggregator",
  "Normalizando historial fiscal y financiero",
  "Preparando score de credito verificable",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(["arca", "bancos"]);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const selectedCount = selected.length;

  useEffect(() => {
    if (!isAuthorizing) {
      setLoadingIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingLines.length);
    }, 650);

    return () => window.clearInterval(interval);
  }, [isAuthorizing]);

  const toggleEntity = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((entityId) => entityId !== id)
        : [...current, id]
    );
  };

  const authorize = () => {
    setIsAuthorizing(true);
    window.setTimeout(() => router.push("/home"), 2800);
  };

  const canContinue = step !== 1 || selectedCount > 0;

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            Consentimiento expreso Decreto 353/2025
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Autoriza tu conexion Open Finance+
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Elegi que entidades queres conectar y confirma el acceso seguro para
            transformar tu historial fiscal y financiero en mejores condiciones de credito.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          {selectedCount} entidades seleccionadas
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          {["Propuesta", "Entidades", "Autorizacion"].map((label, index) => {
            const isActive = index === step;
            const isDone = index < step;

            return (
              <button
                key={label}
                onClick={() => setStep(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    isDone
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isActive
                        ? "border-emerald-200 bg-white text-emerald-700"
                        : "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Paso {index + 1}
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </span>
              </button>
            );
          })}
        </aside>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="min-h-[520px] p-6 md:p-8"
            >
              {step === 0 && (
                <div className="grid h-full gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Banknote className="h-7 w-7" />
                    </div>
                    <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-950">
                      Converti tu historial real en acceso a credito mas justo.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                      Open Finance+ consolida datos fiscales, bancarios y de billeteras
                      digitales para construir una lectura completa de tu capacidad de pago.
                      Vos decidis que conectar, por cuanto tiempo y con que finalidad.
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {["Consentimiento granular", "Datos cifrados", "Mejores ofertas"].map(
                        (item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                          >
                            <BadgeCheck className="mb-3 h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-bold text-slate-800">{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/40 p-5">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Resultado estimado
                      </p>
                      <p className="mt-3 text-3xl font-black text-slate-950">$ 8.500.000</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Cupo potencial al validar ingresos, patrimonio y flujo mensual.
                      </p>
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full bg-emerald-600"
                          initial={{ width: "18%" }}
                          animate={{ width: "76%" }}
                          transition={{ duration: 1, delay: 0.15 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    Selecciona las entidades a conectar
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Podes autorizar una o varias fuentes. Cada conexion se registra con alcance,
                    finalidad y trazabilidad de consentimiento.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {entities.map((entity) => {
                      const Icon = entity.icon;
                      const isSelected = selected.includes(entity.id);

                      return (
                        <motion.button
                          key={entity.id}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleEntity(entity.id)}
                          className={cn(
                            "group relative rounded-[1.5rem] border bg-white p-5 text-left shadow-sm transition-all duration-200",
                            isSelected
                              ? "border-emerald-300 ring-4 ring-emerald-50"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                          )}
                        >
                          <span className="flex items-start justify-between gap-4">
                            <span className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "flex h-14 w-14 items-center justify-center rounded-2xl border font-black",
                                  entity.accent
                                )}
                              >
                                {entity.initials}
                              </span>
                              <span className="block">
                                <span className="block text-base font-bold text-slate-900">
                                  {entity.name}
                                </span>
                                <Icon className="mt-1 h-4 w-4 text-slate-400" />
                              </span>
                            </span>
                            <span
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                                isSelected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-200 bg-white text-transparent group-hover:text-slate-300"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </span>
                          </span>
                          <span className="mt-5 block text-sm leading-6 text-slate-500">
                            {entity.description}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex min-h-[460px] flex-col justify-center">
                  <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                      <LockKeyhole className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                      Confirma la autorizacion segura
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      Al continuar, autorizas a Open Finance+ a consultar las fuentes
                      seleccionadas con el unico fin de analizar tu perfil crediticio y
                      presentar ofertas personalizadas.
                    </p>
                    <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-left">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-bold text-slate-800">
                          Alcance del consentimiento
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">
                          {selectedCount} fuentes
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Acceso de solo lectura, cifrado en transito, revocable desde
                        configuracion y auditable por evento.
                      </p>
                    </div>
                    <button
                      onClick={authorize}
                      disabled={selectedCount === 0}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                    >
                      Autorizar Conexion Segura
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4 md:px-8">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
            {step < 2 && (
              <button
                onClick={() => setStep((current) => Math.min(2, current + 1))}
                disabled={!canContinue}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isAuthorizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-7 text-center shadow-2xl"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-3 rounded-full border-2 border-slate-100 border-b-slate-400"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
                <DatabaseZap className="h-9 w-9 text-emerald-700" />
              </div>
              <h3 className="mt-6 text-xl font-black text-slate-950">
                Extrayendo datos en tiempo real
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {loadingLines[loadingIndex]}
              </p>
              <div className="mt-6 space-y-2 text-left">
                {loadingLines.map((line, index) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{
                      delay: index * 0.18,
                      duration: 1.4,
                      repeat: Infinity,
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {line}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
