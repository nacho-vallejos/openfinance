export type IncomePoint = {
  month: string;
  formal: number;
  qr: number;
  transfers: number;
  crypto: number;
};

export type Insight = {
  id: string;
  title: string;
  description: string;
  amount?: string;
  tone: "emerald" | "sky" | "amber";
};

export const dashboardSummary = {
  financialHealthScore: 82,
  totalMonthlyIncome: 2480000,
  incomeGrowth: 18.4,
  connectedSources: 4,
  creditPotential: "$ 12.800.000",
};

export const consolidatedIncome: IncomePoint[] = [
  { month: "Ene", formal: 960000, qr: 280000, transfers: 360000, crypto: 120000 },
  { month: "Feb", formal: 980000, qr: 310000, transfers: 390000, crypto: 150000 },
  { month: "Mar", formal: 1010000, qr: 360000, transfers: 420000, crypto: 190000 },
  { month: "Abr", formal: 1040000, qr: 420000, transfers: 470000, crypto: 220000 },
  { month: "May", formal: 1080000, qr: 520000, transfers: 510000, crypto: 260000 },
  { month: "Jun", formal: 1120000, qr: 610000, transfers: 540000, crypto: 310000 },
];

export const incomeMix = [
  { label: "Ingresos formales", value: 1120000, color: "#059669" },
  { label: "Pagos QR", value: 610000, color: "#0284c7" },
  { label: "Transferencias", value: 540000, color: "#7c3aed" },
  { label: "Crypto", value: 310000, color: "#f59e0b" },
];

export const intelligenceInsights: Insight[] = [
  {
    id: "wallet-volume",
    title: "Perfil fuerte por volumen en Wallets",
    description:
      "Tu flujo sostenido en pagos QR y billeteras digitales mejora la prediccion de repago.",
    amount: "Calificas para $ 9.400.000",
    tone: "emerald",
  },
  {
    id: "income-diversity",
    title: "Ingresos diversificados detectados",
    description:
      "El 56% de tus ingresos no dependio de una sola fuente durante los ultimos 90 dias.",
    amount: "+14 pts de resiliencia",
    tone: "sky",
  },
  {
    id: "crypto-liquidity",
    title: "Liquidez crypto declarada",
    description:
      "Tus tenencias y movimientos en exchanges aportan capacidad adicional verificable.",
    amount: "$ 1.600.000 computables",
    tone: "amber",
  },
];
