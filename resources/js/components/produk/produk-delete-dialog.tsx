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
import produk from '@/routes/produk';
import type { Produk } from '@/types';

interface ProdukDeleteDialogProps {
    produk: Produk;
    /** Callback setelah dialog ditutup (opsional) */
    onClose?: () => void;
    /** Custom trigger — default: tombol ikon Trash merah kecil */
    trigger?: React.ReactNode;
    /** Setelah berhasil hapus, redirect ke mana */
    redirectTo?: string;
}

export function ProdukDeleteDialog({
    produk: item,
    onClose,
    trigger,
    redirectTo,
}: ProdukDeleteDialogProps) {
    const handleDelete = () => {
        router.delete(produk.destroy.url(item.id), {
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
                    <DialogTitle>Hapus Produk</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus produk{' '}
                        <span className="font-semibold text-foreground">
                            {item.nama_produk}
                        </span>{' '}
                        ({item.kode_produk})?
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
