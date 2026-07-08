import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import produksi from '@/routes/produksi';
import type { KebutuhanBahan, ProduksiCreateProps, ProduksiFormData } from '@/types';

export default function ProduksiCreate({
    pesananValid,
    selectedPesanan,
    kebutuhanBahan,
}: ProduksiCreateProps) {
    const { data, setData, post, processing, errors } = useForm<ProduksiFormData>({
        pesanan_id: selectedPesanan?.id ?? '',
        deadline:   '',
        catatan:    '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(produksi.store.url());
    };

    const handlePesananChange = (pesananId: string) => {
        setData('pesanan_id', Number(pesananId));
        // Reload halaman dengan pesanan_id agar backend hitung kebutuhan bahan
        router.get(
            produksi.create.url(),
            { pesanan_id: pesananId },
            { preserveState: false },
        );
    };

    const formatRupiah = (value: string | number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(value));

    const semuaCukup = kebutuhanBahan.length > 0 && kebutuhanBahan.every((b) => b.cukup);
    const adaKurang  = kebutuhanBahan.some((b) => !b.cukup);

    return (
        <>
            <Head title="Buat Produksi" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={produksi.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Produksi</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat rencana produksi dari pesanan yang tersedia
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Informasi Produksi
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Pilih Pesanan */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="pesanan_id">
                                        Pesanan <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.pesanan_id !== '' ? String(data.pesanan_id) : ''}
                                        onValueChange={handlePesananChange}
                                    >
                                        <SelectTrigger id="pesanan_id" className={errors.pesanan_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Pilih pesanan..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pesananValid.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.nomor_pesanan}
                                                    {p.customer && ` — ${p.customer.nama_customer}`}
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({formatRupiah(p.total)})
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pesanan_id && (
                                        <p className="text-sm text-destructive">{errors.pesanan_id}</p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className={errors.deadline ? 'border-destructive' : ''}
                                    />
                                    {errors.deadline && (
                                        <p className="text-sm text-destructive">{errors.deadline}</p>
                                    )}
                                </div>

                                {/* Info qty target (read-only preview) */}
                                {selectedPesanan && (
                                    <div className="space-y-2">
                                        <Label>Target Produksi</Label>
                                        <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 font-mono text-sm text-muted-foreground">
                                            {selectedPesanan.detail_pesanan?.reduce((sum, d) => sum + d.qty, 0) ?? 0} pcs
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Catatan */}
                            <div className="mt-4 space-y-2">
                                <Label htmlFor="catatan">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    placeholder="Catatan produksi (opsional)..."
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Preview Kebutuhan Bahan */}
                        {kebutuhanBahan.length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Kebutuhan Bahan Baku
                                    </h2>
                                    {semuaCukup ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle className="size-4" />
                                            Semua stok mencukupi
                                        </span>
                                    ) : adaKurang ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                                            <XCircle className="size-4" />
                                            Ada stok yang tidak mencukupi
                                        </span>
                                    ) : null}
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bahan Baku</TableHead>
                                            <TableHead>Kode</TableHead>
                                            <TableHead className="text-right">Dibutuhkan</TableHead>
                                            <TableHead className="text-right">Tersedia</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kebutuhanBahan.map((bahan: KebutuhanBahan) => (
                                            <TableRow key={bahan.id}>
                                                <TableCell className="font-medium">{bahan.nama_bahan}</TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{bahan.kode_bahan}</TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {bahan.kebutuhan.toFixed(2)} {bahan.satuan}
                                                </TableCell>
                                                <TableCell className={`text-right font-mono ${!bahan.cukup ? 'text-destructive font-semibold' : ''}`}>
                                                    {bahan.stok_tersedia.toFixed(2)} {bahan.satuan}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {bahan.cukup ? (
                                                        <CheckCircle className="mx-auto size-4 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <XCircle className="mx-auto size-4 text-destructive" />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pesanan tidak punya BOM */}
                        {selectedPesanan && kebutuhanBahan.length === 0 && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                                Produk pada pesanan ini belum memiliki BOM. Kebutuhan bahan tidak dapat dihitung.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Link href={produksi.index.url()}>
                                <Button type="button" variant="outline">Batal</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Buat Produksi'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ProduksiCreate.layout = {
    breadcrumbs: [
        { title: 'Produksi', href: produksi.index.url() },
        { title: 'Buat Produksi', href: produksi.create.url() },
    ],
};
