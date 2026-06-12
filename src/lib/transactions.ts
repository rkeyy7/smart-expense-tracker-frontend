export type TipoTransaccion = "ingreso" | "gasto";

export interface Transaccion {
  id: number;
  tipo: TipoTransaccion;
  monto: number;
  categoria: string;
  descripcion: string;
  fecha: string;
}
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Oculta los decimales (.00)
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Ajuste para evitar problemas de zona horaria con la fecha
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' 
  }).format(date);
};