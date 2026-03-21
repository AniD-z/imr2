import { z } from "zod";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// TODO: Refactor some of the validators. Ex: name and zipCode or address and country have same rules
// Field Validators
const fieldValidators = {
    name: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(200, { message: "Must be at most 200 characters" }),
    nameOptional: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(200, { message: "Must be at most 200 characters" })
        .optional(),
    address: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(70, { message: "Must be between 2 and 70 characters" }),
    addressOptional: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(70, { message: "Must be between 2 and 70 characters" })
        .optional(),
    zipCode: z
        .string()
        .min(2, { message: "Must be between 2 and 20 characters" })
        .max(20, { message: "Must be between 2 and 20 characters" }),
    zipCodeOptional: z
        .string()
        .min(2, { message: "Must be between 2 and 20 characters" })
        .max(20, { message: "Must be between 2 and 20 characters" })
        .optional(),
    city: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, { message: "Must be between 1 and 50 characters" }),
    cityOptional: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, { message: "Must be between 1 and 50 characters" })
        .optional(),
    country: z
        .string()
        .min(1, { message: "Must be between 1 and 70 characters" })
        .max(70, { message: "Must be between 1 and 70 characters" }),
    countryOptional: z
        .string()
        .min(1, { message: "Must be between 1 and 70 characters" })
        .max(70, { message: "Must be between 1 and 70 characters" })
        .optional(),
    email: z
        .string()
        .email({ message: "Email must be a valid email" })
        .min(5, { message: "Must be between 5 and 30 characters" })
        .max(30, { message: "Must be between 5 and 30 characters" }),
    emailOptional: z
        .string()
        .email({ message: "Email must be a valid email" })
        .min(5, { message: "Must be between 5 and 30 characters" })
        .max(30, { message: "Must be between 5 and 30 characters" })
        .optional(),
    phone: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, {
            message: "Must be between 1 and 50 characters",
        }),
    phoneOptional: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, {
            message: "Must be between 1 and 50 characters",
        })
        .optional(),

    // Dates
    date: z
        .date()
        .transform((date) =>
            new Date(date).toLocaleDateString("en-US", DATE_OPTIONS)
        ),

    // Items
    quantity: z.coerce
        .number()
        .gt(0, { message: "Must be a number greater than 0" }),
    unitPrice: z.coerce
        .number()
        .gt(0, { message: "Must be a number greater than 0" })
        .lte(Number.MAX_SAFE_INTEGER, { message: `Must be ≤ ${Number.MAX_SAFE_INTEGER}` }),

    // Strings
    string: z.string(),
    stringMin1: z.string().min(1, { message: "Must be at least 1 character" }),
    stringToNumber: z.coerce.number(),

    // Charges
    stringToNumberWithMax: z.coerce.number().max(1000000),

    stringOptional: z.string().optional(),

    nonNegativeNumber: z.coerce.number().nonnegative({
        message: "Must be a positive number",
    }),
    // ! This is unused
    numWithCommas: z.coerce
        .number()
        .nonnegative({
            message: "Must be a positive number",
        })
        .transform((value) => {
            return formatNumberWithCommas(value);
        }),
};

const CustomInputSchema = z.object({
    key: z.string(),
    value: z.string(),
});

const InvoiceSenderSchema = z.object({
    name: fieldValidators.name,
    address: fieldValidators.addressOptional,
    zipCode: fieldValidators.zipCodeOptional,
    city: fieldValidators.cityOptional,
    country: fieldValidators.countryOptional,
    email: fieldValidators.emailOptional,
    phone: fieldValidators.phoneOptional,
    gst: fieldValidators.stringOptional,
    adCode: fieldValidators.stringOptional,
    customInputs: z.array(CustomInputSchema).optional(),
});

const InvoiceReceiverSchema = z.object({
    name: fieldValidators.name,
    address: fieldValidators.addressOptional,
    zipCode: fieldValidators.zipCodeOptional,
    city: fieldValidators.cityOptional,
    country: fieldValidators.countryOptional,
    email: fieldValidators.emailOptional,
    phone: fieldValidators.phoneOptional,
    customInputs: z.array(CustomInputSchema).optional(),
});

const InvoiceConsigneeSchema = z.object({
    name: fieldValidators.nameOptional,
    address: fieldValidators.addressOptional,
    zipCode: fieldValidators.zipCodeOptional,
    city: fieldValidators.cityOptional,
    country: fieldValidators.countryOptional,
    email: fieldValidators.emailOptional,
    phone: fieldValidators.phoneOptional,
}).optional();

const ItemSchema = z.object({
    name: fieldValidators.stringMin1,
    description: fieldValidators.stringOptional,
    hsnCode: fieldValidators.stringOptional,
    quantity: fieldValidators.quantity,
    units: fieldValidators.stringOptional,
    unitPrice: fieldValidators.unitPrice,
    total: fieldValidators.stringToNumber,
});

