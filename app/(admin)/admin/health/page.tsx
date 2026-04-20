"use client";

import { useState } from "react";

/* ──────────────────── DATA ──────────────────── */

type ServiceStatus = "operational" | "degraded" | "down";

interface Service {
  name: string;
  nameEn: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  uptimeHistory: ServiceStatus[];
}

function generateUptimeHistory(uptime: number): ServiceStatus[] {
  const days: ServiceStatus[] = [];
  for (let i = 0; i < 90; i++) {
    const rand = Math.random() * 100;
    if (uptime >= 99.9) {
      days.push(rand > 99.8 ? "degraded" : "operational");
    } else if (uptime >= 99.0) {
      if (rand > 99.5) days.push("down");
      else if (rand > 98) days.push("degraded");
      else days.push("operational");
    } else {
      if (rand > 99) days.push("down");
      else if (rand > 96) days.push("degraded");
      else days.push("operational");
    }
  }
  return days;
}

const services: Service[] = [
  { name: "Jukwaa Kuu", nameEn: "Core Platform", status: "operational", uptime: 99.98, responseTime: 45, uptimeHistory: generateUptimeHistory(99.98) },
  { name: "Malipo ya M-Pesa", nameEn: "M-Pesa Payments", status: "operational", uptime: 99.5, responseTime: 230, uptimeHistory: generateUptimeHistory(99.5) },
  { name: "Hifadhidata", nameEn: "Database", status: "operational", uptime: 99.99, responseTime: 12, uptimeHistory: generateUptimeHistory(99.99) },
  { name: "API ya Nje", nameEn: "External API", status: "degraded", uptime: 98.2, responseTime: 450, uptimeHistory: generateUptimeHistory(98.2) },
  { name: "SMS/Arifa", nameEn: "Notifications", status: "operational", uptime: 99.7, responseTime: 180, uptimeHistory: generateUptimeHistory(99.7) },
  { name: "Uhifadhi", nameEn: "Storage", status: "operational", uptime: 99.99, responseTime: 25, uptimeHistory: generateUptimeHistory(99.99) },
];

const apiResponseTimes = [
  { label: "P50", value: 45, max: 500 },
  { label: "P95", value: 230, max: 500 },
  { label: "P99", value: 890, max: 1000 },
];

const errorRates = [
  { hour: "00", e4xx: 12, e5xx: 0 },
  { hour: "02", e4xx: 8, e5xx: 0 },
  { hour: "04", e4xx: 5, e5xx: 0 },
  { hour: "06", e4xx: 15, e5xx: 1 },
  { hour: "08", e4xx: 45, e5xx: 2 },
  { hour: "10", e4xx: 78, e5xx: 3 },
  { hour: "12", e4xx: 92, e5xx: 5 },
  { hour: "14", e4xx: 85, e5xx: 2 },
  { hour: "16", e4xx: 67, e5xx: 1 },
  { hour: "18", e4xx: 54, e5xx: 0 },
  { hour: "20", e4xx: 38, e5xx: 0 },
  { hour: "22", e4xx: 18, e5xx: 0 },
];

interface Incident {
  id: string;
  title: string;
  titleEn: string;
  severity: "Critical" | "Warning" | "Info";
  status: "Resolved" | "Investigating" | "Identified";
  startTime: string;
  duration: string;
  affectedServices: string[];
  description: string;
}

const incidents: Incident[] = [
  {
    id: "INC-042",
    title: "API ya Nje — Muda wa majibu umepanda",
    titleEn: "External API — Response times elevated",
    severity: "Warning",
    status: "Identified",
    startTime: "2026-04-19 09:30",
    duration: "5 saa",
    affectedServices: ["API ya Nje"],
    description: "External API response times are elevated due to third-party provider issues. Monitoring closely.",
  },
  {
    id: "INC-041",
    title: "M-Pesa — Hitilafu ya muda mfupi",
    titleEn: "M-Pesa — Temporary outage",
    severity: "Critical",
    status: "Resolved",
    startTime: "2026-04-17 14:15",
    duration: "23 dakika",
    affectedServices: ["Malipo ya M-Pesa"],
    description: "M-Pesa payment processing experienced a brief outage. All transactions resumed normally after failover.",
  },
  {
    id: "INC-040",
    title: "Matengenezo ya hifadhidata yaliyopangwa",
    titleEn: "Scheduled database maintenance",
    severity: "Info",
    status: "Resolved",
    startTime: "2026-04-15 02:00",
    duration: "45 dakika",
    affectedServices: ["Hifadhidata"],
    description: "Planned database maintenance window. Brief read-only period during migration.",
  },
];

/* ──────────────────── HELPERS ──────────────────── */

function statusColor(status: ServiceStatus) {
  return status === "operational" ? "bg-green-500" : status === "degraded" ? "bg-yellow-500" : "bg-red-500";
}

function statusText(status: ServiceStatus) {
  return status === "operational" ? "Inafanya Kazi" : status === "degraded" ? "Imepungua" : "Imeacha";
}

