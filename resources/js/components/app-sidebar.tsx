import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Box,
    ClipboardList,
    Database,
    DollarSign,
    FolderGit2,
    LayoutGrid,
    Package,
    Settings,
    ShoppingCart,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import bahanBaku from '@/routes/bahan-baku';
import bomCategorie from '@/routes/bom-categorie';
import customer from '@/routes/customer';
import produk from '@/routes/produk';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Data Master',
        href: '#',
        icon: Database,
        items: [
            {
                title: 'Bahan Baku',
                href: bahanBaku.index(),
            },
            {
                title: 'Bill of Materials',
                href: bomCategorie.index(),
            },
            {
                title: 'Produk',
                href: produk.index(),
            },
            {
                title: 'Karyawan',
                href: '#',
            },
            {
                title: 'Customer',
                href: customer.index(),
            },
        ],
    },
    {
        title: 'Pesanan',
        href: '#',
        icon: ShoppingCart,
    },
    {
        title: 'Stok',
        href: '#',
        icon: Box,
        items: [
            {
                title: 'Bahan Baku',
                href: '#',
            },
            {
                title: 'Produk Jadi',
                href: '#',
            },
        ],
    },
    {
        title: 'Produksi Karyawan',
        href: '#',
        icon: Wrench,
    },
    {
        title: 'Arus Kas',
        href: '#',
        icon: DollarSign,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
