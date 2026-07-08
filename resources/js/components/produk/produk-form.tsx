import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';
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
import stokProdukJadi from '@/routes/stok-produk-jadi';
import type { BomCategoryOption, ProdukFormData } from '@/types';

interface ProdukFormProps {
    data: ProdukFormData;
    setData: (key: keyof ProdukFormData, value: string | number | null) => void;
    errors: Partial<Record<keyof ProdukFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    cancelHref: string;
    submitLabel?: string;
    mode: 'create' | 'edit';
    bomCategories?: BomCategoryOption[];
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
    bomCategories = [],
}: ProdukFormProps) {
    const defaultSubmitLabel =
        mode === 'create' ? 'Simpan' : 'Simpan Perubahan';

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
                        <p className="text-sm text-red-500">
                            {errors.kode_produk}
                        </p>
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
                        <p className="text-sm text-red-500">
                            {errors.nama_produk}
                        </p>
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
                            <p className="text-sm text-red-500">
                                {errors.ukuran}
                            </p>
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
                            <p className="text-sm text-red-500">
                                {errors.warna}
                            </p>
                        )}
                    </div>
                </div>

                {/* Harga Jual */}
                <div className="space-y-2">
                    <Label htmlFor="harga_jual">Harga Jual</Label>
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
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
                                    e.target.value
                                        ? parseFloat(e.target.value)
                                        : null,
                                )
                            }
                            placeholder="0"
                            className={`pl-9 ${errors.harga_jual ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.harga_jual && (
                        <p className="text-sm text-red-500">
                            {errors.harga_jual}
                        </p>
                    )}
                </div>

                {/* Stok & Minimum Stok — berdampingan */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Stok — hanya create, edit pakai information card */}
                    {mode === 'create' && (
                        <div className="space-y-2">
                            <Label htmlFor="stok">
                                Stok <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="stok"
                                type="number"
                                step="1"
                                min="0"
                                value={data.stok}
                                onChange={(e) =>
                                    setData(
                                        'stok',
                                        parseInt(e.target.value, 10) || 0,
                                    )
                                }
                                className={errors.stok ? 'border-red-500' : ''}
                            />
                            {errors.stok && (
                                <p className="text-sm text-red-500">
                                    {errors.stok}
                                </p>
                            )}
                        </div>
                    )}

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
                                    e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : null,
                                )
                            }
                            placeholder="Opsional"
                            className={
                                errors.minimum_stok ? 'border-red-500' : ''
                            }
                        />
                        {errors.minimum_stok && (
                            <p className="text-sm text-red-500">
                                {errors.minimum_stok}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Batas minimum stok untuk peringatan
                        </p>
                    </div>
                </div>

                {/* Information card — hanya tampil saat edit */}
                {mode === 'edit' && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <Package className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Pengelolaan stok dilakukan melalui Modul
                                        Inventory.
                                    </p>
                                    <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300">
                                        Untuk pengiriman atau melihat riwayat
                                        perubahan stok, gunakan halaman Stok
                                        Produk Jadi.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={stokProdukJadi.index.url()}
                                className="shrink-0"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                                >
                                    Lihat Stok
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
                {bomCategories.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor="bom_category_id">
                            Bill of Materials (BOM)
                        </Label>
                        <Select
                            value={data.bom_category_id?.toString() ?? ''}
                            onValueChange={(val) =>
                                setData(
                                    'bom_category_id',
                                    val ? parseInt(val, 10) : null,
                                )
                            }
                        >
                            <SelectTrigger
                                className={
                                    errors.bom_category_id
                                        ? 'border-red-500'
                                        : ''
                                }
                            >
                                <SelectValue placeholder="Pilih BOM (opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">
                                    -- Tidak menggunakan BOM --
                                </SelectItem>
                                {bomCategories.map((bom) => (
                                    <SelectItem
                                        key={bom.id}
                                        value={bom.id.toString()}
                                    >
                                        {bom.nama_bom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.bom_category_id && (
                            <p className="text-sm text-red-500">
                                {errors.bom_category_id}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            BOM menentukan komposisi bahan baku yang dibutuhkan
                            saat produksi
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Link href={cancelHref}>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        {processing
                            ? 'Menyimpan...'
                            : (submitLabel ?? defaultSubmitLabel)}
                    </Button>
                </div>
            </div>
        </form>
    );
}
