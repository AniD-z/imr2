"use client";

import { useMemo } from "react";

// Next
import Image from "next/image";

// i18n
import { Link } from "@/i18n/navigation";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

// Icons
import { FileText, Plus } from "lucide-react";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <header className="lg:container z-[99]">
            <nav>
                <Card className="flex flex-wrap justify-between items-center px-5 gap-5">
                    <Link href={"/"}>
                        <Image
                            src={Logo}
                            alt="Invoify Logo"
                            width={190}
                            height={100}
                            loading="eager"
                            style={{ height: "auto" }}
                        />
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link href="/invoices">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Invoices</span>
                            </Button>
                        </Link>
                        <Link href="/new">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">New</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* ? DEV Only */}
                        {devEnv && <DevDebug />}
                        <LanguageSelector />
                        <ThemeSwitcher />
                    </div>
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
