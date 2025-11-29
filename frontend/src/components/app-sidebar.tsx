
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, History, Settings, BrainCircuit, LogOut, ShoppingCart } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    };

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/history', icon: History, label: 'History' },
        { href: '/settings', icon: Settings, label: 'Settings' },
        { href: '/store', icon: ShoppingCart, label: 'Store' },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" side="left" className="border-r-0 bg-transparent">
            <SidebarHeader className="h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                    <BrainCircuit className="h-10 w-10 shrink-0 text-primary drop-shadow-glow-primary" />
                </div>
                <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <LayoutDashboard />
                    </Button>
                </SidebarTrigger>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={{ children: item.label, side: 'right', align: 'center' }}
                            >
                                <Link href={item.href}>
                                    <item.icon className="shrink-0" style={{width: "2rem", height: "1.3rem"}} />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
