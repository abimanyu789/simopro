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
import { Textarea } from '@/components/ui/textarea';
import type { CustomerFormData } from '@/types';

interface CustomerFormProps {
    data: CustomerFormData;
    setData: (key: keyof CustomerFormData, value: string) => void;
    errors: Partial<Record<keyof CustomerFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    cancelHref: string;
    submitLabel?: string;
    mode: 'create' | 'edit';
}

export function CustomerForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelHref,
    submitLabel,
    mode,
}: CustomerFormProps) {
    const defaultSubmitLabel =
        mode === 'create' ? 'Simpan' : 'Simpan Perubahan';

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border"
        >
            <div className="space-y-6">
                {/* Nama Customer */}
                <div className="space-y-2">
                    <Label htmlFor="nama_customer">
                        Nama Customer <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nama_customer"
                        type="text"
                        value={data.nama_customer}
                        onChange={(e) =>
                            setData('nama_customer', e.target.value)
                        }
                        placeholder="Contoh: PT. Maju Bersama atau Budi Santoso"
                        className={errors.nama_customer ? 'border-red-500' : ''}
                    />
                    {errors.nama_customer && (
                        <p className="text-sm text-red-500">
                            {errors.nama_customer}
                        </p>
                    )}
                </div>

                {/* Jenis Customer */}
                <div className="space-y-2">
                    <Label htmlFor="jenis_customer">
                        Jenis Customer <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.jenis_customer}
                        onValueChange={(value) =>
                            setData('jenis_customer', value)
                        }
                    >
                        <SelectTrigger
                            className={
                                errors.jenis_customer ? 'border-red-500' : ''
                            }
                        >
                            <SelectValue placeholder="Pilih jenis customer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="b2b">
                                B2B — Business to Business
                            </SelectItem>
                            <SelectItem value="b2c">
                                B2C — Business to Consumer
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.jenis_customer && (
                        <p className="text-sm text-red-500">
                            {errors.jenis_customer}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        B2B: pelanggan berupa perusahaan/toko. B2C: pelanggan
                        perorangan.
                    </p>
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
                    <p className="text-xs text-muted-foreground">
                        Opsional. Nomor HP harus unik untuk setiap customer.
                    </p>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Textarea
                        id="alamat"
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        placeholder="Masukkan alamat lengkap customer (opsional)"
                        rows={3}
                        className={errors.alamat ? 'border-red-500' : ''}
                    />
                    {errors.alamat && (
                        <p className="text-sm text-red-500">{errors.alamat}</p>
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
