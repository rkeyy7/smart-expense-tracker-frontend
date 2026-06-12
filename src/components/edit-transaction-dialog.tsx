"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
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

interface EditTransactionDialogProps {
    transaccion: Transaccion
    onEdit: (id: number, data: Omit<Transaccion, "id" | "user_id">) => void
}

export function EditTransactionDialog({ transaccion, onEdit }: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        tipo: transaccion.tipo,
        monto: transaccion.monto.toString(),
        categoria: transaccion.categoria,
        descripcion: transaccion.descripcion || "",
        fecha: transaccion.fecha,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const monto = Number.parseFloat(formData.monto)
        if (!Number.isFinite(monto) || monto <= 0) {
            toast.error("Ingresa un monto válido.")
            return
        }

        onEdit(transaccion.id!, {
            tipo: formData.tipo,
            monto,
            categoria: formData.categoria.trim(),
            descripcion: formData.descripcion.trim(),
            fecha: formData.fecha,
        })

        toast.success("Movimiento actualizado.")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-600">
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border shadow-lg">
                <DialogHeader>
                    <DialogTitle>Editar Movimiento</DialogTitle>
                    <DialogDescription>Modifica los detalles de este registro.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Campos idénticos a AddTransactionDialog */}
                    <div className="flex flex-col gap-2">
                        <Label>Tipo</Label>
                        <Select value={formData.tipo} onValueChange={(v) => setFormData({...formData, tipo: v as TipoTransaccion})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="gasto" className="text-red-600">Gasto</SelectItem>
                                    <SelectItem value="ingreso" className="text-green-600">Ingreso</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Monto ($)</Label>
                        <Input type="number" value={formData.monto} onChange={(e) => setFormData({...formData, monto: e.target.value})} />
                    </div>
                    {/* ... (añade los campos de categoria, fecha y descripcion igual que en AddDialog) */}
                    <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}