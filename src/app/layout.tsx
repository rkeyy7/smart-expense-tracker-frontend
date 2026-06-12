import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full ">
      <body className="h-full">{children}</body>
    </html>
  );
}