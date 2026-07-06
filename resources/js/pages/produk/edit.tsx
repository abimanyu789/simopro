import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ProdukForm } from '@/components/produk/produk-form';
import { Button } from '@/components/ui/button';
import produk from '@/routes/produk';
import type { ProdukEditProps, ProdukFormData } from '@/types';

export default function ProdukEdit({ produk: item }: ProdukEditProps) {
    const { data, setData, put, processing, errors } = useForm<ProdukFormData>({
        kode_produk: item.kode_produk,
        nama_produk: item.nama_produk,
        ukuran: item.ukuran ?? '',
        warna: item.warna ?? '',
        harga_jual: item.harga_jual,
        stok: item.stok,
        minimum_stok: item.minimum_stok,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(produk.update.url(item.id));
    };

    return (
        <>
            <Head title={`Edit Produk - ${item.nama_produk}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={produk.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Produk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui data produk: {item.nama_produk}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <ProdukForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        cancelHref={produk.index.url()}
                        mode="edit"
                    />
                </div>
            </div>
        </>
    );
}

ProdukEdit.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Produk', href: produk.index() },
        { title: 'Edit', href: '#' },
    ],
};
