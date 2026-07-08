import { Link } from '@inertiajs/react';
import {
    Box,
    Database,
    DollarSign,
    LayoutGrid,
    ShoppingCart,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import karyawan from '@/routes/karyawan';
import pesanan from '@/routes/pesanan';
import produk from '@/routes/produk';
import stokBahanBaku from '@/routes/stok-bahan-baku';
import stokProdukJadi from '@/routes/stok-produk-jadi';
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
                href: karyawan.index(),
            },
            {
                title: 'Customer',
                href: customer.index(),
            },
        ],
    },
    {
        title: 'Pesanan',
        href: pesanan.index.url(),
        icon: ShoppingCart,
    },
    {
        title: 'Stok',
        href: '#',
        icon: Box,
        items: [
            {
                title: 'Bahan Baku',
                href: stokBahanBaku.index.url(),
            },
            {
                title: 'Produk Jadi',
                href: stokProdukJadi.index.url(),
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
