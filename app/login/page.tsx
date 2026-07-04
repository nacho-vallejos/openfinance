"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";

const loginProfiles = [
  {
    username: "admin",
    password: "admin123",
    title: "Admin",
    description: "Gestiona conexiones, consentimiento y entidades.",
    icon: UserCog,
  },
  {
    username: "operador",
    password: "operador123",
    title: "Operador",
    description: "Opera ofertas, certificados y asistencia fiscal.",
    icon: Landmark,
  },
  {
    username: "consulta",
    password: "consulta123",
    title: "Consulta",
    description: "Consulta usuarios, score y catalogo bancario.",
    icon: Eye,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!login(username, password)) {
      setError("Usuario o clave incorrectos. Usa uno de los perfiles demo.");
      return;
    }

    router.replace("/home");
  };

  const selectProfile = (profile: (typeof loginProfiles)[number]) => {
    setUsername(profile.username);
    setPassword(profile.password);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-[1fr_440px]">
        <section className="relative hidden min-h-[680px] overflow-hidden bg-slate-950 p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.24),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.18),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black">
                OF
              </div>
              <h1 className="mt-8 max-w-lg text-4xl font-black tracking-tight">
                OpenFinance+ para banca, riesgo y operaciones.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Acceso por perfiles para mantener conexiones de datos solo en manos
                administrativas y dejar al operador enfocado en originacion crediticia.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                "Conexiones visibles solo para Admin",
                "Operador sin permisos de consentimiento",
                "Consulta con lectura de score y catalogo",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
                >
                  <BadgeCheck className="h-5 w-5 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-5 text-slate-950 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Acceso interno
              </div>
              <h2 className="text-2xl font-black tracking-tight">Ingresar al MVP</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Elegi un perfil demo o carga las credenciales manualmente.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {loginProfiles.map((profile) => {
              const Icon = profile.icon;
              const isSelected = username === profile.username;

              return (
                <button
                  key={profile.username}
                  type="button"
                  onClick={() => selectProfile(profile)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                    isSelected
                      ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black">{profile.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {profile.description}
                    </span>
                  </span>
                  {isSelected && <BadgeCheck className="h-5 w-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          <form onSubmit={submitLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Usuario
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
                <UsersRound className="h-4 w-4 text-slate-400" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full bg-transparent text-sm font-bold outline-none"
                  autoComplete="username"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Clave
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
                <LockKeyhole className="h-4 w-4 text-slate-400" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="w-full bg-transparent text-sm font-bold outline-none"
                  autoComplete="current-password"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-700"
            >
              Ingresar al dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            <strong className="text-slate-700">Credenciales demo:</strong> admin/admin123,
            operador/operador123, consulta/consulta123.
          </div>
        </section>
      </div>
    </main>
  );
}
