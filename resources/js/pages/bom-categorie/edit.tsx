import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BomCategorieForm } from '@/components/bom/bom-categorie-form';
import { Button } from '@/components/ui/button';
import bomCategorie from '@/routes/bom-categorie';
import type { BomCategorieEditProps, BomCategorieFormData } from '@/types';

export default function BomCategorieEdit({ bomCategorie: item }: BomCategorieEditProps) {
    const { data, setData, put, processing, errors } = useForm<BomCategorieFormData>({
        nama_bom: item.nama_bom,
        keterangan: item.keterangan ?? '',
        details: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(bomCategorie.update.url(item.id));
    };

    return (
        <>
            <Head title={`Edit BOM - ${item.nama_bom}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={bomCategorie.show(item.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit BOM</h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi BOM: {item.nama_bom}
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
                        cancelHref={bomCategorie.show.url(item.id)}
                        bahanBakus={[]}
                        mode="edit"
                    />
                </div>
            </div>
        </>
    );
}

BomCategorieEdit.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Bill of Materials', href: bomCategorie.index() },
        { title: 'Edit', href: '#' },
    ],
};
