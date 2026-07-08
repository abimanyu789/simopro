import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
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
    const { data, setData, post, processing, errors } =
        useForm<PengirimanFormData>({
            produk_id: selectedId ?? '',
            jenis_transaksi: 'pengiriman',
            qty: '',
            keterangan: '',
        });

    useEffect(() => {
        if (selectedId) setData('produk_id', selectedId);
    }, [selectedId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(stokProdukJadi.store.url());
    };

    const selectedProduk = produkList.find(
        (p) => p.id === Number(data.produk_id),
    );

    // Hitung preview stok sesudah
    const qtyNum = data.qty === '' ? null : Number(data.qty);
    const stokSekarang = selectedProduk ? selectedProduk.stok : null;

    // Pengiriman selalu mengurangi, penyesuaian bisa +/-
    const effectiveQty =
        data.jenis_transaksi === 'pengiriman' && qtyNum !== null
            ? -Math.abs(qtyNum) // pengiriman selalu kurangi
            : qtyNum;

    const stokSesudah =
        stokSekarang !== null && effectiveQty !== null
            ? stokSekarang + effectiveQty
            : null;
    const isNegative = stokSesudah !== null && stokSesudah < 0;

    const isPengiriman = data.jenis_transaksi === 'pengiriman';
    const qtyLabel = isPengiriman
        ? 'Jumlah Pengiriman (pcs)'
        : 'Jumlah Penyesuaian (pcs)';
    const qtyHelperText = isPengiriman
        ? 'Masukkan jumlah produk yang dikirim.'
        : 'Positif (+) untuk menambah stok, negatif (−) untuk mengurangi. Contoh: 5 atau -3';

    return (
        <>
            <Head title="Transaksi Stok Produk Jadi" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={stokProdukJadi.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Transaksi Stok Produk Jadi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Catat perubahan stok produk jadi secara manual
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
                                    Produk{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={
                                        data.produk_id !== ''
                                            ? String(data.produk_id)
                                            : ''
                                    }
                                    onValueChange={(v) =>
                                        setData('produk_id', Number(v))
                                    }
                                >
                                    <SelectTrigger id="produk_id">
                                        <SelectValue placeholder="Pilih produk..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produkList.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={String(p.id)}
                                            >
                                                {p.kode_produk} —{' '}
                                                {p.nama_produk}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.produk_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.produk_id}
                                    </p>
                                )}
                            </div>

                            {/* Info stok saat ini */}
                            {selectedProduk && (
                                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Stok saat ini
                                        </span>
                                        <span className="font-medium">
                                            {selectedProduk.stok} pcs
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Jenis Transaksi */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="jenis_transaksi">
                                    Jenis Transaksi{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.jenis_transaksi}
                                    onValueChange={(v) => {
                                        setData(
                                            'jenis_transaksi',
                                            v as 'pengiriman' | 'penyesuaian',
                                        );
                                        setData('qty', '');
                                    }}
                                >
                                    <SelectTrigger id="jenis_transaksi">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pengiriman">
                                            Pengiriman — produk keluar ke
                                            customer
                                        </SelectItem>
                                        <SelectItem value="penyesuaian">
                                            Penyesuaian — koreksi stok manual
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_transaksi && (
                                    <p className="text-sm text-destructive">
                                        {errors.jenis_transaksi}
                                    </p>
                                )}
                            </div>

                            {/* Qty */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="qty">
                                    {qtyLabel}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="qty"
                                    type="number"
                                    step="1"
                                    min={isPengiriman ? '1' : undefined}
                                    placeholder={
                                        isPengiriman ? '0' : 'Contoh: 5 atau -3'
                                    }
                                    value={data.qty}
                                    onChange={(e) =>
                                        setData(
                                            'qty',
                                            e.target.value === ''
                                                ? ''
                                                : Number(e.target.value),
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {qtyHelperText}
                                </p>
                                {errors.qty && (
                                    <p className="text-sm text-destructive">
                                        {errors.qty}
                                    </p>
                                )}
                            </div>

                            {/* Preview stok sesudah */}
                            {stokSesudah !== null && (
                                <div
                                    className={`rounded-lg border px-4 py-3 text-sm ${
                                        isNegative
                                            ? 'border-destructive/30 bg-destructive/10'
                                            : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {effectiveQty !== null &&
                                            effectiveQty >= 0 ? (
                                                <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <TrendingDown className="size-4 text-destructive" />
                                            )}
                                            <span className="text-muted-foreground">
                                                Stok sesudah
                                            </span>
                                        </div>
                                        <span
                                            className={`font-mono font-semibold ${
                                                isNegative
                                                    ? 'text-destructive'
                                                    : 'text-green-700 dark:text-green-300'
                                            }`}
                                        >
                                            {stokSesudah} pcs
                                        </span>
                                    </div>
                                    {isNegative && (
                                        <p className="mt-1 text-xs text-destructive">
                                            Stok tidak boleh negatif. Kurangi
                                            jumlah transaksi.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Keterangan */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="keterangan">
                                    Keterangan
                                    {data.jenis_transaksi === 'penyesuaian' && (
                                        <span className="text-destructive">
                                            {' '}
                                            *
                                        </span>
                                    )}
                                </Label>
                                <Textarea
                                    id="keterangan"
                                    placeholder={
                                        data.jenis_transaksi === 'penyesuaian'
                                            ? 'Jelaskan alasan penyesuaian stok...'
                                            : 'Catatan pengiriman (opsional)...'
                                    }
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData('keterangan', e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors.keterangan && (
                                    <p className="text-sm text-destructive">
                                        {errors.keterangan}
                                    </p>
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
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Transaksi'}
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
        { title: 'Transaksi', href: stokProdukJadi.create.url() },
    ],
};
