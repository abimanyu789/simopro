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
import stokProdukJadi from '@/routes/stok-produk-jadi';
import type { PengirimanFormData, StokProdukJadiCreateProps } from '@/types';

export default function StokProdukJadiCreate({
    produkList,
    selectedId,
}: StokProdukJadiCreateProps) {
    const { data, setData, post, processing, errors } = useForm<PengirimanFormData>({
        produk_id:  selectedId ?? '',
        qty:        '',
        keterangan: '',
    });

    useEffect(() => {
        if (selectedId) {
            setData('produk_id', selectedId);
        }
    }, [selectedId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(stokProdukJadi.store.url());
    };

    const selectedProduk = produkList.find((p) => p.id === Number(data.produk_id));

    return (
        <>
            <Head title="Pengiriman Produk Jadi" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={stokProdukJadi.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengiriman Produk Jadi</h1>
                        <p className="text-sm text-muted-foreground">
                            Catat pengiriman produk jadi secara manual
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
                            {/* Pilih Produk */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="produk_id">
                                    Produk <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.produk_id !== '' ? String(data.produk_id) : ''}
                                    onValueChange={(v) => setData('produk_id', Number(v))}
                                >
                                    <SelectTrigger id="produk_id">
                                        <SelectValue placeholder="Pilih produk..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produkList.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.kode_produk} — {p.nama_produk}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.produk_id && (
                                    <p className="text-sm text-destructive">{errors.produk_id}</p>
                                )}
                            </div>

                            {/* Info stok saat ini (read-only) */}
                            {selectedProduk && (
                                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Stok saat ini</span>
                                        <span className="font-medium">
                                            {selectedProduk.stok} pcs
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Jumlah Pengiriman */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="qty">
                                    Jumlah Pengiriman (pcs){' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="qty"
                                    type="number"
                                    step="1"
                                    min="1"
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
                                    placeholder="Catatan pengiriman (opsional)..."
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
                                <Link href={stokProdukJadi.index.url()}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Pengiriman'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

StokProdukJadiCreate.layout = {
    breadcrumbs: [
        { title: 'Stok', href: '#' },
        { title: 'Produk Jadi', href: stokProdukJadi.index.url() },
        { title: 'Pengiriman', href: stokProdukJadi.create.url() },
    ],
};
