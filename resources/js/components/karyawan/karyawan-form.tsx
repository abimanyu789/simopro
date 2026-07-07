import { Link } from '@inertiajs/react';
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
import type { KaryawanFormData } from '@/types';

interface KaryawanFormProps {
    data: KaryawanFormData;
    setData: (key: keyof KaryawanFormData, value: string) => void;
    errors: Partial<Record<keyof KaryawanFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    cancelHref: string;
    submitLabel?: string;
    mode: 'create' | 'edit';
}

export function KaryawanForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelHref,
    submitLabel,
    mode,
}: KaryawanFormProps) {
    const defaultSubmitLabel =
        mode === 'create' ? 'Simpan' : 'Simpan Perubahan';

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
        >
            <div className="space-y-6">
                {/* Nama Karyawan */}
                <div className="space-y-2">
                    <Label htmlFor="nama_karyawan">
                        Nama Karyawan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nama_karyawan"
                        type="text"
                        value={data.nama_karyawan}
                        onChange={(e) =>
                            setData('nama_karyawan', e.target.value)
                        }
                        placeholder="Contoh: Budi Santoso"
                        className={errors.nama_karyawan ? 'border-red-500' : ''}
                    />
                    {errors.nama_karyawan && (
                        <p className="text-sm text-red-500">
                            {errors.nama_karyawan}
                        </p>
                    )}
                </div>

                {/* Jabatan */}
                <div className="space-y-2">
                    <Label htmlFor="jabatan">Jabatan</Label>
                    <Input
                        id="jabatan"
                        type="text"
                        value={data.jabatan}
                        onChange={(e) => setData('jabatan', e.target.value)}
                        placeholder="Contoh: Penjahit, Tukang Sol, Finishing"
                        className={errors.jabatan ? 'border-red-500' : ''}
                    />
                    {errors.jabatan && (
                        <p className="text-sm text-red-500">{errors.jabatan}</p>
                    )}
                </div>

                {/* Nomor HP */}
                <div className="space-y-2">
                    <Label htmlFor="no_hp">Nomor HP</Label>
                    <Input
                        id="no_hp"
                        type="text"
                        value={data.no_hp}
                        onChange={(e) => setData('no_hp', e.target.value)}
                        placeholder="Contoh: 0812-3456-7890"
                        className={errors.no_hp ? 'border-red-500' : ''}
                    />
                    {errors.no_hp && (
                        <p className="text-sm text-red-500">{errors.no_hp}</p>
                    )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">
                        Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                    >
                        <SelectTrigger
                            id="status"
                            className={errors.status ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Pilih status karyawan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <p className="text-sm text-red-500">{errors.status}</p>
                    )}
                </div>

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
