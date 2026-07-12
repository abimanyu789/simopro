import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
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
    const { data, setData, post, processing, errors } =
        useForm<RestockFormData>({
            bahan_baku_id: selectedId ?? '',
            jenis_transaksi: 'restock',
            qty: '',
            keterangan: '',
        });

    useEffect(() => {
        if (selectedId) setData('bahan_baku_id', selectedId);
    }, [selectedId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(stokBahanBaku.store.url());
    };

    const selectedBahan = bahanBakuList.find(
        (b) => b.id === Number(data.bahan_baku_id),
    );

    // Hitung preview stok sesudah
    const qtyNum = data.qty === '' ? null : Number(data.qty);
    const stokSekarang = selectedBahan ? selectedBahan.stok : null;
    const stokSesudah =
        stokSekarang !== null && qtyNum !== null
            ? stokSekarang + qtyNum // qty positif = tambah, negatif = kurang
            : null;
    const isNegative = stokSesudah !== null && stokSesudah < 0;

    // Untuk restock, qty selalu positif; untuk penyesuaian bisa +/-
    const isRestock = data.jenis_transaksi === 'restock';
    const qtyLabel = isRestock
        ? `Jumlah Restock${selectedBahan ? ` (${selectedBahan.satuan})` : ''}`
        : `Jumlah Penyesuaian${selectedBahan ? ` (${selectedBahan.satuan})` : ''}`;
    const qtyHelperText = isRestock
        ? 'Masukkan jumlah yang ditambahkan ke stok.'
        : 'Positif (+) untuk menambah stok, negatif (−) untuk mengurangi. Contoh: 5 atau -3';

    const formatNumber = (v: number) =>
        new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(v);

    return (
        <>
            <Head title="Transaksi Stok Bahan Baku" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={stokBahanBaku.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Transaksi Stok Bahan Baku
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Catat perubahan stok bahan baku secara manual
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
                                    Bahan Baku{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <SearchableCombobox
                                    items={bahanBakuList.map((b) => ({
                                        value: b.id,
                                        label: `${b.kode_bahan} — ${b.nama_bahan}`,
                                    }))}
                                    value={data.bahan_baku_id !== '' ? Number(data.bahan_baku_id) : ''}
                                    onValueChange={(v) => setData('bahan_baku_id', Number(v))}
                                    placeholder="Pilih bahan baku..."
                                />
                                {errors.bahan_baku_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.bahan_baku_id}
                                    </p>
                                )}
                            </div>

                            {/* Info stok saat ini */}
                            {selectedBahan && (
                                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Stok saat ini
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(selectedBahan.stok)}{' '}
                                            {selectedBahan.satuan}
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
                                            v as 'restock' | 'penyesuaian',
                                        );
                                        // Reset qty saat ganti jenis
                                        setData('qty', '');
                                    }}
                                >
                                    <SelectTrigger id="jenis_transaksi">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="restock">
                                            Restock — tambah stok dari pembelian
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
                                    step={isRestock ? '0.01' : '0.01'}
                                    min={isRestock ? '0.01' : undefined}
                                    placeholder={
                                        isRestock ? '0' : 'Contoh: 5 atau -3'
                                    }
                                    value={data.qty}
                                    onChange={(e) => setData('qty', e.target.value === '' ? '' : Number(e.target.value))}
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
                                            {qtyNum !== null && qtyNum >= 0 ? (
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
                                            {formatNumber(stokSesudah)}{' '}
                                            {selectedBahan?.satuan}
                                        </span>
                                    </div>
                                    {isNegative && (
                                        <p className="mt-1 text-xs text-destructive">
                                            Stok tidak boleh negatif. Kurangi
                                            jumlah penyesuaian.
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
                                            : 'Catatan tambahan (opsional)...'
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
                                <Link href={stokBahanBaku.index.url()}>
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

StokBahanBakuCreate.layout = {
    breadcrumbs: [
        { title: 'Stok', href: '#' },
        { title: 'Bahan Baku', href: stokBahanBaku.index.url() },
        { title: 'Transaksi', href: stokBahanBaku.create.url() },
    ],
};
