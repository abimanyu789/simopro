import { useForm } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
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
import produksi from '@/routes/produksi';
import type {
    InputProgressFormData,
    KaryawanOption,
    Produksi,
    ProdukProgressOption,
} from '@/types';

interface InputProgressFormProps {
    produksi: Produksi;
    produkList: ProdukProgressOption[];
    karyawanList: KaryawanOption[];
}

export function InputProgressForm({
    produksi: item,
    produkList,
    karyawanList,
}: InputProgressFormProps) {
    const { data, setData, patch, processing, errors, reset } =
        useForm<InputProgressFormData>({
            produk_id:   '',
            karyawan_id: '',
            qty:         '',
            qc_lolos:    true,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(produksi.progress.url(item.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const sisaTarget = item.qty_target - item.qty_selesai;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Produk */}
            <div className="space-y-1.5">
                <Label htmlFor="produk_id">
                    Produk <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={data.produk_id !== '' ? String(data.produk_id) : ''}
                    onValueChange={(v) => setData('produk_id', Number(v))}
                >
                    <SelectTrigger id="produk_id" className={errors.produk_id ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pilih produk..." />
                    </SelectTrigger>
                    <SelectContent>
                        {produkList.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                                {p.kode_produk} — {p.nama_produk}
                                <span className="ml-2 text-xs text-muted-foreground">
                                    (target: {p.qty_pesanan} pcs)
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.produk_id && (
                    <p className="text-sm text-destructive">{errors.produk_id}</p>
                )}
            </div>

            {/* Karyawan */}
            <div className="space-y-1.5">
                <Label htmlFor="karyawan_id">
                    Karyawan <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={data.karyawan_id !== '' ? String(data.karyawan_id) : ''}
                    onValueChange={(v) => setData('karyawan_id', Number(v))}
                >
                    <SelectTrigger id="karyawan_id" className={errors.karyawan_id ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pilih karyawan..." />
                    </SelectTrigger>
                    <SelectContent>
                        {karyawanList.map((k) => (
                            <SelectItem key={k.id} value={String(k.id)}>
                                {k.nama_karyawan}
                                {k.jabatan && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({k.jabatan})
                                    </span>
                                )}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.karyawan_id && (
                    <p className="text-sm text-destructive">{errors.karyawan_id}</p>
                )}
            </div>

            {/* Qty */}
            <div className="space-y-1.5">
                <Label htmlFor="qty">
                    Jumlah Progress (pcs) <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="qty"
                    type="number"
                    min="1"
                    max={sisaTarget}
                    placeholder={`Maks: ${sisaTarget} pcs`}
                    value={data.qty}
                    onChange={(e) =>
                        setData('qty', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className={errors.qty ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                    Sisa target: {sisaTarget} pcs
                </p>
                {errors.qty && (
                    <p className="text-sm text-destructive">{errors.qty}</p>
                )}
            </div>

            {/* Hasil QC */}
            <div className="space-y-1.5">
                <Label>Hasil QC <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setData('qc_lolos', true)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            data.qc_lolos
                                ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400'
                                : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <CheckCircle className="size-4" />
                        Lolos QC
                    </button>
                    <button
                        type="button"
                        onClick={() => setData('qc_lolos', false)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            !data.qc_lolos
                                ? 'border-destructive bg-destructive/10 text-destructive'
                                : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <XCircle className="size-4" />
                        Tidak Lolos
                    </button>
                </div>
                {!data.qc_lolos && (
                    <p className="text-xs text-destructive">
                        Progress tidak lolos QC tidak akan disimpan. Produk harus diperbaiki (rework).
                    </p>
                )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Menyimpan...' : 'Catat Progress'}
            </Button>
        </form>
    );
}