const PaymentInformationSchema = z.object({
    bankName: fieldValidators.stringMin1,
    accountName: fieldValidators.stringMin1,
    accountNumber: fieldValidators.stringMin1,
    ifscCode: fieldValidators.stringOptional,
    branch: fieldValidators.stringOptional,
    swiftCode: fieldValidators.stringOptional,
    adCode: fieldValidators.stringOptional,
});

const DiscountDetailsSchema = z.object({
    amount: fieldValidators.stringToNumberWithMax,
    amountType: fieldValidators.string,
});

const TaxDetailsSchema = z.object({
    amount: fieldValidators.stringToNumberWithMax,
    taxID: fieldValidators.string,
    amountType: fieldValidators.string,
});

const ShippingDetailsSchema = z.object({
    cost: fieldValidators.stringToNumberWithMax,
    costType: z.literal("amount"),
});

const SignatureSchema = z.object({
    data: fieldValidators.string,
    fontFamily: fieldValidators.string.optional(),
});

const SignatoryDetailsSchema = z.object({
    name: fieldValidators.stringOptional,
    designation: fieldValidators.stringOptional,
    department: fieldValidators.stringOptional,
    phone: fieldValidators.stringOptional,
    companyStamp: fieldValidators.stringOptional, // URL or base64 for company stamp
});

const InvoiceDetailsSchema = z.object({
    invoiceLogo: fieldValidators.stringOptional,
    invoiceNumber: fieldValidators.stringMin1,
    invoiceDate: fieldValidators.date,
    dueDate: fieldValidators.date,
    purchaseOrderNumber: fieldValidators.stringOptional,
    modeOfPayment: fieldValidators.stringOptional,
    referenceNumbers: fieldValidators.stringOptional, // For multiple reference numbers with dates
    otherReferences: fieldValidators.stringOptional,
    dispatchDocNumber: fieldValidators.stringOptional,
    deliveryNoteDate: fieldValidators.stringOptional,
    dispatchedThrough: fieldValidators.stringOptional, // e.g., "By Sea"
    finalDestination: fieldValidators.stringOptional,
    vesselFlightNo: fieldValidators.stringOptional,
    portOfLoading: fieldValidators.stringOptional, // e.g., "Vizag, India"
    placeOfReceipt: fieldValidators.stringOptional,
    portOfDischarge: fieldValidators.stringOptional, // e.g., "Port Sudan, SUDAN"
    consigneeCountry: fieldValidators.stringOptional, // e.g., "Sudan"
    termsOfDelivery: fieldValidators.stringOptional,
    countryOfOrigin: fieldValidators.stringOptional, // e.g., "INDIA"
    countryOfDestination: fieldValidators.stringOptional, // e.g., "KOSTI, SUDAN"
    currency: fieldValidators.string,
    language: fieldValidators.string,
    items: z.array(ItemSchema),
    paymentInformation: PaymentInformationSchema.optional(),
    taxDetails: TaxDetailsSchema.optional(),
    discountDetails: DiscountDetailsSchema.optional(),
    shippingDetails: ShippingDetailsSchema.optional(),
    subTotal: fieldValidators.nonNegativeNumber,
    totalAmount: fieldValidators.nonNegativeNumber,
    totalAmountInWords: fieldValidators.string,
    additionalNotes: fieldValidators.stringOptional,
    paymentTerms: fieldValidators.stringMin1,
    signature: SignatureSchema.optional(),
    signatoryDetails: SignatoryDetailsSchema.optional(),
    updatedAt: fieldValidators.stringOptional,
    pdfTemplate: z.number(),
});

const InvoiceSchema = z.object({
    sender: InvoiceSenderSchema,
    receiver: InvoiceReceiverSchema,
    consignee: InvoiceConsigneeSchema.optional(),
    details: InvoiceDetailsSchema,
});

// ========================================
// PACKING LIST SCHEMAS
// ========================================

const PackingListItemSchema = z.object({
    boxNo: fieldValidators.stringMin1,
    description: fieldValidators.stringMin1,
    hsnCode: fieldValidators.stringOptional,
    quantity: fieldValidators.quantity,
    netWeight: fieldValidators.nonNegativeNumber, // in KG
    grossWeight: fieldValidators.nonNegativeNumber, // in KG
});

const PackingListDetailsSchema = z.object({
    packingListNumber: fieldValidators.stringMin1,
    date: fieldValidators.date,
    invoiceNumber: fieldValidators.stringMin1,
    buyerOrderNumber: fieldValidators.stringOptional,
    referenceNumber: fieldValidators.stringOptional,
    items: z.array(PackingListItemSchema),
    totalNetWeight: fieldValidators.nonNegativeNumber,
    totalGrossWeight: fieldValidators.nonNegativeNumber,
    signatoryDetails: SignatoryDetailsSchema.optional(),
});

const PackingListSchema = z.object({
    exporter: InvoiceSenderSchema, // Using same schema as sender
    consignee: InvoiceReceiverSchema, // Ship to
    buyer: InvoiceReceiverSchema, // Bill to
    details: PackingListDetailsSchema,
});

export { InvoiceSchema, ItemSchema, PackingListSchema, PackingListItemSchema };
