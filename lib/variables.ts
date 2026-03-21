// Types
import { SignatureColor, SignatureFont } from "@/types";

/**
 * Environment
 */
export const ENV = process.env.NODE_ENV;

/**
 * Websites
 */
export const BASE_URL = "";
export const AUTHOR_WEBSITE = "https://aliabb.vercel.app";
export const AUTHOR_GITHUB = "https://github.com/al1abb";

/**
 * API endpoints
 */
export const GENERATE_PDF_API = "/api/invoice/generate";
export const SEND_PDF_API = "/api/invoice/send";
export const EXPORT_INVOICE_API = "/api/invoice/export";

/**
 * External API endpoints
 */
export const CURRENCIES_API =
  "https://openexchangerates.org/api/currencies.json";

/**
 * Local storage
 */
export const LOCAL_STORAGE_INVOICE_DRAFT_KEY = "invoice:draft";

/**
 * Tailwind
 */
export const TAILWIND_CDN =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/**
 * Google
 */
export const GOOGLE_SC_VERIFICATION = process.env.GOOGLE_SC_VERIFICATION;

/**
 * Nodemailer
 */
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PW = process.env.NODEMAILER_PW;

/**
 * I18N
 */
export const LOCALES = [
  { code: "en", name: "English" },
];
export const DEFAULT_LOCALE = LOCALES[0].code;

/**
 * Signature variables
 */
export const SIGNATURE_COLORS: SignatureColor[] = [
  { name: "black", label: "Black", color: "rgb(0, 0, 0)" },
  { name: "dark blue", label: "Dark Blue", color: "rgb(0, 0, 128)" },
  {
    name: "crimson",
    label: "Crimson",
    color: "#DC143C",
  },
];

export const SIGNATURE_FONTS: SignatureFont[] = [
  {
    name: "Dancing Script",
    variable: "var(--font-dancing-script)",
  },
  { name: "Parisienne", variable: "var(--font-parisienne)" },
  {
    name: "Great Vibes",
    variable: "var(--font-great-vibes)",
  },
  {
    name: "Alex Brush",
    variable: "var(--font-alex-brush)",
  },
];

/**
 * Form date options
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Form defaults
 */
export const FORM_DEFAULT_VALUES = {
  sender: {
    name: "M/s. IMR Engineering Services (OPC) Private Limited",
    address: "H.No15-11-28/204, VDOS Colony",
    zipCode: "507001",
    city: "Khammam",
    country: "Telangana - INDIA",
    email: "",
    phone: "",
    gst: "36AAGCI8227A1ZS",
    adCode: "6360846-9030761",
    customInputs: [],
  },
  receiver: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    email: "",
    phone: "",
    customInputs: [],
  },
  details: {
    invoiceLogo: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    items: [
      {
        name: "",
        description: "",
        hsnCode: "",
        quantity: 0,
        units: "",
        unitPrice: 0,
        total: 0,
      },
    ],
    currency: "INR",
    language: "English",
    taxDetails: {
      amount: 0,
      amountType: "amount",
      taxID: "",
    },
    discountDetails: {
      amount: 0,
      amountType: "amount",
    },
    shippingDetails: {
      cost: 0,
      costType: "amount" as const,
    },
    paymentInformation: {
      bankName: "AXIS BANK LTD",
      accountName: "IMR ENGINEERING SERVICES (OPC) PVT LTD",
      accountNumber: "925020023971253",
      ifscCode: "UTIB0000273",
      branch: "KHAMMAM TOWN, KHAMMAM, TELANGANA, INDIA",
      swiftCode: "AXISINBB292",
      adCode: "6360846-9030761",
    },
    signatoryDetails: {
      name: "",
      designation: "",
      department: "",
      phone: "",
      companyStamp: "",
    },
    additionalNotes: "",
    paymentTerms: "",
    totalAmountInWords: "",
    pdfTemplate: 3,
  },
};

/**
 * ? DEV Only
 * Form auto fill values for testing
 */
