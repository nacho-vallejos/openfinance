"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Calculator,
  Coins,
  FileCheck2,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import OfertasCreditoClient from "../ofertas-credito/OfertasCreditoClient";

const fiscalData = {
  category: "Monotributo Categoria H",
  annualLimit: 44600000,
  consolidatedRevenue: 39280000,
  bankBalance: 2840000,
  walletBalance: 1670000,
  cryptoBalance: 1240000,
  fixedTermBalance: 2150000,
  idleCapital: 3390000,
  estimatedDeduction: 1460000,
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const fiscalUsage = Math.round(
  (fiscalData.consolidatedRevenue / fiscalData.annualLimit) * 100
);

const complianceItems = [
  {
    label: "Identidad Validada (KYC)",
    detail: "DNI, CUIT y titularidad de cuentas conciliadas.",
    icon: BadgeCheck,
  },
  {
    label: "Secreto Fiscal Protegido",
    detail: "Datos tratados bajo consentimiento expreso y revocable.",
    icon: LockKeyhole,
  },
  {
    label: "Origen de Fondos Justificado (AML/CFT)",
    detail: "Ingresos bancarios, wallets y actividad declarada trazables.",
    icon: ShieldCheck,
  },
];

export default function AsistenteFiscalClient() {
  const [benefitRequested, setBenefitRequested] = useState(false);
  const liquidity = fiscalData.bankBalance + fiscalData.walletBalance;
  const investedCapital = fiscalData.cryptoBalance + fiscalData.fixedTermBalance;
  const isNearLimit = fiscalUsage >= 85;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="min-w-0">
        <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <Scale className="h-4 w-4" />
          ARCA + BCRA readiness
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
          Tu Asistente Fiscal y Contable
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Monitoreo en tiempo real de tu situacion ante ARCA y optimizacion de tu
          flujo de caja.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Uso fiscal", `${fiscalUsage}%`, "Categoria H monitoreada"],
          ["Liquidez inmediata", formatMoney(liquidity), "Bancos + wallets"],
          ["Deduccion estimada", formatMoney(fiscalData.estimatedDeduction), "Impacto potencial"],
          ["Credito sugerido", "$ 12.800.000", "Capital de trabajo"],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:col-span-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Termometro fiscal
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {fiscalData.category}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Facturacion consolidada anual contra limite estimado de categoria.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Consumido
              </p>
              <p className="mt-1 text-3xl font-black text-slate-950">{fiscalUsage}%</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
              <span>{formatMoney(fiscalData.consolidatedRevenue)}</span>
              <span>Limite {formatMoney(fiscalData.annualLimit)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isNearLimit ? "bg-amber-500" : "bg-emerald-600"
                }`}
                style={{ width: `${Math.min(fiscalUsage, 100)}%` }}
              />
            </div>
          </div>

          {isNearLimit && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-semibold leading-6">
                Precaucion: Estas proximo al limite de tu categoria fiscal. Te
                sugerimos moderar la facturacion o preparar la recategorizacion.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:col-span-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Beneficio potencial
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">
                Simulador fiscal
              </h2>
            </div>
            <Calculator className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Descubre cuanto podrias deducir de impuestos si solicitas el Credito
            Productivo.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deduccion estimada
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {formatMoney(fiscalData.estimatedDeduction)}
            </p>
          </div>
          <button
            onClick={() => setBenefitRequested(true)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-700"
          >
            {benefitRequested ? "Beneficio simulado" : "Calcular beneficio"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {benefitRequested && (
            <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-900">
              Simulacion lista: el credito productivo podria mejorar tu base
              deducible y liberar caja mensual para capital de trabajo.
            </p>
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:col-span-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Analisis de Flujo de Caja
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lectura consolidada de liquidez e inversiones.
              </p>
            </div>
            <TrendingUp className="h-6 w-6 shrink-0 text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700">
                <WalletCards className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Liquidez inmediata
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatMoney(liquidity)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Bancos + wallets disponibles.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700">
                <Coins className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Capital inmovilizado
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {formatMoney(investedCapital)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Crypto + plazos fijos.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-900">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold leading-6">
              Tienes {formatMoney(fiscalData.idleCapital)} inmovilizados sin generar
              rendimiento. Considera moverlos a un fondo comun de inversion de
              liquidez diaria para mitigar la inflacion.
            </p>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:col-span-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Auditoria de Cumplimiento
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Compliance & AML preventivo.
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {complianceItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 px-4 py-3">
          <h2 className="text-base font-black text-slate-950">
            Ofertas de credito conectadas al analisis fiscal
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Las cuotas, cupos y pre-aprobaciones se leen junto con facturacion,
            liquidez, deducciones y cumplimiento para decidir con todos los datos visibles.
          </p>
        </div>
        <OfertasCreditoClient embedded />
      </section>
    </div>
  );
}
