import { ReactNode } from "react";

// Types
import { InvoiceType, PackingListType } from "@/types";

type InvoiceLayoutProps = {
    data: InvoiceType | PackingListType;
    children: ReactNode;
};

export default function InvoiceLayout({ data, children }: InvoiceLayoutProps) {
    // Type guard to check if data is InvoiceType
    const isInvoice = 'sender' in data;
    
    // For invoice signature font, handle conditionally
    const fontHref = isInvoice && data.details.signature?.fontFamily
        ? `https://fonts.googleapis.com/css2?family=${data.details.signature?.fontFamily}&display=swap`
        : "";

    const head = (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            ></link>
            {isInvoice && data.details.signature?.fontFamily && (
                <>
                    <link href={fontHref} rel="stylesheet" />
                </>
            )}
            <style>{`
                @page {
                    size: A4;
                    margin: 0;
                }
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .page-break-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .page-break-after {
                        page-break-after: always;
                        break-after: always;
                    }
                    .page-break-auto {
                        page-break-inside: auto;
                        break-inside: auto;
                    }
                    .item-row {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
        </>
    );

    return (
        <>
            {head}
            <section style={{ fontFamily: "Outfit, sans-serif" }}>
                <div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-[60rem]">
                    {children}
                </div>
            </section>
        </>
    );
}
