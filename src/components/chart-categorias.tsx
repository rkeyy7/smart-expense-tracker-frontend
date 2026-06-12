"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Definimos dos paletas de colores distintas
const COLORS_GASTOS = ["#dc2626", "#f97316", "#f59e0b", "#eab308", "#84cc16"]
const COLORS_INGRESOS = ["#16a34a", "#2563eb", "#0ea5e9", "#8b5cf6", "#d946ef"]

export function ChartCategorias({ gastos, ingresos }: { gastos: any[], ingresos: any[] }) {
  // Estado para controlar qué gráfica estamos viendo
  const [activeTab, setActiveTab] = useState<"gastos" | "ingresos">("gastos")

  // Dependiendo de la pestaña activa, elegimos los datos y los colores
  const data = activeTab === "gastos" ? gastos : ingresos
  const colors = activeTab === "gastos" ? COLORS_GASTOS : COLORS_INGRESOS

  const isEmpty = !data || data.length === 0

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Resumen por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selector de pestañas (Estilo shadcn integrado) */}
        <div className="flex p-1 bg-muted rounded-lg mb-4">
          <button
            onClick={() => setActiveTab("gastos")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "gastos"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab("ingresos")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "ingresos"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ingresos
          </button>
        </div>

        {/* Contenedor del gráfico */}
        <div className="h-[250px] w-full">
          {isEmpty ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No hay datos registrados en esta sección.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}