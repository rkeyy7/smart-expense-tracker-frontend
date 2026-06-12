import { ArrowDownLeft, ArrowUpRight, Inbox, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate, type Transaccion } from "@/lib/transactions"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"

interface TransactionsTableProps {
  transacciones: Transaccion[]
  onDelete: (id: number) => void
  onEdit: (id: number, data: Omit<Transaccion, "id" | "user_id">) => void
}

export function TransactionsTable({ transacciones, onDelete, onEdit }: TransactionsTableProps) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Historial Reciente</CardTitle>
        <CardDescription>
          {transacciones.length} movimiento{transacciones.length === 1 ? "" : "s"} registrado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transacciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-foreground">Sin movimientos aún</p>
              <p className="text-sm text-muted-foreground">
                Añade tu primer ingreso o gasto para comenzar.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead>Categoría</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacciones.map((t) => {
                const esIngreso = t.tipo === "ingreso"
                return (
                  <TableRow key={t.id} className="border-none hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                            esIngreso ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative",
                          )}
                        >
                          {esIngreso ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{t.categoria}</p>
                          {t.descripcion && <p className="truncate text-sm text-muted-foreground">{t.descripcion}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="font-normal border-none">
                        {esIngreso ? "Ingreso" : "Gasto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(t.fecha)}
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", esIngreso ? "text-positive" : "text-negative")}>
                      {esIngreso ? "+" : "-"}{formatCurrency(t.monto)}
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      <EditTransactionDialog transaccion={t} onEdit={onEdit} />
                      <Button variant="ghost" size="icon" onClick={() => onDelete(t.id!)} className="text-muted-foreground hover:text-red-600">
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}