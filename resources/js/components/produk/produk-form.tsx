import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProdukFormData } from '@/types';

interface ProdukFormProps {
    data: ProdukFormData;
    setData: (key: keyof ProdukFormData, value: string | number | null) => void;
    errors: Partial<Record<keyof ProdukFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    cancelHref: string;
    submitLabel?: string;
    mode: 'create' | 'edit';
}

export function ProdukForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelHref,
    submitLabel,
    mode,
}: ProdukFormProps) {
    const defaultSubmitLabel = mode === 'create' ? 'Simpan' : 'Simpan Perubahan';

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
        >
            <div className="space-y-6">
                {/* Kode Produk */}
                <div className="space-y-2">
                    <Label htmlFor="kode_produk">
                        Kode Produk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="kode_produk"
                        type="text"
                        value={data.kode_produk}
                        onChange={(e) => setData('kode_produk', e.target.value)}
                        placeholder="Contoh: PRD-001"
                        className={errors.kode_produk ? 'border-red-500' : ''}
                    />
                    {errors.kode_produk && (
                        <p className="text-sm text-red-500">{errors.kode_produk}</p>
                    )}
                </div>

                {/* Nama Produk */}
                <div className="space-y-2">
                    <Label htmlFor="nama_produk">
                        Nama Produk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nama_produk"
                        type="text"
                        value={data.nama_produk}
                        onChange={(e) => setData('nama_produk', e.target.value)}
                        placeholder="Contoh: Sepatu Kulit Formal Pria"
                        className={errors.nama_produk ? 'border-red-500' : ''}
                    />
                    {errors.nama_produk && (
                        <p className="text-sm text-red-500">{errors.nama_produk}</p>
                    )}
                </div>

                {/* Ukuran & Warna — berdampingan */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Ukuran */}
                    <div className="space-y-2">
                        <Label htmlFor="ukuran">Ukuran</Label>
                        <Input
                            id="ukuran"
                            type="text"
                            value={data.ukuran}
                            onChange={(e) => setData('ukuran', e.target.value)}
                            placeholder="Contoh: 40, 41, atau 39-43"
                            className={errors.ukuran ? 'border-red-500' : ''}
                        />
                        {errors.ukuran && (
                            <p className="text-sm text-red-500">{errors.ukuran}</p>
                        )}
                    </div>

                    {/* Warna */}
                    <div className="space-y-2">
                        <Label htmlFor="warna">Warna</Label>
                        <Input
                            id="warna"
                            type="text"
                            value={data.warna}
                            onChange={(e) => setData('warna', e.target.value)}
                            placeholder="Contoh: Hitam, Cokelat"
                            className={errors.warna ? 'border-red-500' : ''}
                        />
                        {errors.warna && (
                            <p className="text-sm text-red-500">{errors.warna}</p>
                        )}
                    </div>
                </div>

                {/* Harga Jual */}
                <div className="space-y-2">
                    <Label htmlFor="harga_jual">Harga Jual</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            Rp
                        </span>
                        <Input
                            id="harga_jual"
                            type="number"
                            step="1"
                            min="0"
                            value={data.harga_jual ?? ''}
                            onChange={(e) =>
                                setData(
                                    'harga_jual',
                                    e.target.value ? parseFloat(e.target.value) : null,
                                )
                            }
                            placeholder="0"
                            className={`pl-9 ${errors.harga_jual ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.harga_jual && (
                        <p className="text-sm text-red-500">{errors.harga_jual}</p>
                    )}
                </div>

                {/* Stok & Minimum Stok — berdampingan */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Stok */}
                    <div className="space-y-2">
                        <Label htmlFor="stok">
                            Stok {mode === 'create' && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="stok"
                            type="number"
                            step="1"
                            min="0"
                            value={data.stok}
                            onChange={(e) =>
                                setData('stok', parseInt(e.target.value, 10) || 0)
                            }
                            className={errors.stok ? 'border-red-500' : ''}
                        />
                        {errors.stok && (
                            <p className="text-sm text-red-500">{errors.stok}</p>
                        )}
                        {mode === 'edit' && (
                            <p className="text-xs text-muted-foreground">
                                Edit manual hanya untuk koreksi. Stok akan otomatis berubah melalui modul Produksi.
                            </p>
                        )}
                    </div>

                    {/* Minimum Stok */}
                    <div className="space-y-2">
                        <Label htmlFor="minimum_stok">Minimum Stok</Label>
                        <Input
                            id="minimum_stok"
                            type="number"
                            step="1"
                            min="0"
                            value={data.minimum_stok ?? ''}
                            onChange={(e) =>
                                setData(
                                    'minimum_stok',
                                    e.target.value ? parseInt(e.target.value, 10) : null,
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
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Link href={cancelHref}>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : (submitLabel ?? defaultSubmitLabel)}
                    </Button>
                </div>
            </div>
        </form>
    );
}
