import { router, useForm } from '@inertiajs/react';
import { Download, FileDown, FileUp, MoreHorizontal, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ExportImportMenuProps {
    exportExcelUrl: string;
    exportPdfUrl: string;
    importUrl?: string;
    templateUrl?: string;
    modelName: string;
}

export function ExportImportMenu({
    exportExcelUrl,
    exportPdfUrl,
    importUrl,
    templateUrl,
    modelName,
}: ExportImportMenuProps) {
    const [importModalOpen, setImportModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const handleExportExcel = () => {
        window.location.href = exportExcelUrl;
    };

    const handleExportPdf = () => {
        window.location.href = exportPdfUrl;
    };

    const handleDownloadTemplate = () => {
        if (templateUrl) window.location.href = templateUrl;
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.file) {
            toast.error('Pilih file Excel terlebih dahulu.');
            return;
        }

        if (!importUrl) return;

        post(importUrl, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Data ${modelName} berhasil diimport.`);
                setImportModalOpen(false);
                reset();
            },
            onError: (errs) => {
                const untypedErrors = errs as Record<string, string>;
                if (untypedErrors.error) {
                    toast.error(untypedErrors.error);
                } else if (untypedErrors.file) {
                    toast.error(untypedErrors.file);
                } else {
                    toast.error('Terjadi kesalahan saat mengimport data.');
                }
            },
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1.5">
                        <Settings2 className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Opsi Data
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {templateUrl && (
                        <DropdownMenuItem onClick={handleDownloadTemplate}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Template</span>
                        </DropdownMenuItem>
                    )}
                    {importUrl && (
                        <>
                            <DropdownMenuItem onClick={() => setImportModalOpen(true)}>
                                <FileUp className="mr-2 h-4 w-4" />
                                <span>Import dari Excel</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem onClick={handleExportExcel}>
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Export ke Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPdf}>
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Export ke PDF</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {importUrl && (
                <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
                <DialogContent>
                    <form onSubmit={handleImportSubmit}>
                        <DialogHeader>
                            <DialogTitle>Import Data {modelName}</DialogTitle>
                            <DialogDescription>
                                Upload file Excel (.xlsx atau .csv) yang telah diisi sesuai template.
                                Pastikan tidak ada duplikasi kode.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="file">File Excel</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.csv"
                                    onChange={(e) =>
                                        setData('file', e.target.files?.[0] || null)
                                    }
                                />
                                {(errors as Record<string, string>).file && (
                                    <p className="text-sm text-destructive">{(errors as Record<string, string>).file}</p>
                                )}
                                {(errors as Record<string, string>).error && (
                                    <p className="text-sm text-destructive">{(errors as Record<string, string>).error}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setImportModalOpen(false);
                                    reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || !data.file}>
                                {processing ? 'Memproses...' : 'Import Data'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            )}
        </>
    );
}
