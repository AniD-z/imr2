import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate3 = (data: InvoiceType) => {
	const { sender, receiver, consignee, details } = data;

	return (
		<InvoiceLayout data={data}>
			{/* Header */}
			<div className='text-center mb-4'>
				<h1 className='text-3xl font-bold text-gray-900'>TAX INVOICE</h1>
			</div>

			{/* Main Information Table */}
			<div className='border-2 border-gray-900 mb-3 page-break-avoid'>
				{/* Row 1: From Section and Invoice Details */}
				<div className='grid grid-cols-2 border-b-2 border-gray-900'>
					{/* From Section */}
					<div className='border-r-2 border-gray-900 p-3'>
						<div className='font-bold text-gray-900 mb-2'>From</div>
						<div className='text-sm'>
							<div className='font-semibold'>{sender.name}</div>
							<div>{sender.address}</div>
							<div>
								{sender.city} - {sender.zipCode},
							</div>
							<div>{sender.country}.</div>
							{sender.gst && <div>GST:{sender.gst}</div>}
							{sender.adCode && <div>AD Code: {sender.adCode}</div>}
						</div>
					</div>

					{/* Invoice Details */}
					<div className='p-0'>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Invoice No: -</div>
							<div className='p-2 font-semibold text-sm'>
								Date: - {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
							</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.invoiceNumber}</div>
							<div className='p-2 text-sm'></div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>
								Buyer's Order No.
							</div>
							<div className='p-2 font-semibold text-sm'>Mode/Terms of Payment</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.purchaseOrderNumber || "-"}</div>
							<div className='p-2 text-sm'>{details.modeOfPayment || ""}</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Reference No. & Date.</div>
							<div className='p-2 font-semibold text-sm'>Other References</div>
						</div>
						<div className='grid grid-cols-2'>
							<div className='p-2 border-r border-gray-900 text-sm whitespace-pre-line'>
								{details.referenceNumbers || ""}
							</div>
							<div className='p-2 text-sm whitespace-pre-line'>{details.otherReferences || ""}</div>
						</div>
					</div>
				</div>

				{/* Row 2: Consignee Section and Dispatch Details */}
				<div className='grid grid-cols-2 border-b-2 border-gray-900'>
					{/* Consignee (Ship to) */}
					<div className='border-r-2 border-gray-900 p-3'>
						<div className='font-bold text-gray-900 mb-2'>Consignee (Ship to)</div>
						<div className='text-sm'>
							<div className='font-semibold'>{consignee?.name || receiver.name}</div>
							<div>{consignee?.address || receiver.address}</div>
							<div>{consignee?.city || receiver.city}</div>
							<div>{consignee?.country || receiver.country}</div>
						</div>
					</div>

					{/* Dispatch and Delivery Details */}
					<div className='p-0'>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Dispatch Doc No.</div>
							<div className='p-2 font-semibold text-sm'>Delivery Note Date</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.dispatchDocNumber || ""}</div>
							<div className='p-2 text-sm'>{details.deliveryNoteDate || ""}</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Dispatched through</div>
							<div className='p-2 font-semibold text-sm'>Final Destination Final Destination:</div>
						</div>
						<div className='grid grid-cols-2'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.dispatchedThrough || ""}</div>
							<div className='p-2 text-sm'>{details.finalDestination || ""}</div>
						</div>
					</div>
				</div>

				{/* Row 3: Buyer Section and Vessel Details */}
				<div className='grid grid-cols-2 border-b-2 border-gray-900'>
					{/* Buyer (Bill to) */}
					<div className='border-r-2 border-gray-900 p-3'>
						<div className='font-bold text-gray-900 mb-2'>Buyer (Bill to)</div>
						<div className='text-sm'>
							<div className='font-semibold'>{receiver.name}</div>
							<div>{receiver.address}</div>
							<div>
								{receiver.city}, {receiver.country}
							</div>
						</div>
					</div>

					{/* Vessel and Port Details */}
					<div className='p-0'>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Vessel/Flight No.</div>
							<div className='p-2 font-semibold text-sm'>Place of receipt by shipper:</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.vesselFlightNo || ""}</div>
							<div className='p-2 text-sm'>{details.placeOfReceipt || ""}</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>City/Port of Loading</div>
							<div className='p-2 font-semibold text-sm'>City/Port of Discharge</div>
						</div>
						<div className='grid grid-cols-2'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.portOfLoading || ""}</div>
							<div className='p-2 text-sm'>{details.portOfDischarge || ""}</div>
						</div>
					</div>
				</div>

				{/* Row 4: Country Information */}
				<div className='border-b border-gray-900'>
					<div className='grid grid-cols-3'>
						<div className='p-2 border-r border-gray-900'>
							<div className='font-semibold text-sm'>Country of Origin of Goods</div>
						</div>
						<div className='p-2 border-r border-gray-900'>
							<div className='font-semibold text-sm'>Country of Final Destination</div>
						</div>
						<div className='p-2'>
							<div className='text-sm'></div>
						</div>
					</div>
					<div className='grid grid-cols-3 border-t border-gray-900'>
						<div className='p-2 border-r border-gray-900 text-sm'>{details.countryOfOrigin || ""}</div>
						<div className='p-2 border-r border-gray-900 text-sm'>{details.countryOfDestination || ""}</div>
						<div className='p-2 text-sm'></div>
					</div>
				</div>

				{/* Row 5: Country and Terms of Delivery */}
				<div className='grid grid-cols-2'>
					<div className='p-2 border-r border-gray-900'>
						<div className='font-semibold text-sm'>Country: {details.consigneeCountry || ""}</div>
					</div>
					<div className='p-2'>
						<div className='font-semibold text-sm'>Terms of Delivery</div>
					</div>
				</div>
				<div className='grid grid-cols-2 border-t border-gray-900'>
					<div className='p-2 border-r border-gray-900 text-sm'></div>
					<div className='p-2 text-sm'>{details.termsOfDelivery || ""}</div>
				</div>
			</div>

			{/* Items Table */}
			<div className='mt-3 page-break-avoid'>
				<div className='border border-gray-900'>
					<div className='grid grid-cols-10 bg-gray-100 border-b border-gray-900'>
						<div className='p-2 border-r border-gray-900 text-xs font-bold text-center'>SL No</div>
						<div className='col-span-3 p-2 border-r border-gray-900 text-xs font-bold text-center'>
							Description of Goods
						</div>
						<div className='p-2 border-r border-gray-900 text-xs font-bold text-center'>HSN CODE</div>
						<div className='p-2 border-r border-gray-900 text-xs font-bold text-center'>Quantity</div>
						<div className='p-2 border-r border-gray-900 text-xs font-bold text-center'>Units</div>
						<div className='p-2 border-r border-gray-900 text-xs font-bold text-center'>
							Rate in {details.currency}
						</div>
						<div className='p-2 text-xs font-bold text-center'>Total</div>
					</div>
					{details.items.map((item, index) => (
						<div key={index} className='grid grid-cols-10 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm text-center'>{index + 1}</div>
							<div className='col-span-3 p-2 border-r border-gray-900 text-sm'>
								<div className='font-medium'>{item.name}</div>
								{item.description && <div className='text-xs text-gray-600 whitespace-pre-line'>{item.description}</div>}
							</div>
							<div className='p-2 border-r border-gray-900 text-sm text-center'>{item.hsnCode || "-"}</div>
							<div className='p-2 border-r border-gray-900 text-sm text-center'>{item.quantity}</div>
							<div className='p-2 border-r border-gray-900 text-sm text-center'>{item.units || "-"}</div>
							<div className='p-2 border-r border-gray-900 text-sm text-right'>{item.unitPrice}</div>
							<div className='p-2 text-sm text-right'>{item.total} {details.currency}</div>
						</div>
					))}
				</div>
			</div>

			{/* Totals */}
			<div className='mt-3 flex justify-end page-break-avoid'>
				<div className='w-1/2'>
					<div className='border border-gray-900'>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Subtotal:</div>
							<div className='p-2 text-sm text-right'>
								{formatNumberWithCommas(Number(details.subTotal))} {details.currency}
							</div>
						</div>
						{details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
							<div className='grid grid-cols-2 border-b border-gray-900'>
								<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Discount:</div>
								<div className='p-2 text-sm text-right'>
									{details.discountDetails.amountType === "amount"
										? `- ${details.discountDetails.amount} ${details.currency}`
										: `- ${details.discountDetails.amount}%`}
								</div>
							</div>
						)}
						{details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
							<div className='grid grid-cols-2 border-b border-gray-900'>
								<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Tax:</div>
								<div className='p-2 text-sm text-right'>
									{details.taxDetails.amountType === "amount"
										? `+ ${details.taxDetails.amount} ${details.currency}`
										: `+ ${details.taxDetails.amount}%`}
								</div>
							</div>
						)}
						{details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
							<div className='grid grid-cols-2 border-b border-gray-900'>
								<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Shipping:</div>
								<div className='p-2 text-sm text-right'>
									{details.shippingDetails.costType === "amount"
										? `+ ${details.shippingDetails.cost} ${details.currency}`
										: `+ ${details.shippingDetails.cost}%`}
								</div>
							</div>
						)}
						<div className='grid grid-cols-2'>
							<div className='p-2 border-r border-gray-900 font-bold text-sm'>Total:</div>
							<div className='p-2 text-sm text-right font-bold'>
								{formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
							</div>
						</div>
						{details.totalAmountInWords && (
							<div className='p-2 border-t border-gray-900 text-sm'>
								<span className='font-semibold'>Amount in words: </span>
								<em>{details.totalAmountInWords}</em>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Bank Details and Signatory Information */}
		<div className='mt-4 page-break-avoid'>
				{(details.paymentInformation || details.signatoryDetails) && (
					<div className='border border-gray-900 mb-3'>
						<div className='grid grid-cols-2'>
							{/* Left Column: Bank Details */}
							{details.paymentInformation ? (
								<div className='p-3 border-r border-gray-900'>
									<div className='font-bold text-gray-900 mb-2'>Bank Details:</div>
									<div className='text-sm space-y-1'>
										<div>
											<span className='font-semibold'>Beneficiary:</span> {details.paymentInformation.accountName}
										</div>
										<div>
											<span className='font-semibold'>A/C No:</span> {details.paymentInformation.accountNumber}
										</div>
										{details.paymentInformation.ifscCode && (
											<div>
												<span className='font-semibold'>IFS Code:</span> {details.paymentInformation.ifscCode}
											</div>
										)}
										{details.paymentInformation.branch && (
											<div>
												<span className='font-semibold'>Branch:</span> {details.paymentInformation.branch}
											</div>
										)}
										{details.paymentInformation.swiftCode && (
											<div>
												<span className='font-semibold'>SWIFT CODE:</span> {details.paymentInformation.swiftCode}
											</div>
										)}
										<div>
											<span className='font-semibold'>BANK:</span> {details.paymentInformation.bankName}
										</div>
										{details.paymentInformation.adCode && (
											<div>
												<span className='font-semibold'>Authorized Dealer Code:</span>{" "}
												{details.paymentInformation.adCode}
											</div>
										)}
									</div>
								</div>
							) : (
								<div className='p-3 border-r border-gray-900'></div>
							)}

							{/* Right Column: Company Stamp and Signatory */}
							<div className='p-3 flex flex-col items-end justify-between'>
								<div className='text-right'>
									<div className='font-bold text-gray-900 mb-2'>For {sender.name}</div>
									{details.signatoryDetails?.companyStamp && (
										<div className='mb-3 flex justify-end'>
											<img
												src={details.signatoryDetails.companyStamp}
												width={100}
												height={100}
												alt='Company Stamp'
												className='object-contain'
											/>
										</div>
									)}
									{details?.signature?.data && isDataUrl(details?.signature?.data) ? (
										<div className='mb-2 flex justify-end'>
											<img
												src={details.signature.data}
												width={120}
												height={60}
												alt={`Signature`}
												className='object-contain'
											/>
										</div>
									) : details.signature?.data ? (
										<div className='mb-2'>
											<p
												style={{
													fontSize: 30,
													fontWeight: 400,
													fontFamily: `${details.signature.fontFamily}, cursive`,
													color: "black",
												}}
											>
												{details.signature.data}
											</p>
										</div>
									) : null}
								</div>
								<div className='text-sm text-right'>
									{details.signatoryDetails?.name && (
										<div className='font-semibold'>{details.signatoryDetails.name}</div>
									)}
									{details.signatoryDetails?.designation && (
										<div>{details.signatoryDetails.designation}</div>
									)}
									{details.signatoryDetails?.department && (
										<div>{details.signatoryDetails.department}</div>
									)}
									{details.signatoryDetails?.phone && (
										<div>{details.signatoryDetails.phone}</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Additional Notes */}
				{details.additionalNotes && (
					<div className='mb-3'>
						<div className='font-bold text-gray-900 mb-1'>Additional notes:</div>
						<div className='text-sm text-gray-800'>{details.additionalNotes}</div>
					</div>
				)}

				{/* Payment Terms */}
				{details.paymentTerms && (
					<div className='mb-3'>
						<div className='font-bold text-gray-900 mb-1'>Payment terms:</div>
						<div className='text-sm text-gray-800'>{details.paymentTerms}</div>
					</div>
				)}
			</div>

			{/* Contact Information */}
			<div className='mt-4'>
				<p className='text-gray-600 text-sm mb-1'>
					If you have any questions concerning this invoice, use the following contact information:
				</p>
				<div className='text-sm'>
					<div className='font-medium text-gray-800'>{sender.email}</div>
					<div className='font-medium text-gray-800'>{sender.phone}</div>
				</div>
			</div>
		</InvoiceLayout>
	);
};

export default InvoiceTemplate3;
