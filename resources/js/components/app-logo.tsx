export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white text-sidebar-primary-foreground overflow-hidden">
                <img src="/LogoProvillo.jpg" alt="Logo" className="size-full object-cover" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SIMOPRO
                </span>
            </div>
        </>
    );
}
