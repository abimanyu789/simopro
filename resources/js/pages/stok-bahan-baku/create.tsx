import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import stokBahanBaku from '@/routes/stok-bahan-baku';
import type { RestockFormData, StokBahanBakuCreateProps } from '@/types';

export default function StokBahanBakuCreate({
    bahanBakuList,
    selectedId,
}: StokBahanBakuCreateProps) {
    const { data, setData, post, processing, errors } = useForm<RestockFormData>({
        bahan_baku_id: selectedId ?? '',
        qty: '',
        keterangan: '',
    });

    // Pre-select bahan baku jika ada query param
    useEffect(() => {
        if (selectedId) {
            setData('bahan_baku_id', selectedId);
        }
    }, [selectedId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(stokBahanBaku.store.url());
    };

    const selectedBahan = bahanBakuList.find((b) => b.id === Number(data.bahan_baku_id));

    return (
        <>
            <Head title="Restock Bahan Baku" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={stokBahanBaku.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Restock Bahan Baku</h1>
                        <p className="text-sm text-muted-foreground">
                            Tambah stok bahan baku secara manual
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
                    >
                        <div className="flex flex-col gap-6">
                            {/* Pilih Bahan Baku */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="bahan_baku_id">
                                    Bahan Baku <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.bahan_baku_id !== '' ? String(data.bahan_baku_id) : ''}
                                    onValueChange={(v) => setData('bahan_baku_id', Number(v))}
                                >
                                    <SelectTrigger id="bahan_baku_id">
                                        <SelectValue placeholder="Pilih bahan baku..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bahanBakuList.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.kode_bahan} — {b.nama_bahan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.bahan_baku_id && (
                                    <p className="text-sm text-destructive">{errors.bahan_baku_id}</p>
                                )}
                            </div>

                            {/* Info stok saat ini (read-only) */}
                            {selectedBahan && (
                                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Stok saat ini</span>
                                        <span className="font-medium">
                                            {new Intl.NumberFormat('id-ID', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(selectedBahan.stok)}{' '}
                                            {selectedBahan.satuan}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Jumlah Restock */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="qty">
                                    Jumlah Restock{selectedBahan ? ` (${selectedBahan.satuan})` : ''}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="qty"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0"
                                    value={data.qty}
                                    onChange={(e) =>
                                        setData('qty', e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                />
                                {errors.qty && (
                                    <p className="text-sm text-destructive">{errors.qty}</p>
                                )}
                            </div>

                            {/* Keterangan */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    placeholder="Catatan restock (opsional)..."
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    rows={3}
                                />
                                {errors.keterangan && (
                                    <p className="text-sm text-destructive">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Link href={stokBahanBaku.index.url()}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Restock'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

StokBahanBakuCreate.layout = {
    breadcrumbs: [
        { title: 'Stok', href: '#' },
        { title: 'Bahan Baku', href: stokBahanBaku.index.url() },
        { title: 'Restock', href: stokBahanBaku.create.url() },
    ],
};
