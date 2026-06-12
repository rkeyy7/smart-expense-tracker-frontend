import { TrendingUp, TrendingDown, Wallet, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/transactions"

interface SummaryCardsProps {
  ingresos: number
  gastos: number
  balanceNeto: number
}

interface KpiCardProps {
  title: string
  amount: number
  caption: string
  icon: LucideIcon
  accentClassName: string
  iconWrapClassName: string
}

function KpiCard({ title, amount, caption, icon: Icon, accentClassName, iconWrapClassName }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 size-28 text-foreground/[0.03]"
        strokeWidth={1.5}
      />
      <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", iconWrapClassName)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-semibold tracking-tight tabular-nums", accentClassName)}>
          {formatCurrency(amount)}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  )
}

export function SummaryCards({ ingresos, gastos, balanceNeto }: SummaryCardsProps) {
  const balancePositivo = balanceNeto >= 0

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <KpiCard
        title="Ingresos Totales"
        amount={ingresos}
        caption="Actualizado hoy"
        icon={TrendingUp}
        accentClassName="text-positive"
        iconWrapClassName="bg-positive/10 text-positive"
      />
      <KpiCard
        title="Gastos Totales"
        amount={gastos}
        caption="Actualizado hoy"
        icon={TrendingDown}
        accentClassName="text-negative"
        iconWrapClassName="bg-negative/10 text-negative"
      />
      <KpiCard
        title="Balance Neto"
        amount={balanceNeto}
        caption={balancePositivo ? "Finanzas saludables" : "Atención: saldo en rojo"}
        icon={Wallet}
        accentClassName={balancePositivo ? "text-primary" : "text-negative"}
        iconWrapClassName={
          balancePositivo ? "bg-primary/10 text-primary" : "bg-negative/10 text-negative"
        }
      />
    </div>
  )
}
