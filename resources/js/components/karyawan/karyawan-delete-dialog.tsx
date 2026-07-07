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
import karyawan from '@/routes/karyawan';
import type { Karyawan } from '@/types';

interface KaryawanDeleteDialogProps {
    karyawan: Karyawan;
    /** Callback setelah dialog ditutup (opsional) */
    onClose?: () => void;
    /** Custom trigger — default: tombol ikon Trash merah kecil */
    trigger?: React.ReactNode;
    /** Setelah berhasil hapus, redirect ke mana */
    redirectTo?: string;
}

export function KaryawanDeleteDialog({
    karyawan: item,
    onClose,
    trigger,
    redirectTo,
}: KaryawanDeleteDialogProps) {
    const handleDelete = () => {
        router.delete(karyawan.destroy.url(item.id), {
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
                    <DialogTitle>Hapus Karyawan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus karyawan{' '}
                        <span className="font-semibold text-foreground">
                            {item.nama_karyawan}
                        </span>
                        ?
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
