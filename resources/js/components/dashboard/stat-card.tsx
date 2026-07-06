import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    className?: string;
    iconClassName?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend = 'neutral',
    trendValue,
    className,
    iconClassName,
}: StatCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    {trendValue && (
                        <div className="flex items-center gap-1">
                            {trend === 'up' && (
                                <span className="text-xs font-medium text-green-600 dark:text-green-500">
                                    ↑ {trendValue}
                                </span>
                            )}
                            {trend === 'down' && (
                                <span className="text-xs font-medium text-red-600 dark:text-red-500">
                                    ↓ {trendValue}
                                </span>
                            )}
                            {trend === 'neutral' && (
                                <span className="text-xs font-medium text-muted-foreground">
                                    {trendValue}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'flex size-12 items-center justify-center rounded-lg',
                        iconClassName,
                    )}
                >
                    <Icon className="size-6" />
                </div>
            </div>
        </div>
    );
}
