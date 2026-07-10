import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Minus, Plus, XCircle } from 'lucide-react';
import { useState } from 'react';
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
import type {
    KebutuhanBahan,
    KaryawanOption,
    ProduksiCreateProps,
    ProduksiFormData,
    ProdukOption,
} from '@/types';

export default function ProduksiCreate({
    pesananValid,
    produkList,
    karyawanList,
    selectedPesanan,
    kebutuhanBahan,
}: ProduksiCreateProps) {
    const { data, setData, post, processing, errors } =
        useForm<ProduksiFormData>({
            jenis_produksi: 'pesanan',
            pesanan_id: '',
            items: [{ produk_id: '', qty_target: '' }],
            karyawan_ids: [],
            deadline: '',
            catatan: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(produksi.store.url());
    };

    const handlePesananChange = (pesananId: string) => {
        setData('pesanan_id', Number(pesananId));
        router.get(
            produksi.create.url(),
            { pesanan_id: pesananId },
            { preserveState: false },
        );
    };

    const handleJenisProduksiChange = (jenis: string) => {
        setData('jenis_produksi', jenis as 'pesanan' | 'restok');
        setData('pesanan_id', '');
        setData('items', [{ produk_id: '', qty_target: '' }]);
    };

    const toggleKaryawan = (id: number) => {
        const current = data.karyawan_ids;
        if (current.includes(id)) {
            setData(
                'karyawan_ids',
                current.filter((k) => k !== id),
            );
        } else {
            setData('karyawan_ids', [...current, id]);
        }
    };

    const addItem = () =>
        setData('items', [...data.items, { produk_id: '', qty_target: '' }]);
    const removeItem = (idx: number) =>
        setData(
            'items',
            data.items.filter((_, i) => i !== idx),
        );

    const semuaCukup =
        kebutuhanBahan.length > 0 && kebutuhanBahan.every((b) => b.cukup);
    const adaKurang = kebutuhanBahan.some((b) => !b.cukup);

    const formatRupiah = (v: string | number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(v));

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
                        <h1 className="text-2xl font-bold tracking-tight">
                            Buat Produksi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat rencana produksi baru
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ── Step 1: Jenis Produksi ─────────────────────── */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                Jenis Produksi
                            </h2>
                            <div className="flex gap-3">
                                {(['pesanan', 'restok'] as const).map(
                                    (jenis) => (
                                        <button
                                            key={jenis}
                                            type="button"
                                            onClick={() =>
                                                handleJenisProduksiChange(jenis)
                                            }
                                            className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                                                data.jenis_produksi === jenis
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            {jenis === 'pesanan'
                                                ? 'Produksi untuk Pesanan'
                                                : 'Produksi untuk Restok'}
                                        </button>
                                    ),
                                )}
                            </div>
                            {errors.jenis_produksi && (
                                <p className="mt-2 text-sm text-destructive">
                                    {errors.jenis_produksi}
                                </p>
                            )}
                        </div>

                        {/* ── Step 2A: Pilih Pesanan ─────────────────────── */}
                        {data.jenis_produksi === 'pesanan' && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                                <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Pesanan
                                </h2>
                                <div className="space-y-2">
                                    <Label htmlFor="pesanan_id">
                                        Pesanan{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={
                                            data.pesanan_id !== ''
                                                ? String(data.pesanan_id)
                                                : ''
                                        }
                                        onValueChange={handlePesananChange}
                                    >
                                        <SelectTrigger id="pesanan_id">
                                            <SelectValue placeholder="Pilih pesanan..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pesananValid.map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={String(p.id)}
                                                >
                                                    {p.nomor_pesanan}
                                                    {p.customer &&
                                                        ` — ${p.customer.nama_customer}`}
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({formatRupiah(p.total)}
                                                        )
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pesanan_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.pesanan_id}
                                        </p>
                                    )}
                                </div>

                                {/* Info detail pesanan */}
                                {selectedPesanan && (
                                    <div className="mt-4 rounded-lg bg-muted/50 p-4">
                                        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Detail Pesanan
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            {(
                                                selectedPesanan.detail_pesanan ??
                                                []
                                            ).map((d) => (
                                                <div
                                                    key={d.id}
                                                    className="flex justify-between"
                                                >
                                                    <span>
                                                        {d.produk
                                                            ?.nama_produk ??
                                                            '-'}
                                                    </span>
                                                    <span className="font-medium">
                                                        {d.qty} pcs
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between border-t pt-1 font-semibold">
                                                <span>Total Target</span>
                                                <span>
                                                    {(
                                                        selectedPesanan.detail_pesanan ??
                                                        []
                                                    ).reduce(
                                                        (s, d) => s + d.qty,
                                                        0,
                                                    )}{' '}
                                                    pcs
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Step 2B: Produk Restok ─────────────────────── */}
                        {data.jenis_produksi === 'restok' && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                        Produk yang Diproduksi
                                    </h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItem}
                                    >
                                        <Plus className="mr-1 size-3.5" />{' '}
                                        Tambah Produk
                                    </Button>
                                </div>
                                {errors.items && (
                                    <p className="mb-2 text-sm text-destructive">
                                        {errors.items}
                                    </p>
                                )}
                                <div className="space-y-3">
                                    {data.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-[1fr_120px_40px] items-end gap-2"
                                        >
                                            <div className="space-y-1">
                                                {idx === 0 && (
                                                    <Label className="text-xs text-muted-foreground">
                                                        Produk
                                                    </Label>
                                                )}
                                                <Select
                                                    value={
                                                        item.produk_id !== ''
                                                            ? String(
                                                                  item.produk_id,
                                                              )
                                                            : ''
                                                    }
                                                    onValueChange={(v) => {
                                                        const updated =
                                                            data.items.map(
                                                                (it, i) =>
                                                                    i === idx
                                                                        ? {
                                                                              ...it,
                                                                              produk_id:
                                                                                  Number(
                                                                                      v,
                                                                                  ),
                                                                          }
                                                                        : it,
                                                            );
                                                        setData(
                                                            'items',
                                                            updated,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih produk..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {produkList.map((p) => (
                                                            <SelectItem
                                                                key={p.id}
                                                                value={String(
                                                                    p.id,
                                                                )}
                                                            >
                                                                {p.kode_produk}{' '}
                                                                —{' '}
                                                                {p.nama_produk}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                {idx === 0 && (
                                                    <Label className="text-xs text-muted-foreground">
                                                        Target (pcs)
                                                    </Label>
                                                )}
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="0"
                                                    value={item.qty_target}
                                                    onChange={(e) => {
                                                        const updated =
                                                            data.items.map(
                                                                (it, i) =>
                                                                    i === idx
                                                                        ? {
                                                                              ...it,
                                                                              qty_target:
                                                                                  Number(
                                                                                      e
                                                                                          .target
                                                                                          .value,
                                                                                  ),
                                                                          }
                                                                        : it,
                                                            );
                                                        setData(
                                                            'items',
                                                            updated,
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    idx === 0 ? 'pt-5' : ''
                                                }
                                            >
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-9 text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        removeItem(idx)
                                                    }
                                                    disabled={
                                                        data.items.length === 1
                                                    }
                                                >
                                                    <Minus className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Preview Kebutuhan Bahan ────────────────────── */}
                        {kebutuhanBahan.length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                        Kebutuhan Bahan Baku
                                    </h2>
                                    {semuaCukup ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle className="size-4" />{' '}
                                            Semua stok mencukupi
                                        </span>
                                    ) : adaKurang ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                                            <XCircle className="size-4" /> Ada
                                            stok tidak mencukupi
                                        </span>
                                    ) : null}
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bahan Baku</TableHead>
                                            <TableHead className="text-right">
                                                Dibutuhkan
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Tersedia
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kebutuhanBahan.map(
                                            (bahan: KebutuhanBahan) => (
                                                <TableRow key={bahan.id}>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {bahan.nama_bahan}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {bahan.kode_bahan}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {bahan.kebutuhan.toFixed(
                                                            2,
                                                        )}{' '}
                                                        {bahan.satuan}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-mono ${!bahan.cukup ? 'font-semibold text-destructive' : ''}`}
                                                    >
                                                        {bahan.stok_tersedia.toFixed(
                                                            2,
                                                        )}{' '}
                                                        {bahan.satuan}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {bahan.cukup ? (
                                                            <CheckCircle className="mx-auto size-4 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <XCircle className="mx-auto size-4 text-destructive" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* ── Step 3: Karyawan + Deadline + Catatan ─────── */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                Tim & Jadwal
                            </h2>
                            <div className="space-y-4">
                                {/* Karyawan */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Karyawan yang Terlibat</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const available =
                                                    karyawanList.find(
                                                        (k) =>
                                                            !data.karyawan_ids.includes(
                                                                k.id,
                                                            ),
                                                    );
                                                if (available) {
                                                    setData('karyawan_ids', [
                                                        ...data.karyawan_ids,
                                                        available.id,
                                                    ]);
                                                }
                                            }}
                                            disabled={
                                                data.karyawan_ids.length >=
                                                karyawanList.length
                                            }
                                        >
                                            <Plus className="mr-1 size-3.5" />{' '}
                                            Tambah Karyawan
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {data.karyawan_ids.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                Belum ada karyawan yang dipilih.
                                            </p>
                                        )}
                                        {data.karyawan_ids.map(
                                            (karyawanId, idx) => (
                                                <div
                                                    key={idx}
                                                    className="grid grid-cols-[1fr_40px] items-end gap-2"
                                                >
                                                    <div className="space-y-1">
                                                        {idx === 0 && (
                                                            <Label className="text-xs text-muted-foreground">
                                                                Karyawan
                                                            </Label>
                                                        )}
                                                        <Select
                                                            value={String(
                                                                karyawanId,
                                                            )}
                                                            onValueChange={(
                                                                v,
                                                            ) => {
                                                                const updated =
                                                                    data.karyawan_ids.map(
                                                                        (
                                                                            id,
                                                                            i,
                                                                        ) =>
                                                                            i ===
                                                                            idx
                                                                                ? Number(
                                                                                      v,
                                                                                  )
                                                                                : id,
                                                                    );
                                                                setData(
                                                                    'karyawan_ids',
                                                                    updated,
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih karyawan..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {karyawanList
                                                                    .filter(
                                                                        (k) =>
                                                                            !data.karyawan_ids.includes(
                                                                                k.id,
                                                                            ) ||
                                                                            k.id ===
                                                                                karyawanId,
                                                                    )
                                                                    .map(
                                                                        (k) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    k.id
                                                                                }
                                                                                value={String(
                                                                                    k.id,
                                                                                )}
                                                                            >
                                                                                {
                                                                                    k.nama_karyawan
                                                                                }
                                                                                {k.jabatan && (
                                                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                                                        (
                                                                                        {
                                                                                            k.jabatan
                                                                                        }

                                                                                        )
                                                                                    </span>
                                                                                )}
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div
                                                        className={
                                                            idx === 0
                                                                ? 'pt-5'
                                                                : ''
                                                        }
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-9 text-destructive hover:bg-destructive/10"
                                                            onClick={() =>
                                                                setData(
                                                                    'karyawan_ids',
                                                                    data.karyawan_ids.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            idx,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Minus className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {data.karyawan_ids.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {data.karyawan_ids.length} karyawan
                                            dipilih
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData('deadline', e.target.value)
                                        }
                                        className={
                                            errors.deadline
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.deadline && (
                                        <p className="text-sm text-destructive">
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>

                                {/* Catatan */}
                                <div className="space-y-2">
                                    <Label htmlFor="catatan">Catatan</Label>
                                    <Textarea
                                        id="catatan"
                                        placeholder="Catatan produksi (opsional)..."
                                        value={data.catatan}
                                        onChange={(e) =>
                                            setData('catatan', e.target.value)
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Link href={produksi.index.url()}>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
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
