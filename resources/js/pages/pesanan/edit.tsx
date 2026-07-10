import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PesananForm } from '@/components/pesanan/pesanan-form';
import pesanan from '@/routes/pesanan';
import type { PesananEditProps, PesananFormData } from '@/types';

export default function PesananEdit({
    pesanan: item,
    customers,
    produks,
}: PesananEditProps) {
    const { data, setData, put, processing, errors } = useForm<PesananFormData>(
        {
            customer_id: item.customer_id,
            tanggal: item.tanggal.slice(0, 10),
            jenis_pembayaran: item.jenis_pembayaran ?? '',
            items: (item.detail_pesanan ?? []).map((d) => ({
                produk_id: d.produk_id,
                qty: d.qty,
                harga: Number(d.harga),
            })),
            tipe_diskon: 'nominal',
            diskon: Number(item.diskon) || '',
            catatan_diskon: '',
            ongkir: Number(item.ongkir) || '',
            keterangan: item.keterangan ?? '',
        },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(pesanan.update.url(item.id));
    };

    return (
        <>
            <Head title={`Edit Pesanan — ${item.nomor_pesanan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={pesanan.show.url(item.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Pesanan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {item.nomor_pesanan}
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
                        cancelHref={pesanan.show.url(item.id)}
                        mode="edit"
                        customers={customers}
                        produks={produks}
                    />
                </div>
            </div>
        </>
    );
}

PesananEdit.layout = {
    breadcrumbs: [
        { title: 'Pesanan', href: pesanan.index.url() },
        { title: 'Detail', href: '#' },
        { title: 'Edit', href: '#' },
    ],
};
