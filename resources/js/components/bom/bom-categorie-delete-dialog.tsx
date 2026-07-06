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
import bomCategorie from '@/routes/bom-categorie';
import type { BomCategorie } from '@/types';

interface BomCategorieDeleteDialogProps {
    bomCategorie: BomCategorie;
    onClose?: () => void;
    trigger?: React.ReactNode;
    redirectTo?: string;
}

export function BomCategorieDeleteDialog({
    bomCategorie: item,
    onClose,
    trigger,
    redirectTo,
}: BomCategorieDeleteDialogProps) {
    const handleDelete = () => {
        router.delete(bomCategorie.destroy.url(item.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose?.();

                if (redirectTo) {
                    router.visit(redirectTo);
                }
            },
        });
    };

    return (
        <Dialog onOpenChange={(open) => !open && onClose?.()}>
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
                    <DialogTitle>Hapus BOM</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus BOM{' '}
                        <span className="font-semibold text-foreground">{item.nama_bom}</span>?
                        <br />
                        <br />
                        Seluruh komposisi bahan baku dalam BOM ini juga akan dihapus. Tindakan ini
                        tidak dapat dibatalkan.
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
