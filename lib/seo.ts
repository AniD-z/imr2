import { BASE_URL } from "@/lib/variables";

export const ROOTKEYWORDS = [
    "invoice",
    "invoice management",
    "business invoice",
];

export const JSONLD = {
    "@context": "https://schema.org",
    "@type": "Website",
    name: "Invoice",
    description: "Invoice Management System",
    keywords: ROOTKEYWORDS,
    url: BASE_URL,
    image: "",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#website`,
    },
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            url: `${BASE_URL}`,
        },
    ],
};
