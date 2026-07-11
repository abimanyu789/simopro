import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ArusKasBadge } from '@/components/arus-kas/arus-kas-badge';
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
import arusKas from '@/routes/arus-kas';
import type { ArusKasCreateEditProps, ArusKasFormData } from '@/types';

export default function ArusKasEdit({ transaksi }: ArusKasCreateEditProps) {
    if (!transaksi) return null;

    const { data, setData, put, processing, errors } = useForm<ArusKasFormData>({
        tanggal:           transaksi.tanggal?.slice(0, 10) ?? '',
        jenis:             transaksi.jenis,
        kategori:          transaksi.kategori ?? '',
        nominal:           transaksi.nominal ? Number(transaksi.nominal) : '',
        metode_pembayaran: transaksi.metode_pembayaran ?? '',
        keterangan:        transaksi.keterangan ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(arusKas.update.url(transaksi.id));
    };

    return (
        <>
            <Head title="Edit Transaksi Kas" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="flex items-center gap-4">
                    <Link href={arusKas.show.url(transaksi.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Transaksi</h1>
                        <div className="mt-1 flex items-center gap-2">
                            <ArusKasBadge jenis={transaksi.jenis} />
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
                    >
                        <div className="space-y-5">
                            {/* Jenis */}
                            <div className="space-y-2">
                                <Label htmlFor="jenis">
                                    Jenis Transaksi <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.jenis}
                                    onValueChange={(v) => setData('jenis', v as 'pemasukan' | 'pengeluaran')}
                                >
                                    <SelectTrigger id="jenis">
                                        <SelectValue placeholder="Pilih jenis..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pemasukan">Pemasukan</SelectItem>
                                        <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis && <p className="text-sm text-destructive">{errors.jenis}</p>}
                            </div>

                            {/* Tanggal */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">
                                    Tanggal <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                />
                                {errors.tanggal && <p className="text-sm text-destructive">{errors.tanggal}</p>}
                            </div>

                            {/* Nominal */}
                            <div className="space-y-2">
                                <Label htmlFor="nominal">
                                    Nominal (Rp) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nominal"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.nominal}
                                    onChange={(e) => setData('nominal', e.target.value === '' ? '' : Number(e.target.value))}
                                />
                                {errors.nominal && <p className="text-sm text-destructive">{errors.nominal}</p>}
                            </div>

                            {/* Kategori */}
                            <div className="space-y-2">
                                <Label htmlFor="kategori">Kategori</Label>
                                <Input
                                    id="kategori"
                                    type="text"
                                    placeholder="cth: Biaya Operasional, Pendapatan Penjualan..."
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                />
                            </div>

                            {/* Metode */}
                            <div className="space-y-2">
                                <Label htmlFor="metode_pembayaran">Metode Pembayaran</Label>
                                <Input
                                    id="metode_pembayaran"
                                    type="text"
                                    placeholder="cth: Transfer Bank, Tunai, QRIS..."
                                    value={data.metode_pembayaran}
                                    onChange={(e) => setData('metode_pembayaran', e.target.value)}
                                />
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Link href={arusKas.show.url(transaksi.id)}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ArusKasEdit.layout = {
    breadcrumbs: [
        { title: 'Arus Kas', href: arusKas.index.url() },
        { title: 'Detail', href: '#' },
        { title: 'Edit', href: '#' },
    ],
};
