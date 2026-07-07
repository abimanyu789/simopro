import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { CustomerForm } from '@/components/customer/customer-form';
import customer from '@/routes/customer';
import type { CustomerCreateEditProps, CustomerFormData } from '@/types';

export default function CustomerEdit({ customer: item }: CustomerCreateEditProps) {
    const { data, setData, put, processing, errors } =
        useForm<CustomerFormData>({
            nama_customer: item?.nama_customer ?? '',
            jenis_customer: item?.jenis_customer ?? '',
            no_hp: item?.no_hp ?? '',
            alamat: item?.alamat ?? '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(customer.update.url(item!.id));
    };

    return (
        <>
            <Head title={`Edit Customer — ${item?.nama_customer}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={customer.index.url()}>
                        <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Customer
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {item?.nama_customer}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <CustomerForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        cancelHref={customer.show.url(item!.id)}
                        mode="edit"
                        submitLabel="Simpan Perubahan"
                    />
                </div>
            </div>
        </>
    );
}

CustomerEdit.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Customer',
            href: customer.index.url(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
