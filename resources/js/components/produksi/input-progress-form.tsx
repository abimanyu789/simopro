import { useForm } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
import produksi from '@/routes/produksi';
import type {
    InputProgressFormData,
    Produksi,
    ProdukBelumSelesai,
} from '@/types';

interface InputProgressFormProps {
    produksi: Produksi;
    produkBelumSelesai: ProdukBelumSelesai[];
}

export function InputProgressForm({
    produksi: item,
    produkBelumSelesai,
}: InputProgressFormProps) {
    const { data, setData, patch, processing, errors, reset } =
        useForm<InputProgressFormData>({
            produk_id: '',
            qty: '',
            qc_status: 'lolos',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(produksi.progress.url(item.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const selectedProduk = produkBelumSelesai.find(
        (p) => p.id === Number(data.produk_id),
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pilih Produk */}
            <div className="space-y-1.5">
                <Label htmlFor="produk_id">
                    Produk <span className="text-destructive">*</span>
                </Label>
                {produkBelumSelesai.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Semua produk sudah mencapai target.
                    </p>
                ) : (
                    <>
                        <SearchableCombobox
                            items={produkBelumSelesai.map((p) => ({
                                value: p.id,
                                label: `${p.kode_produk} — ${p.nama_produk} (sisa: ${p.sisa} pcs)`,
                            }))}
                            value={data.produk_id !== '' ? Number(data.produk_id) : ''}
                            onValueChange={(v) => setData('produk_id', Number(v))}
                            placeholder="Pilih produk..."
                            className={errors.produk_id ? 'border-destructive' : ''}
                        />
                        {errors.produk_id && (
                            <p className="text-sm text-destructive">
                                {errors.produk_id}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Info sisa target */}
            {selectedProduk && (
                <div className="rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Lolos QC</span>
                        <span className="font-medium">
                            {selectedProduk.qty_lolos} /{' '}
                            {selectedProduk.qty_target} pcs
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Sisa target
                        </span>
                        <span className="font-medium text-primary">
                            {selectedProduk.sisa} pcs
                        </span>
                    </div>
                </div>
            )}

            {/* Qty */}
            <div className="space-y-1.5">
                <Label htmlFor="qty">
                    Jumlah Progress (pcs){' '}
                    <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="qty"
                    type="number"
                    min="1"
                    max={selectedProduk?.sisa}
                    placeholder={
                        selectedProduk
                            ? `Maks: ${selectedProduk.sisa} pcs`
                            : '0'
                    }
                    value={data.qty}
                    onChange={(e) =>
                        setData(
                            'qty',
                            e.target.value === '' ? '' : Number(e.target.value),
                        )
                    }
                    className={errors.qty ? 'border-destructive' : ''}
                />
                {errors.qty && (
                    <p className="text-sm text-destructive">{errors.qty}</p>
                )}
            </div>

            {/* Hasil QC */}
            <div className="space-y-1.5">
                <Label>
                    Hasil QC <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setData('qc_status', 'lolos')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            data.qc_status === 'lolos'
                                ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400'
                                : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <CheckCircle className="size-4" />
                        Lolos QC
                    </button>
                    <button
                        type="button"
                        onClick={() => setData('qc_status', 'tidak_lolos')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            data.qc_status === 'tidak_lolos'
                                ? 'border-destructive bg-destructive/10 text-destructive'
                                : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <XCircle className="size-4" />
                        Tidak Lolos
                    </button>
                </div>
                {data.qc_status === 'tidak_lolos' && (
                    <p className="text-xs text-destructive">
                        Progress tidak lolos QC tetap dicatat. Stok produk jadi
                        tidak bertambah.
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={processing || produkBelumSelesai.length === 0}
                className="w-full"
            >
                {processing ? 'Menyimpan...' : 'Catat Progress'}
            </Button>
        </form>
    );
}
