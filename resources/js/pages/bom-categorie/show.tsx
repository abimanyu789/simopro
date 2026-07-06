import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Layers, Package, Pencil } from 'lucide-react';
import { BomCategorieDeleteDialog } from '@/components/bom/bom-categorie-delete-dialog';
import { BomDetailDeleteDialog } from '@/components/bom/bom-detail-delete-dialog';
import { BomDetailEditDialog } from '@/components/bom/bom-detail-edit-dialog';
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
import bomCategorie from '@/routes/bom-categorie';
import bomDetail from '@/routes/bom-detail';
import type { BomCategorieShowProps, BomDetailFormData } from '@/types';

export default function BomCategorieShow({ bomCategorie: item, bahanBakus }: BomCategorieShowProps) {
    const usedBahanBakuIds = item.bom_details.map((d) => d.bahan_baku_id);

    const availableBahanBakus = bahanBakus.filter((bb) => !usedBahanBakuIds.includes(bb.id));

    const { data, setData, post, processing, errors, reset } = useForm<BomDetailFormData>({
        bahan_baku_id: null,
        qty_per_pair: '',
    });

    const handleAddDetail = (e: React.FormEvent) => {
        e.preventDefault();
        post(bomDetail.store.url({ bom_categorie: item.id }), {
            onSuccess: () => reset(),
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title={`Detail BOM - ${item.nama_bom}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={bomCategorie.index()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail BOM
                            </h1>
                            <p className="text-sm text-muted-foreground">{item.nama_bom}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={bomCategorie.edit(item.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                        <BomCategorieDeleteDialog
                            bomCategorie={item}
                            redirectTo={bomCategorie.index.url()}
                            trigger={
                                <Button variant="destructive">
                                    Hapus
                                </Button>
                            }
                        />
                    </div>
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Stat Cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                                <Layers className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Bahan Baku</p>
                                <p className="text-2xl font-bold">{item.bom_details.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                                <Package className="size-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Dibuat Pada</p>
                                <p className="font-semibold">{formatDate(item.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi BOM */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">Informasi BOM</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama BOM</p>
                                <p className="mt-1 font-medium">{item.nama_bom}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Keterangan
                                </p>
                                <p className="mt-1 text-sm">
                                    {item.keterangan ?? (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Komposisi Bahan Baku */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Komposisi Bahan Baku
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({item.bom_details.length} bahan)
                            </span>
                        </h2>

                        {item.bom_details.length === 0 ? (
                            <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                                <p className="text-sm text-muted-foreground">
                                    Belum ada bahan baku. Tambahkan di bawah.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">No</TableHead>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Nama Bahan</TableHead>
                                            <TableHead>Satuan</TableHead>
                                            <TableHead className="text-right">Qty / Pasang</TableHead>
                                            <TableHead className="w-24 text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {item.bom_details.map((detail, index) => (
                                            <TableRow key={detail.id}>
                                                <TableCell className="text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {detail.bahan_baku?.kode_bahan ?? '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {detail.bahan_baku?.nama_bahan ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                                        {detail.bahan_baku?.satuan ?? '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {parseFloat(detail.qty_per_pair.toString()).toLocaleString('id-ID', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <BomDetailEditDialog detail={detail} />
                                                        <BomDetailDeleteDialog detail={detail} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Form Tambah Bahan Baku */}
                        {availableBahanBakus.length > 0 && (
                            <form
                                onSubmit={handleAddDetail}
                                className="mt-4 rounded-lg border border-dashed border-border p-4"
                            >
                                <p className="mb-3 text-sm font-medium">Tambah Bahan Baku</p>
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1">
                                        <Label className="sr-only">Bahan Baku</Label>
                                        <Select
                                            value={data.bahan_baku_id?.toString() ?? ''}
                                            onValueChange={(val) =>
                                                setData('bahan_baku_id', parseInt(val, 10))
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.bahan_baku_id ? 'border-red-500' : ''
                                                }
                                            >
                                                <SelectValue placeholder="Pilih bahan baku..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableBahanBakus.map((bb) => (
                                                    <SelectItem
                                                        key={bb.id}
                                                        value={bb.id.toString()}
                                                    >
                                                        {bb.nama_bahan}{' '}
                                                        <span className="text-muted-foreground">
                                                            ({bb.satuan ?? '-'})
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.bahan_baku_id && (
                                            <p className="text-xs text-red-500">
                                                {errors.bahan_baku_id}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-36 space-y-1">
                                        <Label className="sr-only">Qty per Pasang</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={data.qty_per_pair}
                                            onChange={(e) =>
                                                setData('qty_per_pair', e.target.value)
                                            }
                                            placeholder="Qty"
                                            className={
                                                errors.qty_per_pair ? 'border-red-500' : ''
                                            }
                                        />
                                        {errors.qty_per_pair && (
                                            <p className="text-xs text-red-500">
                                                {errors.qty_per_pair}
                                            </p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        Tambah
                                    </Button>
                                </div>
                            </form>
                        )}

                        {availableBahanBakus.length === 0 && item.bom_details.length > 0 && (
                            <p className="mt-3 text-center text-sm text-muted-foreground">
                                Semua bahan baku sudah ditambahkan ke BOM ini.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

BomCategorieShow.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Bill of Materials', href: bomCategorie.index() },
        { title: 'Detail', href: '#' },
    ],
};
