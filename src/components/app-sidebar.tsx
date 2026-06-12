"use client"

import { LayoutDashboard, Wallet, Settings, PieChart, Receipt } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, isActive: true },
    { title: "Transacciones", icon: Receipt, isActive: false },
    { title: "Reportes", icon: PieChart, isActive: false },
    { title: "Configuración", icon: Settings, isActive: false },
]

export function AppSidebar() {
    return (
        /* AÑADIMOS border-r PARA EL BORDE DERECHO Y border-border PARA EL COLOR */
        <Sidebar className="border-r border-border">
            <SidebarHeader className="border-b border-border">
                <div className="flex items-center gap-2.5 px-1 py-1.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Wallet className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">Smart Expense</span>
                        <span className="text-xs text-muted-foreground">Tracker</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}