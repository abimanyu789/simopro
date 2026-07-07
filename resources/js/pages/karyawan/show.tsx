import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { KaryawanBadge } from '@/components/karyawan/karyawan-badge';
import { KaryawanDeleteDialog } from '@/components/karyawan/karyawan-delete-dialog';
import { Button } from '@/components/ui/button';
import karyawan from '@/routes/karyawan';
import type { KaryawanShowProps } from '@/types';

export default function KaryawanShow({ karyawan: item }: KaryawanShowProps) {
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
            <Head title={`Detail Karyawan — ${item.nama_karyawan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={karyawan.index.url()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Karyawan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {item.nama_karyawan}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={karyawan.edit.url(item.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                        <KaryawanDeleteDialog
                            karyawan={item}
                            redirectTo={karyawan.index.url()}
                            trigger={
                                <Button variant="destructive">
                                    Hapus
                                </Button>
                            }
                        />
                    </div>
                </div>

                {/* Detail Card */}
                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <div className="space-y-6">
                            {/* Nama Karyawan */}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Karyawan
                                </p>
                                <p className="mt-1 text-base font-semibold">
                                    {item.nama_karyawan}
                                </p>
                            </div>

                            {/* Jabatan */}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Jabatan
                                </p>
                                <p className="mt-1 text-sm">
                                    {item.jabatan ?? (
                                        <span className="italic text-muted-foreground/60">
                                            Tidak diisi
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nomor HP
                                </p>
                                <p className="mt-1 text-sm">
                                    {item.no_hp ?? (
                                        <span className="italic text-muted-foreground/60">
                                            Tidak diisi
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Status
                                </p>
                                <div className="mt-1">
                                    <KaryawanBadge status={item.status} />
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Ditambahkan
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
                </div>
            </div>
        </>
    );
}

KaryawanShow.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Karyawan',
            href: karyawan.index.url(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
