"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BadgeDollarSign,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  CreditCard,
  FileCheck2,
  FileSignature,
  Landmark,
  Link2,
  Scale,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  consolidatedIncome,
  dashboardSummary,
  incomeMix,
} from "@/lib/dashboard-data";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const formatTooltipMoney = (value: unknown) =>
  typeof value === "number" ? formatMoney(value) : String(value ?? "");

const totalIncomeData = consolidatedIncome.map((item) => ({
  ...item,
  total: item.formal + item.qr + item.transfers + item.crypto,
}));

const insightTone = {
  emerald: "border-emerald-100 bg-emerald-50/60 text-emerald-700",
  sky: "border-sky-100 bg-sky-50/70 text-sky-700",
};

const proactiveAlerts = [
  {
    id: "wallet-growth",
    title: "Oportunidad",
    message:
      "Tu volumen en Wallets crecio un 15%. Calificas para un aumento de cupo.",
    icon: TrendingUp,
    tone: "emerald" as const,
  },
  {
    id: "debt-savings",
    title: "Ahorro",
    message:
      "Detectamos pagos recurrentes altos. Unifica tus deudas con nuestra tasa preferencial.",
    icon: ShieldCheck,
    tone: "sky" as const,
  },
  {
    id: "fiscal-validation",
    title: "Validacion",
    message: "Certificado fiscal actualizado correctamente desde ARCA.",
    icon: CheckCircle2,
    tone: "emerald" as const,
  },
];

const moduleLinks = [
  {
    title: "Conexiones",
    description: "Vincular bancos, wallets y ARCA",
    href: "/conexiones",
    icon: Link2,
  },
  {
    title: "Certificado",
    description: "Ver capacidad crediticia validada",
    href: "/certificado",
    icon: FileCheck2,
  },
  {
    title: "Ofertas de Credito",
    description: "Simular financiamiento en pesos",
    href: "/ofertas-credito",
    icon: Coins,
  },
  {
    title: "Emisor Creditos",
    description: "Cuadre, rentabilidad y contrato",
    href: "/emisor-creditos",
    icon: FileSignature,
  },
  {
    title: "Elegibilidad",
    description: "Tarjetas y prestamos segun perfil",
    href: "/simulador-elegibilidad",
    icon: CreditCard,
  },
  {
    title: "Asistente Fiscal",
    description: "Control ARCA, caja y cumplimiento",
    href: "/asistente-fiscal",
    icon: Scale,
  },
  {
    title: "Catalogo Bancario",
    description: "Tasas, politicas y scoring",
    href: "/catalogo-bancos",
    icon: Landmark,
  },
];

function FinancialHealthGauge({ score }: { score: number }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-56 w-full max-w-xs items-center justify-center">
      <svg className="h-52 w-52 -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeLinecap="round"
          strokeWidth="18"
          strokeDasharray={`${progress} ${circumference - progress}`}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="55%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-black tracking-tight text-slate-950">{score}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          Salud financiera
        </p>
        <p className="mt-2 text-sm font-bold text-emerald-700">Muy fuerte</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { canAccessPath } = useAuth();
  const visibleModuleLinks = moduleLinks.filter((module) => canAccessPath(module.href));

  return (
    <div className="space-y-6 p-0 md:space-y-8 animate-in fade-in duration-500">
      <header className="min-w-0">
        <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4" />
          Comportamiento economico consolidado
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          Dashboard 360 de salud financiera
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Una lectura unificada de ingresos formales, pagos QR, transferencias, wallets
          y actividad crypto para comercios y pymes santafesinas.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {visibleModuleLinks.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-emerald-700 transition-colors group-hover:bg-white dark:bg-slate-950 dark:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-black text-slate-950 dark:text-white">
                {module.title}
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {module.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Score de Salud Financiera
              </h2>
              <p className="mt-1 text-xs text-slate-500">Motor OF+ Risk Intelligence</p>
            </div>
            <Activity className="h-5 w-5 shrink-0 text-emerald-600" />
          </div>
          <FinancialHealthGauge score={dashboardSummary.financialHealthScore} />
          <div className="grid grid-cols-3 gap-2 text-center">
            {["Estable", "Verificado", "Escalable"].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-slate-50 px-2 py-2 text-[11px] font-bold text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-950">Ingresos consolidados</h2>
              <p className="mt-1 text-sm text-slate-500">
                Fusion de salario, QR, transferencias y crypto.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
              <WalletCards className="h-4 w-4 text-emerald-600" />
              Ultimos 6 meses
            </div>
          </div>

          <div className="mt-6 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalIncomeData} barGap={4} margin={{ left: -12, right: 6 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(value) => `$${Number(value) / 1000000}M`}
                />
                <Tooltip formatter={formatTooltipMoney} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="formal" name="Formal" stackId="income" fill="#059669" radius={[0, 0, 8, 8]} />
                <Bar dataKey="qr" name="QR" stackId="income" fill="#0284c7" />
                <Bar dataKey="transfers" name="Transferencias" stackId="income" fill="#7c3aed" />
                <Bar dataKey="crypto" name="Crypto" stackId="income" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-950">
              Insights Proactivos
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Recomendaciones basadas en tu comportamiento consolidado.
            </p>
          </div>
          <BrainCircuit className="h-6 w-6 shrink-0 text-emerald-600" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {proactiveAlerts.map((alert) => {
            const Icon = alert.icon;

            return (
              <article
                key={alert.id}
                className="rounded-[1.35rem] border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md"
              >
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border",
                    insightTone[alert.tone]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-slate-950">{alert.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {alert.message}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CircleDollarSign className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ingreso mensual
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {formatMoney(dashboardSummary.totalMonthlyIncome)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <TrendingUp className="mb-3 h-5 w-5 text-sky-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Crecimiento
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            +{dashboardSummary.incomeGrowth}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Landmark className="mb-3 h-5 w-5 text-violet-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fuentes activas
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {dashboardSummary.connectedSources} conectadas
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <BadgeDollarSign className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cupo potencial
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {dashboardSummary.creditPotential}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <article className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Tendencia total</h2>
          <p className="mt-1 text-sm text-slate-500">Total consolidado mensual.</p>
          <div className="mt-4 h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalIncomeData}>
                <defs>
                  <linearGradient id="totalIncome" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <YAxis hide domain={["dataMin - 100000", "dataMax + 100000"]} />
                <Tooltip formatter={formatTooltipMoney} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total consolidado"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#totalIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Mix de ingresos</h2>
          <p className="mt-1 text-sm text-slate-500">Peso relativo del ultimo mes.</p>
          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeMix}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {incomeMix.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipMoney} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {incomeMix.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-600">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 font-black text-slate-900">
                  {formatMoney(item.value)}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

    </div>
  );
}
