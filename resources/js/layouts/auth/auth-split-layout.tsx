import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Panel kiri — branding Provillo */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                {/* Pola dekoratif */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, #0ea5e9 0%, transparent 50%)`,
                    }}
                />

                {/* Logo & nama aplikasi */}
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3 text-lg font-semibold tracking-tight"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white overflow-hidden ring-1 ring-white/20 backdrop-blur-sm">
                        <img src="/LogoProvillo.jpg" alt="Logo" className="size-full object-cover" />
                    </div>
                    <span>SIMOPRO</span>
                </Link>

                {/* Konten tengah panel */}
                <div className="relative z-20 mt-auto">
                    <div className="mb-8 space-y-1">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/20">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Sistem Manajemen Operasional Provillo
                        </div>
                    </div>

                    <blockquote className="space-y-3">
                        <p className="text-2xl font-semibold leading-snug text-white">
                            Kelola Produksi, Pesanan, dan Keuangan{' '}
                            <span className="text-sky-300">UMKM sepatu</span>{' '}
                            dalam satu platform terpadu.
                        </p>
                        <footer className="text-sm text-white/50">
                            Provillo — Mojokerto
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Panel kanan — form login */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px]">
                    {/* Logo mobile (tampil hanya di layar kecil) */}
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white overflow-hidden">
                            <img src="/LogoProvillo.jpg" alt="Logo" className="size-full object-cover" />
                        </div>
                        <span className="text-base font-semibold">SIMOPRO</span>
                    </Link>

                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