function statusTextEn(status: ServiceStatus) {
  return status === "operational" ? "Operational" : status === "degraded" ? "Degraded" : "Down";
}

function severityBadge(severity: string) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    Warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Info: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return map[severity] || "bg-gray-100 text-gray-700";
}

function incidentStatusBadge(status: string) {
  const map: Record<string, string> = {
    Resolved: "bg-green-100 text-green-700",
    Investigating: "bg-orange-100 text-orange-700",
    Identified: "bg-yellow-100 text-yellow-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

function dayLabel(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - (89 - daysAgo));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function SystemHealthPage() {
  const [hoveredDay, setHoveredDay] = useState<{ service: number; day: number } | null>(null);
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);

  const allOperational = services.every((s) => s.status === "operational");
  const hasDegraded = services.some((s) => s.status === "degraded");

  const maxError = Math.max(...errorRates.map((e) => e.e4xx + e.e5xx));

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Afya ya Mfumo</h1>
        <p className="text-sm text-muted-foreground">System Health — Infrastructure monitoring & status</p>
      </div>

      {/* ── Overall Status Banner ── */}
      <div
        className={`rounded-xl p-5 shadow-sm border-2 ${
          allOperational
            ? "bg-green-50 border-green-300"
            : hasDegraded
            ? "bg-yellow-50 border-yellow-300"
            : "bg-red-50 border-red-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-4 w-4 rounded-full animate-pulse ${
              allOperational ? "bg-green-500" : hasDegraded ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
          <div>
            <p className={`text-lg font-bold ${allOperational ? "text-green-800" : hasDegraded ? "text-yellow-800" : "text-red-800"}`}>
              {allOperational
                ? "Mifumo Yote Inafanya Kazi"
                : hasDegraded
                ? "Baadhi ya Mifumo Imepungua Utendaji"
                : "Mfumo Umeacha Kufanya Kazi"}
            </p>
            <p className={`text-xs ${allOperational ? "text-green-600" : hasDegraded ? "text-yellow-600" : "text-red-600"}`}>
              {allOperational
                ? "All Systems Operational"
                : hasDegraded
                ? "Some Systems Degraded"
                : "System Outage Detected"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Service Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.name}
            className={`rounded-xl bg-card p-5 shadow-sm border transition ${
              s.status === "operational"
                ? "border-green-100 hover:border-green-300"
                : s.status === "degraded"
                ? "border-yellow-200 hover:border-yellow-400"
                : "border-red-200 hover:border-red-400"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                <p className="text-[10px] text-muted-foreground">{s.nameEn}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${statusColor(s.status)} ${s.status !== "operational" ? "animate-pulse" : ""}`} />
                <span className={`text-xs font-medium ${s.status === "operational" ? "text-green-600" : s.status === "degraded" ? "text-yellow-600" : "text-red-600"}`}>
                  {statusText(s.status)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Uptime</p>
                <p className={`text-lg font-bold ${s.uptime >= 99.5 ? "text-green-600" : s.uptime >= 98 ? "text-yellow-600" : "text-red-600"}`}>
                  {s.uptime}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Muda wa Majibu</p>
                <p className={`text-lg font-bold ${s.responseTime <= 100 ? "text-green-600" : s.responseTime <= 300 ? "text-yellow-600" : "text-red-600"}`}>
                  {s.responseTime}ms
                </p>
              </div>
            </div>

            {/* 7-day mini bar chart */}
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[9px] text-muted-foreground mb-1.5">Siku 7 zilizopita</p>
              <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
                {s.uptimeHistory.slice(-7).map((day, di) => (
                  <div
                    key={di}
                    className={`flex-1 rounded-[2px] ${
                      day === "operational"
                        ? "bg-green-400"
                        : day === "degraded"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ height: day === "operational" ? "100%" : day === "degraded" ? "60%" : "30%" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 90-Day Uptime Timeline ── */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">Rekodi ya Uptime — Siku 90</h2>
          <p className="text-xs text-muted-foreground">90-Day Uptime Timeline — per service</p>
        </div>

        <div className="space-y-5">
          {services.map((s, si) => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground">({s.nameEn})</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.uptime}%</span>
              </div>

              <div className="relative">
                <div className="flex gap-[1px]">
                  {s.uptimeHistory.map((day, di) => (
                    <div
                      key={di}
                      className={`h-6 flex-1 rounded-[1px] cursor-pointer transition-opacity hover:opacity-80 ${
                        day === "operational"
                          ? "bg-green-400"
                          : day === "degraded"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      onMouseEnter={() => setHoveredDay({ service: si, day: di })}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  ))}
                </div>

                {hoveredDay?.service === si && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs shadow-lg whitespace-nowrap">
                    <p className="font-semibold">{dayLabel(hoveredDay.day)}</p>
                    <p>{statusText(s.uptimeHistory[hoveredDay.day])} — {statusTextEn(s.uptimeHistory[hoveredDay.day])}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-0.5">
                <span className="text-[9px] text-muted-foreground">Siku 90 zilizopita</span>
                <span className="text-[9px] text-muted-foreground">Leo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-green-400" />
            <span className="text-xs text-muted-foreground">Inafanya Kazi (Operational)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-yellow-400" />
            <span className="text-xs text-muted-foreground">Imepungua (Degraded)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-400" />
            <span className="text-xs text-muted-foreground">Imeacha (Down)</span>
          </div>
        </div>
      </div>

      {/* ── Performance Metrics ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* API Response Times */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">Muda wa Majibu ya API</h2>
          <p className="text-xs text-muted-foreground mb-5">API Response Times — Percentiles</p>

          <div className="space-y-4">
            {apiResponseTimes.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground">{r.label}</span>
                  <span className={`font-bold ${r.value <= 100 ? "text-green-600" : r.value <= 500 ? "text-yellow-600" : "text-red-600"}`}>
                    {r.value}ms
                  </span>
                </div>
                <div className="h-5 w-full rounded-lg bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${(r.value / r.max) * 100}%`,
                      backgroundColor: r.value <= 100 ? "#2D7A3A" : r.value <= 500 ? "#EAB308" : "#EF4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <p className="text-[10px] text-muted-foreground">Miunganisho Hai</p>
              <p className="text-xs text-muted-foreground">Active Connections</p>
              <p className="text-xl font-bold text-[#2D7A3A] mt-1">1,247</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Wastani wa DB Query</p>
              <p className="text-xs text-muted-foreground">Avg DB Query</p>
              <p className="text-xl font-bold text-[#2D7A3A] mt-1">8ms</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Queries Polepole</p>
              <p className="text-xs text-muted-foreground">Slow Queries (24h)</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">3</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Cache Hit Rate</p>
              <p className="text-xs text-muted-foreground">Kiwango cha Cache</p>
              <p className="text-xl font-bold text-[#2D7A3A] mt-1">96.8%</p>
            </div>
          </div>
        </div>

        {/* Error Rates */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">Kiwango cha Makosa</h2>
          <p className="text-xs text-muted-foreground mb-5">Error Rates — 4xx & 5xx per hour (today)</p>

          <div className="flex items-end gap-2" style={{ height: 180 }}>
            {errorRates.map((e) => {
              const total = e.e4xx + e.e5xx;
              const h4xx = (e.e4xx / maxError) * 160;
              const h5xx = (e.e5xx / maxError) * 160;
              return (
                <div key={e.hour} className="flex flex-1 flex-col items-center gap-1">
                  <p className="text-[9px] text-muted-foreground">{total}</p>
                  <div className="flex flex-col w-full items-center">
                    {h5xx > 0 && (
                      <div
                        className="w-full max-w-[20px] bg-red-400 rounded-t"
                        style={{ height: `${h5xx}px` }}
                      />
                    )}
                    <div
                      className={`w-full max-w-[20px] bg-yellow-400 ${h5xx > 0 ? "" : "rounded-t"}`}
                      style={{ height: `${h4xx}px` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground">{e.hour}h</p>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-yellow-400" />
              <span className="text-xs text-muted-foreground">4xx (Client Errors)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-red-400" />
              <span className="text-xs text-muted-foreground">5xx (Server Errors)</span>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Jumla 4xx</p>
              <p className="text-lg font-bold text-yellow-600">517</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Jumla 5xx</p>
              <p className="text-lg font-bold text-red-600">14</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Error Rate</p>
              <p className="text-lg font-bold text-[#2D7A3A]">0.04%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Incidents ── */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">Matukio ya Hivi Karibuni</h2>
          <p className="text-xs text-muted-foreground">Recent Incidents — Service disruptions and maintenance</p>
        </div>

        {incidents.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-green-600 font-medium">Hakuna matukio yoyote</p>
            <p className="text-xs text-muted-foreground">No incidents to report</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className={`rounded-lg border transition ${
                  inc.severity === "Critical"
                    ? "border-red-200 bg-red-50/30"
                    : inc.severity === "Warning"
                    ? "border-yellow-200 bg-yellow-50/30"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <button
                  className="w-full p-4 text-left"
                  onClick={() => setExpandedIncident(expandedIncident === inc.id ? null : inc.id)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${severityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{inc.title}</p>
                        <p className="text-[10px] text-muted-foreground">{inc.titleEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${incidentStatusBadge(inc.status)}`}>
                        {inc.status === "Resolved" ? "Imetatuliwa" : inc.status === "Investigating" ? "Inachunguzwa" : "Imetambuliwa"}
                      </span>
                      <svg
                        className={`h-4 w-4 text-muted-foreground transition-transform ${expandedIncident === inc.id ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {expandedIncident === inc.id && (
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Muda wa Kuanza</p>
                        <p className="font-medium text-foreground">{inc.startTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Muda</p>
                        <p className="font-medium text-foreground">{inc.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Huduma Zilizoathirika</p>
                        <p className="font-medium text-foreground">{inc.affectedServices.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ID</p>
                        <p className="font-medium text-foreground">{inc.id}</p>
                      </div>
                    </div>
                    <div className="mt-2 rounded-md bg-muted/50 p-3 text-xs text-foreground">
                      {inc.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
