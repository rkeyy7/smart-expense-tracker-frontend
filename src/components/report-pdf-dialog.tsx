"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import { toast } from "sonner"
import api from "@/api/axios"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ReportPdfDialog() {
    const [open, setOpen] = useState(false)
    const [descargando, setDescargando] = useState(false)
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")

    const handleDescargar = async () => {
        if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
            toast.error("La fecha inicial no puede ser mayor a la final.")
            return
        }

        setDescargando(true)
        try {
            const params: Record<string, string> = {}
            if (fechaInicio) params.fecha_inicio = fechaInicio
            if (fechaFin) params.fecha_fin = fechaFin

            const response = await api.get("/api/reportes/pdf", {
                params,
                responseType: "blob",
            })

            const disposition = response.headers["content-disposition"] as string | undefined
            let nombre = `reporte_${new Date()
                .toISOString()
                .slice(0, 16)
                .replace(/[-:T]/g, "")}.pdf`
            const match = disposition?.match(/filename="?([^";]+)"?/)
            if (match) nombre = match[1]

            const url = URL.createObjectURL(response.data)
            const enlace = document.createElement("a")
            enlace.href = url
            enlace.download = nombre
            document.body.appendChild(enlace)
            enlace.click()
            enlace.remove()
            URL.revokeObjectURL(url)

            toast.success("Reporte PDF descargado.")
            setOpen(false)
        } catch (error) {
            console.error("Error al generar el reporte:", error)
            toast.error("No se pudo generar el reporte PDF.")
        } finally {
            setDescargando(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div>
                    <Button variant="outline">
                        <FileDown className="w-4 h-4 mr-2" />
                        Reporte PDF
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Descargar Reporte PDF</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Genera un reporte con tus ingresos y gastos. Puedes filtrar por período o dejar
                        los campos vacíos para incluir todo el historial.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fecha_inicio">Desde (opcional)</Label>
                        <Input
                            id="fecha_inicio"
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fecha_fin">Hasta (opcional)</Label>
                        <Input
                            id="fecha_fin"
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={descargando}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleDescargar} disabled={descargando}>
                        <FileDown className="w-4 h-4 mr-2" />
                        {descargando ? "Generando..." : "Descargar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
