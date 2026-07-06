import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BomCategorieForm } from '@/components/bom/bom-categorie-form';
import { Button } from '@/components/ui/button';
import bomCategorie from '@/routes/bom-categorie';
import type { BomCategorieCreateProps, BomCategorieFormData } from '@/types';

export default function BomCategorieCreate({ bahanBakus }: BomCategorieCreateProps) {
    const { data, setData, post, processing, errors } = useForm<BomCategorieFormData>({
        nama_bom: '',
        keterangan: '',
        details: [{ bahan_baku_id: null, qty_per_pair: '' }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(bomCategorie.store.url());
    };

    return (
        <>
            <Head title="Tambah BOM" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={bomCategorie.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah BOM</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat Bill of Materials baru dengan komposisi bahan baku
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-3xl">
                    <BomCategorieForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        cancelHref={bomCategorie.index.url()}
                        bahanBakus={bahanBakus}
                        mode="create"
                    />
                </div>
            </div>
        </>
    );
}

BomCategorieCreate.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Bill of Materials', href: bomCategorie.index() },
        { title: 'Tambah', href: bomCategorie.create() },
    ],
};
