import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    placeholder: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    allLabel?: string;
    allValue?: string;
}

interface DataTableToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    searchPlaceholder?: string;
    filters?: FilterConfig[];
}

export function DataTableToolbar({
    search,
    onSearchChange,
    onSearchSubmit,
    searchPlaceholder = 'Cari...',
    filters = [],
}: DataTableToolbarProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <form onSubmit={onSearchSubmit} className="flex gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Filter Selects */}
                {filters.map((filter, index) => (
                    <Select
                        key={index}
                        value={filter.value || (filter.allValue ?? 'semua')}
                        onValueChange={(val) => {
                            const emptyVal = filter.allValue ?? 'semua';
                            filter.onChange(val === emptyVal ? '' : val);
                        }}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={filter.allValue ?? 'semua'}>
                                {filter.allLabel ?? filter.placeholder}
                            </SelectItem>
                            {filter.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {/* Submit Button */}
                <Button type="submit" variant="secondary">
                    Cari
                </Button>
            </form>
        </div>
    );
}
