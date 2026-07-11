import { Link } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { BahanBakuOption, BomCategorieFormData } from '@/types';

interface BomCategorieFormProps {
    data: BomCategorieFormData;
    setData: (key: keyof BomCategorieFormData, value: string | BomCategorieFormData['details']) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    cancelHref: string;
    bahanBakus: BahanBakuOption[];
    mode: 'create' | 'edit';
}

export function BomCategorieForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelHref,
    bahanBakus,
    mode,
}: BomCategorieFormProps) {
    const addDetailRow = () => {
        setData('details', [...data.details, { bahan_baku_id: null, qty_per_pair: '' }]);
    };

    const removeDetailRow = (index: number) => {
        const updated = data.details.filter((_, i) => i !== index);
        setData('details', updated.length > 0 ? updated : [{ bahan_baku_id: null, qty_per_pair: '' }]);
    };

    const updateDetail = (index: number, field: 'bahan_baku_id' | 'qty_per_pair', value: number | null | string) => {
        const updated = data.details.map((row, i) =>
            i === index ? { ...row, [field]: value } : row,
        );
        setData('details', updated);
    };

    const usedBahanBakuIds = data.details.map((d) => d.bahan_baku_id).filter(Boolean);

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6"
        >
            {/* Informasi BOM */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                <h2 className="mb-4 text-base font-semibold">Informasi BOM</h2>
                <div className="space-y-4">
                    {/* Nama BOM */}
                    <div className="space-y-2">
                        <Label htmlFor="nama_bom">
                            Nama BOM <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nama_bom"
                            type="text"
                            value={data.nama_bom}
                            onChange={(e) => setData('nama_bom', e.target.value)}
                            placeholder="Contoh: BOM Sepatu Formal"
                            className={errors.nama_bom ? 'border-red-500' : ''}
                        />
                        {errors.nama_bom && (
                            <p className="text-sm text-red-500">{errors.nama_bom}</p>
                        )}
                    </div>

                    {/* Keterangan */}
                    <div className="space-y-2">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Input
                            id="keterangan"
                            type="text"
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Deskripsi singkat BOM (opsional)"
                            className={errors.keterangan ? 'border-red-500' : ''}
                        />
                        {errors.keterangan && (
                            <p className="text-sm text-red-500">{errors.keterangan}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Komposisi Bahan Baku — hanya tampil di mode create */}
            {mode === 'create' && (
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">Komposisi Bahan Baku</h2>
                            <p className="text-xs text-muted-foreground">
                                Minimal 1 bahan baku wajib ditambahkan
                            </p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                            {data.details.length} bahan
                        </span>
                    </div>

                    {errors.details && (
                        <p className="mb-3 text-sm text-red-500">{errors.details}</p>
                    )}

                    <div className="rounded-lg border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bahan Baku</TableHead>
                                    <TableHead className="w-40">Qty / Pasang</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.details.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-2">
                                            <SearchableCombobox
                                                items={bahanBakus
                                                    .filter(
                                                        (bb) =>
                                                            !usedBahanBakuIds.includes(bb.id) ||
                                                            bb.id === row.bahan_baku_id,
                                                    )
                                                    .map((bb) => ({
                                                        value: bb.id,
                                                        label: `${bb.nama_bahan} (${bb.satuan ?? '-'})`,
                                                    }))}
                                                value={row.bahan_baku_id ?? ''}
                                                onValueChange={(val) =>
                                                    updateDetail(index, 'bahan_baku_id', Number(val))
                                                }
                                                placeholder="Pilih bahan baku..."
                                                className={errors[`details.${index}.bahan_baku_id`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`details.${index}.bahan_baku_id`] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors[`details.${index}.bahan_baku_id`]}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={row.qty_per_pair}
                                                onChange={(e) =>
                                                    updateDetail(index, 'qty_per_pair', e.target.value)
                                                }
                                                placeholder="0"
                                                className={
                                                    errors[`details.${index}.qty_per_pair`]
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                            />
                                            {errors[`details.${index}.qty_per_pair`] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors[`details.${index}.qty_per_pair`]}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                                                onClick={() => removeDetailRow(index)}
                                                disabled={data.details.length <= 1}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={addDetailRow}
                        disabled={data.details.length >= bahanBakus.length}
                    >
                        <Plus className="mr-2 size-4" />
                        Tambah Bahan Baku
                    </Button>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Link href={cancelHref}>
                    <Button type="button" variant="outline">
                        Batal
                    </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    {processing
                        ? 'Menyimpan...'
                        : mode === 'create'
                          ? 'Simpan BOM'
                          : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}
