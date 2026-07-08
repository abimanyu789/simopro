import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PesananForm } from '@/components/pesanan/pesanan-form';
import pesanan from '@/routes/pesanan';
import type { PesananCreateProps, PesananFormData } from '@/types';

export default function PesananCreate({ customers, produks }: PesananCreateProps) {
    const { data, setData, post, processing, errors } = useForm<PesananFormData>({
        customer_id:    '',
        tanggal:        new Date().toISOString().slice(0, 10),
        items:          [{ produk_id: '', qty: '', harga: '' }],
        tipe_diskon:    'nominal',
        diskon:         '',
        catatan_diskon: '',
        ongkir:         '',
        keterangan:     '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(pesanan.store.url());
    };

    return (
        <>
            <Head title="Buat Pesanan Baru" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={pesanan.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Pesanan Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Isi form di bawah untuk membuat pesanan baru
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-4xl">
                    <PesananForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        cancelHref={pesanan.index.url()}
                        mode="create"
                        customers={customers}
                        produks={produks}
                    />
                </div>
            </div>
        </>
    );
}

PesananCreate.layout = {
    breadcrumbs: [
        { title: 'Pesanan', href: pesanan.index.url() },
        { title: 'Buat Pesanan', href: pesanan.create.url() },
    ],
};
