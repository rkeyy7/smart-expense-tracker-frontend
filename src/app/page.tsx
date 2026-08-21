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
    <div className="h-screen w-full overflow-hidden bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden h-full">
          <header className="shrink-0 z-10 flex h-16 items-center gap-3 bg-background/80 px-4 border-b">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-base font-semibold">Smart Expense Tracker</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ReportPdfDialog />
              <AddTransactionDialog onAdd={handleAdd} />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Cerrar
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 bg-slate-50/30">
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