import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
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
import bomDetail from '@/routes/bom-detail';
import type { BomDetail } from '@/types';

interface BomDetailDeleteDialogProps {
    detail: BomDetail;
    trigger?: React.ReactNode;
}

export function BomDetailDeleteDialog({ detail, trigger }: BomDetailDeleteDialogProps) {
    const handleDelete = () => {
        router.delete(bomDetail.destroy.url(detail.id), {
            preserveScroll: true,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Bahan Baku dari BOM</DialogTitle>
                    <DialogDescription>
                        Hapus{' '}
                        <span className="font-semibold text-foreground">
                            {detail.bahan_baku?.nama_bahan ?? `Bahan #${detail.bahan_baku_id}`}
                        </span>{' '}
                        dari komposisi BOM ini?
                        <br />
                        <br />
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 size-4" />
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
