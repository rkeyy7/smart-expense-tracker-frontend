"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SummaryCards } from "@/components/summary-cards"
import { TransactionsTable } from "@/components/transactions-table"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { ReportPdfDialog } from "@/components/report-pdf-dialog"
import { ChartCategorias } from "@/components/chart-categorias"
import { type Transaccion } from "@/lib/transactions"
import { toast } from "sonner"
import api from "@/api/axios"

export default function DashboardPage() {
  const router = useRouter()
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [datosGraficoGastos, setDatosGraficoGastos] = useState<any[]>([]) 
  const [datosGraficoIngresos, setDatosGraficoIngresos] = useState<any[]>([]) 
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // CAMBIO: Ahora verificamos si existe el TOKEN
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      cargarDatos(); 
    }
  }, [router]);

  // CAMBIO: Ya no necesitamos el ID en la URL, el JWT lo maneja el backend
  const cargarDatos = async () => {
    try {
      const [resTransacciones, resGraficoGastos, resGraficoIngresos] = await Promise.all([
        api.get(`/transacciones`),
        api.get(`/api/gastos-por-categoria`),
        api.get(`/api/ingresos-por-categoria`)
      ]);
      
      setTransacciones(resTransacciones.data);
      setDatosGraficoGastos(resGraficoGastos.data);
      setDatosGraficoIngresos(resGraficoIngresos.data);
      setCargando(false);
    } catch (error) {
      console.error("Error cargando finanzas:", error);
      toast.error("Sesión expirada o error al cargar datos.");
      localStorage.removeItem('token'); // Si falla, borramos token y al login
      router.push('/login');
    }
  };

  const handleAdd = async (nueva: Omit<Transaccion, "id">) => {
    try {
      await api.post('/transacciones', nueva); // Ya no enviamos user_id
      cargarDatos();
      toast.success("Movimiento registrado");
    } catch (error) {
      toast.error("Error al guardar el movimiento.");
    }
  }

  const handleEdit = async (id: number, data: Omit<Transaccion, "id" | "user_id">) => {
    try {
      await api.put(`/transacciones/${id}`, data);
      cargarDatos();
      toast.success("Movimiento actualizado");
    } catch (error) {
      toast.error("Error al actualizar el movimiento.");
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este movimiento?")) return;

    try {
      await api.delete(`/transacciones/${id}`);
      cargarDatos();
      toast.success("Movimiento eliminado");
    } catch (error) {
      toast.error("Error al eliminar el movimiento.");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos el token
    router.push('/login');
  }

  const { ingresos, gastos, balanceNeto } = useMemo(() => {
    const ing = transacciones.filter(t => t.tipo === "ingreso").reduce((acc, curr) => acc + curr.monto, 0)
    const gas = transacciones.filter(t => t.tipo === "gasto").reduce((acc, curr) => acc + curr.monto, 0)
    return { ingresos: ing, gastos: gas, balanceNeto: ing - gas }
  }, [transacciones])

  const transaccionesOrdenadas = useMemo(
    () => [...transacciones].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id),
    [transacciones],
  )

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="h-dvh w-full overflow-x-hidden bg-background">
      <SidebarProvider className="h-full min-h-0">
        <AppSidebar />
        <SidebarInset className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 z-10 flex min-h-16 flex-wrap items-center gap-2 border-b bg-background/80 px-3 py-2 sm:gap-3 sm:px-4 sm:py-0">
            <SidebarTrigger />
            <div className="min-w-0 flex-1 sm:flex-none">
              <h1 className="truncate text-sm font-semibold sm:text-base">Smart Expense Tracker</h1>
            </div>
            <div className="order-3 flex basis-full items-center justify-end gap-2 sm:order-0 sm:ml-auto sm:basis-auto">
              <ReportPdfDialog />
              <AddTransactionDialog onAdd={handleAdd} />
              <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut className="size-4 sm:mr-2" /> <span className="hidden sm:inline">Cerrar</span>
              </Button>
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-slate-50/30">
            <SummaryCards ingresos={ingresos} gastos={gastos} balanceNeto={balanceNeto} />
            
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              <div className="min-w-0 overflow-x-auto pb-2">
                <TransactionsTable 
                  transacciones={transaccionesOrdenadas} 
                  onDelete={handleDelete} 
                  onEdit={handleEdit} 
                />
              </div>
              <ChartCategorias 
                gastos={datosGraficoGastos} 
                ingresos={datosGraficoIngresos} 
              />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}