"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { TipoTransaccion, Transaccion } from "@/lib/transactions"

interface AddTransactionDialogProps {
    onAdd: (transaccion: Omit<Transaccion, "id">) => void
}

const today = () => new Date().toISOString().split("T")[0]

const emptyForm = {
    tipo: "gasto" as TipoTransaccion,
    monto: "",
    categoria: "",
    descripcion: "",
    fecha: today(),
}

export function AddTransactionDialog({ onAdd }: AddTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState(emptyForm)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const monto = Number.parseFloat(formData.monto)
        if (!Number.isFinite(monto) || monto <= 0) {
            toast.error("Ingresa un monto válido mayor a cero.")
            return
        }

        onAdd({
            tipo: formData.tipo,
            monto,
            categoria: formData.categoria.trim(),
            descripcion: formData.descripcion.trim(),
            fecha: formData.fecha,
        })

        toast.success("Movimiento registrado correctamente.")
        setFormData({ ...emptyForm, fecha: today() })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Movimiento
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Nuevo Movimiento</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Registra un ingreso o un gasto para mantener tus finanzas al día.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tipo">Tipo de movimiento</Label>
                        <Select
                            value={formData.tipo}
                            onValueChange={(value) =>
                                setFormData({ ...formData, tipo: value as TipoTransaccion })
                            }
                        >
                            <SelectTrigger id="tipo" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-xl z-100 w-full">
                                <SelectGroup>
                                    <SelectItem
                                        value="gasto"
                                        className="cursor-pointer text-red-600 font-medium hover:bg-slate-100 p-2"
                                    >
                                        Gasto
                                    </SelectItem>
                                    <SelectItem
                                        value="ingreso"
                                        className="cursor-pointer text-green-600 font-medium hover:bg-slate-100 p-2"
                                    >
                                        Ingreso
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="monto">Monto ($)</Label>
                        <Input
                            id="monto"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            value={formData.monto}
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="categoria">Categoría</Label>
                        <Input
                            id="categoria"
                            type="text"
                            required
                            placeholder="Ej. Comida, Alquiler, Salario"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                            id="fecha"
                            type="date"
                            required
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            type="text"
                            placeholder="Detalles opcionales..."
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="mt-4 sm:justify-end">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Guardar Registro
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
