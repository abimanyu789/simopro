import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { CustomerForm } from '@/components/customer/customer-form';
import customer from '@/routes/customer';
import type { CustomerFormData } from '@/types';

export default function CustomerCreate() {
    const { data, setData, post, processing, errors } =
        useForm<CustomerFormData>({
            nama_customer: '',
            jenis_customer: '',
            no_hp: '',
            alamat: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(customer.store.url());
    };

    return (
        <>
            <Head title="Tambah Customer" />

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
                            Tambah Customer
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan data customer baru
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
                        cancelHref={customer.index.url()}
                        mode="create"
                    />
                </div>
            </div>
        </>
    );
}

CustomerCreate.layout = {
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
            title: 'Tambah',
            href: customer.create.url(),
        },
    ],
};
