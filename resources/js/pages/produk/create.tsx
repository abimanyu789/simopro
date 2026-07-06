import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ProdukForm } from '@/components/produk/produk-form';
import { Button } from '@/components/ui/button';
import produk from '@/routes/produk';
import type { ProdukCreateProps, ProdukFormData } from '@/types';

export default function ProdukCreate({ bomCategories }: ProdukCreateProps) {
    const { data, setData, post, processing, errors } = useForm<ProdukFormData>(
        {
            kode_produk: '',
            nama_produk: '',
            ukuran: '',
            warna: '',
            harga_jual: null,
            stok: 0,
            minimum_stok: null,
            bom_category_id: null,
        },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(produk.store.url());
    };

    return (
        <>
            <Head title="Tambah Produk" />

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
                            Tambah Produk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan produk baru ke katalog Provillo
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
                        mode="create"
                        bomCategories={bomCategories}
                    />
                </div>
            </div>
        </>
    );
}

ProdukCreate.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Produk', href: produk.index() },
        { title: 'Tambah', href: produk.create() },
    ],
};