export const FORM_FILL_VALUES = {
  sender: {
    name: "John Doe",
    address: "123 Main St",
    zipCode: "12345",
    city: "Anytown",
    country: "USA",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    gst: "GST123456",
    adCode: "AD123456",
  },
  receiver: {
    name: "Jane Smith",
    address: "456 Elm St",
    zipCode: "54321",
    city: "Other Town",
    country: "Canada",
    email: "janesmith@example.com",
    phone: "987-654-3210",
  },
  consignee: {
    name: "ABC Corporation",
    address: "789 Business Ave",
    zipCode: "67890",
    city: "Metro City",
    country: "USA",
    email: "abc@example.com",
    phone: "555-123-4567",
  },
  details: {
    invoiceLogo: "",
    invoiceNumber: "INV0001",
    invoiceDate: new Date(),
    dueDate: new Date(),
    purchaseOrderNumber: "PO-2025-001",
    modeOfPayment: "Wire Transfer",
    referenceNumbers: "REF:2025/001\\nDATED: 2025-01-15",
    otherReferences: "Contract #2025-ABC",
    dispatchDocNumber: "DISP-2025-001",
    deliveryNoteDate: "2025-01-20",
    dispatchedThrough: "By Sea",
    finalDestination: "Metro City, USA",
    vesselFlightNo: "VESSEL-001",
    portOfLoading: "New York, USA",
    placeOfReceipt: "New York Port",
    portOfDischarge: "Vancouver, Canada",
    consigneeCountry: "USA",
    termsOfDelivery: "FOB - Free On Board",
    countryOfOrigin: "USA",
    countryOfDestination: "Canada",
    items: [
      {
        name: "Product 1",
        description: "Description of Product 1",
        hsnCode: "1234",
        quantity: 4,
        units: "PCS",
        unitPrice: 50,
        total: 200,
      },
      {
        name: "Product 2",
        description: "Description of Product 2",
        hsnCode: "5678",
        quantity: 5,
        units: "PCS",
        unitPrice: 50,
        total: 250,
      },
      {
        name: "Product 3",
        description: "Description of Product 3",
        hsnCode: "9012",
        quantity: 5,
        units: "PCS",
        unitPrice: 80,
        total: 400,
      },
    ],
    currency: "USD",
    language: "English",
    taxDetails: {
      amount: 15,
      amountType: "percentage",
      taxID: "987654321",
    },
    discountDetails: {
      amount: 5,
      amountType: "percentage",
    },
    shippingDetails: {
      cost: 5,
      costType: "percentage",
    },
    paymentInformation: {
      bankName: "Bank Inc.",
      accountName: "John Doe",
      accountNumber: "445566998877",
      ifscCode: "BANK0001",
      branch: "Main Branch, Anytown",
      swiftCode: "SWIFT123",
      adCode: "AD123456",
    },
    additionalNotes: "Thank you for your business",
    paymentTerms: "Net 30",
    signature: {
      data: "",
    },
    signatoryDetails: {
      name: "N. Rajender",
      designation: "Head Section",
      department: "Supply & Procurement",
      phone: "+919095959743",
      companyStamp: "",
    },
    subTotal: "850",
    totalAmount: "850",
    totalAmountInWords: "Eight Hundred Fifty",
    pdfTemplate: 3,
  },
};

// ========================================
// PACKING LIST DEFAULT VALUES
// ========================================

export const PACKING_LIST_DEFAULT_VALUES = {
  exporter: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    country: "INDIA",
    email: "",
    phone: "",
    gst: "",
    adCode: "",
  },
  consignee: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    email: "",
    phone: "",
  },
  buyer: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    email: "",
    phone: "",
  },
  details: {
    packingListNumber: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
    buyerOrderNumber: "",
    referenceNumber: "",
    items: [
      {
        boxNo: "",
        description: "",
        hsnCode: "",
        quantity: 1,
        netWeight: 0,
        grossWeight: 0,
      },
    ],
    totalNetWeight: 0,
    totalGrossWeight: 0,
    signatoryDetails: {
      name: "",
      designation: "",
      department: "",
      phone: "",
      companyStamp: "",
    },
  },
};

export const PACKING_LIST_FILL_VALUES = {
  exporter: {
    name: "IMR ENGINEERING SERVICES (OPC) Private Limited",
    address: "H.No15-11-28/204 VDOS Colony",
    zipCode: "507001",
    city: "Khammam",
    country: "INDIA",
    email: "info@imrengineering.com",
    phone: "+91-1234567890",
    gst: "36AAGCI8227A1ZS",
    adCode: "6360846-9030761",
  },
  consignee: {
    name: "Ministry of Energy & Oil",
    address: "Sudanese Thermal Power Generating Company LTD, House No.12",
    zipCode: "",
    city: "Sea clearance office_ Port Sudan, Sudan",
    country: "SUDAN",
    email: "",
    phone: "",
  },
  buyer: {
    name: "Ministry of Energy & Oil",
    address: "Sudanese Thermal Power Generating Company LTD, House No.12",
    zipCode: "",
    city: "Sea clearance office_ Port Sudan, Sudan",
    country: "SUDAN",
    email: "",
    phone: "",
  },
  details: {
    packingListNumber: "PL-001/2025",
    date: "2025-12-23",
    invoiceNumber: "IMR/SDN25-26/053",
    buyerOrderNumber: "PO-2025-HQ02317",
    referenceNumber: "FPNO:2025/PO-HQ02367",
    items: [
      {
        boxNo: "1",
        description: "BUFFER FLY VALVES 200 MM",
        hsnCode: "84812900",
        quantity: 2,
        netWeight: 43.00,
        grossWeight: 50.00,
      },
      {
        boxNo: "2",
        description: "BUFFER FLY VALVES 200 MM",
        hsnCode: "84812900",
        quantity: 2,
        netWeight: 43.00,
        grossWeight: 50.00,
      },
    ],
    totalNetWeight: 86.00,
    totalGrossWeight: 100.00,
    signatoryDetails: {
      name: "",
      designation: "",
      department: "",
      phone: "",
      companyStamp: "",
    },
  },
};
