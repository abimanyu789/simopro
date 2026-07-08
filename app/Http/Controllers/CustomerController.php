<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search  = $request->input('search');
        $jenis   = $request->input('jenis');
        $sortBy  = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        // Whitelist kolom yang boleh di-sort
        $allowedSorts = ['nama_customer', 'jenis_customer', 'no_hp', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $customers = Customer::query()
            ->when($search, function ($query, $search) {
                $query->where('nama_customer', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('jenis_customer', 'like', "%{$search}%");
            })
            ->when($jenis && in_array($jenis, ['b2b', 'b2c']), function ($query) use ($jenis) {
                $query->where('jenis_customer', $jenis);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('customer/index', [
            'customers' => $customers,
            'filters'   => [
                'search'   => $search,
                'jenis'    => $jenis,
                'sort_by'  => $sortBy,
                'sort_dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('customer/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerRequest $request)
    {
        Customer::create($request->validated());

        return redirect()
            ->route('customer.index')
            ->with('success', 'Customer berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $customer->load([
            'pesanans' => fn ($q) => $q->orderByDesc('created_at')->limit(5),
        ]);

        return Inertia::render('customer/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('customer/edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return redirect()
            ->route('customer.index')
            ->with('success', 'Customer berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * TODO (Modul Pesanan): Uncomment blok validasi di bawah setelah
     * tabel `pesanan` dan relasi Customer::pesanans() tersedia.
     */
    public function destroy(Customer $customer)
    {
        // ── Validasi pesanan aktif (BR-07) ──────────────────────────────────
        if ($customer->pesanans()->exists()) {
            return back()->withErrors([
                'delete' => 'Customer tidak dapat dihapus karena masih memiliki pesanan.',
            ])->with('error', 'Customer tidak dapat dihapus karena masih memiliki pesanan.');
        }

        $customer->delete();

        return redirect()
            ->route('customer.index')
            ->with('success', 'Customer berhasil dihapus.');
    }
}
