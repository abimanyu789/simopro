import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { bahanBaku } from '@/routes/bahan-baku';
import type { BahanBakuCreateEditProps, BahanBakuFormData } from '@/types';

export default function BahanBakuCreate({ satuanOptions }: BahanBakuCreateEditProps) {
    const { data, setData, post, processing, errors } = useForm<BahanBakuFormData>({
        kode_bahan: '',
        nama_bahan: '',
        satuan: '',
        stok: 0,
        minimum_stok: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(bahanBaku.store());
    };

    return (
        <>
            <Head title="Tambah Bahan Baku" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={bahanBaku.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Bahan Baku</h1>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan bahan baku baru untuk produksi
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
                    >
                        <div className="space-y-6">
                            {/* Kode Bahan */}
                            <div className="space-y-2">
                                <Label htmlFor="kode_bahan">
                                    Kode Bahan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="kode_bahan"
                                    type="text"
                                    value={data.kode_bahan}
                                    onChange={(e) => setData('kode_bahan', e.target.value)}
                                    placeholder="Contoh: BB-001"
                                    className={errors.kode_bahan ? 'border-red-500' : ''}
                                />
                                {errors.kode_bahan && (
                                    <p className="text-sm text-red-500">{errors.kode_bahan}</p>
                                )}
                            </div>

                            {/* Nama Bahan */}
                            <div className="space-y-2">
                                <Label htmlFor="nama_bahan">
                                    Nama Bahan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nama_bahan"
                                    type="text"
                                    value={data.nama_bahan}
                                    onChange={(e) => setData('nama_bahan', e.target.value)}
                                    placeholder="Contoh: Kulit Sapi Premium"
                                    className={errors.nama_bahan ? 'border-red-500' : ''}
                                />
                                {errors.nama_bahan && (
                                    <p className="text-sm text-red-500">{errors.nama_bahan}</p>
                                )}
                            </div>

                            {/* Satuan */}
                            <div className="space-y-2">
                                <Label htmlFor="satuan">
                                    Satuan <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.satuan}
                                    onValueChange={(value) => setData('satuan', value)}
                                >
                                    <SelectTrigger
                                        className={errors.satuan ? 'border-red-500' : ''}
                                    >
                                        <SelectValue placeholder="Pilih satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {satuanOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.satuan && (
                                    <p className="text-sm text-red-500">{errors.satuan}</p>
                                )}
                            </div>

                            {/* Stok Awal */}
                            <div className="space-y-2">
                                <Label htmlFor="stok">
                                    Stok Awal <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="stok"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.stok}
                                    onChange={(e) =>
                                        setData('stok', parseFloat(e.target.value) || 0)
                                    }
                                    className={errors.stok ? 'border-red-500' : ''}
                                />
                                {errors.stok && (
                                    <p className="text-sm text-red-500">{errors.stok}</p>
                                )}
                            </div>

                            {/* Minimum Stok */}
                            <div className="space-y-2">
                                <Label htmlFor="minimum_stok">Minimum Stok</Label>
                                <Input
                                    id="minimum_stok"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.minimum_stok || ''}
                                    onChange={(e) =>
                                        setData(
                                            'minimum_stok',
                                            e.target.value ? parseFloat(e.target.value) : null,
                                        )
                                    }
                                    placeholder="Opsional"
                                    className={errors.minimum_stok ? 'border-red-500' : ''}
                                />
                                {errors.minimum_stok && (
                                    <p className="text-sm text-red-500">{errors.minimum_stok}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Batas minimum stok untuk peringatan
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Link href={bahanBaku.index()}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

BahanBakuCreate.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Bahan Baku',
            href: bahanBaku.index(),
        },
        {
            title: 'Tambah',
            href: bahanBaku.create(),
        },
    ],
};
