import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { KaryawanForm } from '@/components/karyawan/karyawan-form';
import karyawan from '@/routes/karyawan';
import type { KaryawanCreateEditProps, KaryawanFormData } from '@/types';

export default function KaryawanEdit({ karyawan: item }: KaryawanCreateEditProps) {
    const { data, setData, put, processing, errors } =
        useForm<KaryawanFormData>({
            nama_karyawan: item?.nama_karyawan ?? '',
            jabatan: item?.jabatan ?? '',
            no_hp: item?.no_hp ?? '',
            status: item?.status ?? '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(karyawan.update.url(item!.id));
    };

    return (
        <>
            <Head title={`Edit Karyawan — ${item?.nama_karyawan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={karyawan.index.url()}>
                        <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Karyawan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {item?.nama_karyawan}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <KaryawanForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        cancelHref={karyawan.show.url(item!.id)}
                        mode="edit"
                        submitLabel="Simpan Perubahan"
                    />
                </div>
            </div>
        </>
    );
}

KaryawanEdit.layout = {
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
            title: 'Edit',
            href: '#',
        },
    ],
};
