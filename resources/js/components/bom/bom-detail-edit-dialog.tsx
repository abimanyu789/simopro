import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import bomDetail from '@/routes/bom-detail';
import type { BomDetail, BomDetailFormData } from '@/types';

interface BomDetailEditDialogProps {
    detail: BomDetail;
    trigger?: React.ReactNode;
}

export function BomDetailEditDialog({ detail, trigger }: BomDetailEditDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm<
        Pick<BomDetailFormData, 'qty_per_pair'>
    >({
        qty_per_pair: detail.qty_per_pair,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(bomDetail.update.url(detail.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Qty Bahan Baku</DialogTitle>
                    <DialogDescription>
                        Ubah qty per pasang untuk{' '}
                        <span className="font-semibold text-foreground">
                            {detail.bahan_baku?.nama_bahan ?? `Bahan #${detail.bahan_baku_id}`}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor={`qty-${detail.id}`}>
                                Qty per Pasang <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`qty-${detail.id}`}
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.qty_per_pair}
                                    onChange={(e) => setData('qty_per_pair', e.target.value)}
                                    className={errors.qty_per_pair ? 'border-red-500' : ''}
                                />
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {detail.bahan_baku?.satuan ?? ''}
                                </span>
                            </div>
                            {errors.qty_per_pair && (
                                <p className="text-sm text-red-500">{errors.qty_per_pair}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
