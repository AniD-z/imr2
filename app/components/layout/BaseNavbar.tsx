"use client";

// i18n
import { Link } from "@/i18n/navigation";

// ShadCn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
import { ThemeSwitcher } from "@/app/components";

// Icons
import { FileText, Plus, Home, Package } from "lucide-react";

const BaseNavbar = () => {
    return (
        <header className="lg:container z-[99]">
            <nav>
                <Card className="flex justify-between items-center px-5 gap-5">
                    <div className="flex items-center gap-1">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Home className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Button>
                        </Link>
                        <Link href="/invoices">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Invoices</span>
                            </Button>
                        </Link>
                        <Link href="/packing-lists">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Package className="h-4 w-4" />
                                <span className="hidden sm:inline">Packing Lists</span>
                            </Button>
                        </Link>
                        <Link href="/new">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">New</span>
                            </Button>
                        </Link>
                    </div>

                    <ThemeSwitcher />
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
