"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CalendarDays,
  Calculator,
  Hash,
  Landmark,
  Percent,
  Printer,
  ReceiptText,
  Scale,
  User,
} from "lucide-react";

type PaymentFrequency = "diario" | "semanal" | "mensual";

type ScheduleRow = {
  number: number;
  dueDate: string;
  installment: number;
  interest: number;
  amortization: number;
  balance: number;
};

type CalculationResult = {
  installment: number;
  totalInterest: number;
  interestPercent: number;
  totalRepayment: number;
  cft: number;
  periodicRate: number;
  schedule: ScheduleRow[];
};

const frequencyOptions: Record<
  PaymentFrequency,
  { label: string; periodsPerYear: number; dayStep: number | null }
> = {
  diario: { label: "Diario", periodsPerYear: 365, dayStep: 1 },
  semanal: { label: "Semanal", periodsPerYear: 52, dayStep: 7 },
  mensual: { label: "Mensual", periodsPerYear: 12, dayStep: null },
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

function buildDueDate(index: number, frequency: PaymentFrequency) {
  const date = new Date();
  const config = frequencyOptions[frequency];

  if (config.dayStep) {
    date.setDate(date.getDate() + index * config.dayStep);
  } else {
    date.setMonth(date.getMonth() + index);
  }

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateFrenchAmortization(
  principal: number,
  frequency: PaymentFrequency,
  installmentsCount: number,
  tnaPercent: number
): CalculationResult {
  const safePrincipal = Math.max(principal, 0);
  const safeInstallments = Math.max(1, Math.round(installmentsCount));
  const annualRate = Math.max(tnaPercent, 0) / 100;
  const periodsPerYear = frequencyOptions[frequency].periodsPerYear;
  const periodicRate = annualRate / periodsPerYear;

  const installment =
    periodicRate === 0
      ? safePrincipal / safeInstallments
      : (safePrincipal *
          (periodicRate * Math.pow(1 + periodicRate, safeInstallments))) /
        (Math.pow(1 + periodicRate, safeInstallments) - 1);

  let balance = safePrincipal;
  const schedule: ScheduleRow[] = [];

  for (let period = 1; period <= safeInstallments; period += 1) {
    const interest = balance * periodicRate;
    const amortization = Math.min(installment - interest, balance);
    const nextBalance = Math.max(balance - amortization, 0);

    schedule.push({
      number: period,
      dueDate: buildDueDate(period, frequency),
      installment,
      interest,
      amortization,
      balance: nextBalance,
    });

    balance = nextBalance;
  }

  const totalRepayment = installment * safeInstallments;
  const totalInterest = Math.max(totalRepayment - safePrincipal, 0);
  const interestPercent = safePrincipal > 0 ? (totalInterest / safePrincipal) * 100 : 0;
  const cft = (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100 + 3.5;

  return {
    installment,
    totalInterest,
    interestPercent,
    totalRepayment,
    cft,
    periodicRate,
    schedule,
  };
}

export default function EmisorCreditosPage() {
  const [capital, setCapital] = useState(2500000);
  const [frequency, setFrequency] = useState<PaymentFrequency>("mensual");
  const [installments, setInstallments] = useState(12);
  const [tna, setTna] = useState(72);
  const [clientName, setClientName] = useState("Martina Alvarez");
  const [clientDni, setClientDni] = useState("32.456.789");
  const [emissionDate, setEmissionDate] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setEmissionDate(
      new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const frequencyLabel = frequencyOptions[frequency].label;

  const riskSummary = useMemo(() => {
    if (!result) return "Pendiente de calculo";
    if (result.interestPercent < 20) return "Rentabilidad conservadora";
    if (result.interestPercent < 45) return "Rentabilidad equilibrada";
    return "Rentabilidad intensiva";
  }, [result]);

  const handleCalculate = () => {
    setResult(calculateFrenchAmortization(capital, frequency, installments, tna));
  };

  const handlePrint = () => {
    if (!result) {
      setResult(calculateFrenchAmortization(capital, frequency, installments, tna));
      window.setTimeout(() => window.print(), 80);
      return;
    }

    window.print();
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #loan-contract,
          #loan-contract * {
            visibility: visible;
          }

          #loan-contract {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 0 !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 14mm;
          }
        }
      `}</style>

      <header className="no-print rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          <Landmark className="h-4 w-4" />
          Prestamista / entidad otorgante
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
              Emisor de creditos y contratos
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Simula el cuadre financiero, valida la rentabilidad y emite un contrato
              imprimible en pesos argentinos para operaciones comerciales santafesinas.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Estado del legajo
            </p>
            <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
              {riskSummary}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <section className="no-print space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Formulario de simulacion
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Ingresos minimos para calcular cuota, interes y contrato.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <BadgeDollarSign className="h-4 w-4 text-emerald-600" />
                Monto de capital
              </span>
              <input
                type="number"
                min={10000}
                step={50000}
                value={capital}
                onChange={(event) => setCapital(Number(event.target.value))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                Frecuencia de pago
              </span>
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value as PaymentFrequency)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </select>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Hash className="h-4 w-4 text-emerald-600" />
                  Cuotas
                </span>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={installments}
                  onChange={(event) => setInstallments(Number(event.target.value))}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Percent className="h-4 w-4 text-emerald-600" />
                  TNA %
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={tna}
                  onChange={(event) => setTna(Number(event.target.value))}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <User className="h-4 w-4 text-emerald-600" />
                  Cliente
                </span>
                <input
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <ReceiptText className="h-4 w-4 text-emerald-600" />
                  DNI
                </span>
                <input
                  value={clientDni}
                  onChange={(event) => setClientDni(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950"
          >
            <Calculator className="h-5 w-5" />
            Calcular Cuadre
          </button>
        </section>

        <section className="space-y-6">
          <div className="no-print rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                  Resultado financiero
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Sistema frances con frecuencia {frequencyLabel.toLowerCase()}.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Printer className="h-4 w-4" />
                Imprimir contrato
              </button>
            </div>

            {result ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Valor cuota
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                    {formatMoney(result.installment)}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Interes total
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                    {formatMoney(result.totalInterest)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {formatPercent(result.interestPercent)}% del capital
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Total a devolver
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                    {formatMoney(result.totalRepayment)}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    CFT estimado
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                    {formatPercent(result.cft)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                Completa la simulacion y presiona Calcular Cuadre para generar el
                resultado y habilitar el contrato.
              </div>
            )}
          </div>

          <article
            id="loan-contract"
            className="overflow-hidden rounded-[1.25rem] border border-slate-300 bg-white text-black shadow-sm"
          >
            <div className="border-b border-slate-300 px-5 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    OpenFinance+
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-black">
                    Contrato de mutuo y plan de pagos
                  </h2>
                </div>
                <div className="rounded-lg border border-slate-300 px-3 py-2 text-right text-xs">
                  <p className="font-bold uppercase text-slate-500">Fecha de emision</p>
                  <p className="mt-1 font-semibold text-black">
                    {emissionDate || "Pendiente"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-5 py-6 font-serif sm:px-8">
              <section className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Cliente</p>
                  <p className="mt-1 text-base font-bold text-black">
                    {clientName || "Nombre no informado"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">DNI</p>
                  <p className="mt-1 text-base font-bold text-black">
                    {clientDni || "DNI no informado"}
                  </p>
                </div>
              </section>

              <section className="text-sm leading-7 text-slate-900">
                <p>
                  Por medio del presente, el otorgante deja constancia de la simulacion
                  crediticia solicitada por el cliente, calculada bajo sistema de
                  amortizacion frances, con capital expresado en pesos argentinos y
                  condiciones sujetas a aprobacion crediticia final.
                </p>
              </section>

              <section className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Capital</p>
                  <p className="mt-1 font-bold">{formatMoney(capital)}</p>
                </div>
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Frecuencia</p>
                  <p className="mt-1 font-bold">{frequencyLabel}</p>
                </div>
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Plazo</p>
                  <p className="mt-1 font-bold">{installments} cuotas</p>
                </div>
                <div className="rounded-lg border border-slate-300 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">TNA</p>
                  <p className="mt-1 font-bold">{formatPercent(tna)}%</p>
                </div>
              </section>

              {result ? (
                <>
                  <section className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-300 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">Cuota</p>
                      <p className="mt-1 font-bold">{formatMoney(result.installment)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-300 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Interes total
                      </p>
                      <p className="mt-1 font-bold">{formatMoney(result.totalInterest)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-300 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Total a devolver
                      </p>
                      <p className="mt-1 font-bold">{formatMoney(result.totalRepayment)}</p>
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <h3 className="text-base font-bold">Detalle del plan de pagos</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-y border-slate-300 bg-slate-100">
                            <th className="px-2 py-2 font-bold">Cuota</th>
                            <th className="px-2 py-2 font-bold">Vencimiento</th>
                            <th className="px-2 py-2 font-bold">Valor cuota</th>
                            <th className="px-2 py-2 font-bold">Interes</th>
                            <th className="px-2 py-2 font-bold">Amortizacion</th>
                            <th className="px-2 py-2 font-bold">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.map((row) => (
                            <tr key={row.number} className="border-b border-slate-200">
                              <td className="px-2 py-2">{row.number}</td>
                              <td className="px-2 py-2">{row.dueDate}</td>
                              <td className="px-2 py-2">{formatMoney(row.installment)}</td>
                              <td className="px-2 py-2">{formatMoney(row.interest)}</td>
                              <td className="px-2 py-2">{formatMoney(row.amortization)}</td>
                              <td className="px-2 py-2">{formatMoney(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : (
                <section className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-600">
                  El plan de pagos se incorporara automaticamente cuando se calcule el
                  cuadre financiero.
                </section>
              )}

              <section className="rounded-lg border border-slate-300 p-4 text-sm leading-7 text-slate-900">
                <h3 className="mb-2 text-base font-bold">Clausulas legales</h3>
                <p>
                  Clausulas sujetas a la Ley de Defensa del Consumidor de la Provincia
                  de Santa Fe. Las partes se someten a la jurisdiccion de los Tribunales
                  Ordinarios de la ciudad de Rosario, Santa Fe.
                </p>
              </section>

              <section className="mt-6 mb-4 text-xs leading-5 text-gray-500 text-justify">
                <p>
                  CLÁUSULA DE EXENCIÓN DE RESPONSABILIDAD: OpenFinance+ actúa
                  exclusivamente como una plataforma tecnológica de simulación,
                  asesoramiento y articulación de información. OpenFinance+ no es una
                  entidad financiera regida por la Ley de Entidades Financieras N° 21.526
                  del Banco Central de la República Argentina (BCRA), ni actúa como
                  otorgante directo de créditos, tarjetas de crédito, ni fondos de ninguna
                  índole. Los cálculos, cuadros de amortización y condiciones detalladas
                  en el presente documento son de carácter estrictamente simulado,
                  informativo y no vinculante para la plataforma. La aprobación,
                  otorgamiento, tasas definitivas y liquidación final de cualquier producto
                  financiero quedan sujetos exclusivamente a la evaluación crediticia,
                  políticas de riesgo y términos y condiciones de la entidad financiera u
                  otorgante final.
                </p>
              </section>

              <section className="grid grid-cols-1 gap-10 pt-8 text-center text-sm sm:grid-cols-2">
                <div>
                  <div className="border-t border-black pt-2">
                    Firma y Aclaracion del Cliente
                  </div>
                </div>
                <div>
                  <div className="border-t border-black pt-2">
                    Firma del Otorgante
                    <p className="mt-1 text-xs font-bold">
                      Ignacio Raul Vallejos - Oficial de Cuenta
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
