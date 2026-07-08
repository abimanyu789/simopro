import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { CustomerBadge } from '@/components/customer/customer-badge';
import { CustomerDeleteDialog } from '@/components/customer/customer-delete-dialog';
import { PesananStatusBadge } from '@/components/pesanan/pesanan-status-badge';
import { Button } from '@/components/ui/button';
import customer from '@/routes/customer';
import pesanan from '@/routes/pesanan';
import type { CustomerShowProps } from '@/types';

export default function CustomerShow({ customer: item }: CustomerShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`Detail Customer — ${item.nama_customer}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={customer.index.url()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Customer
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {item.nama_customer}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={customer.edit.url(item.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                        <CustomerDeleteDialog
                            customer={item}
                            redirectTo={customer.index.url()}
                            trigger={
                                <Button variant="destructive">Hapus</Button>
                            }
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Informasi Utama */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Customer
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Customer
                                </p>
                                <p className="mt-1 font-medium">
                                    {item.nama_customer}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Jenis Customer
                                </p>
                                <div className="mt-1">
                                    <CustomerBadge
                                        jenis={item.jenis_customer}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nomor HP
                                </p>
                                <p className="mt-1 font-mono text-sm">
                                    {item.no_hp ?? (
                                        <span className="text-muted-foreground italic">
                                            Tidak ada
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">Alamat</h2>
                        <p className="text-sm leading-relaxed">
                            {item.alamat ?? (
                                <span className="text-muted-foreground italic">
                                    Alamat belum diisi.
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Riwayat Pesanan */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Riwayat Pesanan
                        </h2>
                        {(item.pesanans ?? []).length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="pb-2 text-left font-medium">
                                            Nomor Pesanan
                                        </th>
                                        <th className="pb-2 text-left font-medium">
                                            Tanggal
                                        </th>
                                        <th className="pb-2 text-left font-medium">
                                            Status
                                        </th>
                                        <th className="pb-2 text-right font-medium">
                                            Total
                                        </th>
                                        <th className="pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(item.pesanans ?? []).map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-2 font-mono text-xs">
                                                {p.nomor_pesanan}
                                            </td>
                                            <td className="py-2 text-muted-foreground">
                                                {new Date(
                                                    p.tanggal,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-2">
                                                <PesananStatusBadge
                                                    status={p.status}
                                                />
                                            </td>
                                            <td className="py-2 text-right font-mono">
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                    {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0,
                                                    },
                                                ).format(Number(p.total))}
                                            </td>
                                            <td className="py-2 text-right">
                                                <Link
                                                    href={pesanan.show.url(
                                                        p.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                    >
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada pesanan dari customer ini.
                            </p>
                        )}
                    </div>

                    {/* Informasi Sistem */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Sistem
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Dibuat Pada
                                </p>
                                <p className="mt-1 text-sm">
                                    {formatDate(item.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Terakhir Diubah
                                </p>
                                <p className="mt-1 text-sm">
                                    {formatDate(item.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CustomerShow.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Customer',
            href: customer.index.url(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
