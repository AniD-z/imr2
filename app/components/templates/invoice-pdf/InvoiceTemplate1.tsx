import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate = (data: InvoiceType) => {
	const { sender, receiver, details } = data;

	return (
		<InvoiceLayout data={data}>
			{/* Company Header */}
			{data.details?.headerImage && (
				<div className='mb-4 -mx-10 -mt-10 page-break-avoid'>
					<img
						src={data.details.headerImage}
						alt='IMR Engineering Services'
						style={{
							width: '100%',
							height: 'auto',
							display: 'block',
						}}
					/>
				</div>
			)}

			<div className='flex justify-between page-break-avoid'>
				<div>
					{details.invoiceLogo && (
						<img
							src={details.invoiceLogo}
							width={140}
							height={100}
							alt={`Logo of ${sender.name}`}
						/>
					)}
					<h1 className='mt-2 text-lg md:text-xl font-semibold text-blue-600'>{sender.name}</h1>
				</div>
				<div className='text-right'>
					<h2 className='text-2xl md:text-3xl font-semibold text-gray-800'>Invoice #</h2>
					<span className='mt-1 block text-gray-500'>{details.invoiceNumber}</span>
					<address className='mt-4 not-italic text-gray-800'>
						{sender.address}
						<br />
						{sender.zipCode}, {sender.city}
						<br />
						{sender.country}
						<br />
						{sender.gst && (
							<>
								GST: {sender.gst}
								<br />
							</>
						)}
						{sender.adCode && (
							<>
								AD Code: {sender.adCode}
								<br />
							</>
						)}
					</address>
				</div>
			</div>

			<div className='mt-6 grid sm:grid-cols-2 gap-3 page-break-avoid'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>Bill to:</h3>
					<h3 className='text-lg font-semibold text-gray-800'>{receiver.name}</h3>
					{}
					<address className='mt-2 not-italic text-gray-500'>
						{receiver.address && receiver.address.length > 0 ? receiver.address : null}
						{receiver.zipCode && receiver.zipCode.length > 0 ? `, ${receiver.zipCode}` : null}
						<br />
						{receiver.city}, {receiver.country}
						<br />
					</address>
				</div>
				<div className='sm:text-right space-y-2'>
					<div className='grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2'>
						<dl className='grid sm:grid-cols-6 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Invoice date:</dt>
							<dd className='col-span-3 text-gray-500'>
								{new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
							</dd>
						</dl>
						<dl className='grid sm:grid-cols-6 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Due date:</dt>
							<dd className='col-span-3 text-gray-500'>
								{new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
							</dd>
						</dl>
					</div>
				</div>
			</div>

			<div className='mt-3 page-break-avoid'>
				<div className='border border-gray-200 p-1 rounded-lg space-y-1'>
					<div className='hidden sm:grid sm:grid-cols-8 gap-1'>
						<div className='text-xs font-medium text-gray-500 uppercase'>SL No</div>
						<div className='sm:col-span-2 text-xs font-medium text-gray-500 uppercase'>Description</div>
						<div className='text-xs font-medium text-gray-500 uppercase'>HSN CODE</div>
						<div className='text-xs font-medium text-gray-500 uppercase'>Qty</div>
						<div className='text-xs font-medium text-gray-500 uppercase'>Units</div>
						<div className='text-right text-xs font-medium text-gray-500 uppercase'>Unit/Rate in {details.currency}</div>
						<div className='text-right text-xs font-medium text-gray-500 uppercase'>Total</div>
					</div>
					<div className='hidden sm:block border-b border-gray-200'></div>
					<div className='grid grid-cols-3 sm:grid-cols-8 gap-1'>
						{details.items.map((item, index) => (
							<React.Fragment key={index}>
								<div className='border-b border-gray-300'>
									<p className='text-gray-800'>{index + 1}</p>
								</div>
								<div className='col-span-full sm:col-span-2 border-b border-gray-300'>
									<p className='font-medium text-gray-800'>{item.name}</p>
									<p className='text-xs text-gray-600 whitespace-pre-line'>{item.description}</p>
								</div>
								<div className='border-b border-gray-300'>
									<p className='text-gray-800 text-xs'>{item.hsnCode || '-'}</p>
								</div>
								<div className='border-b border-gray-300'>
									<p className='text-gray-800'>{item.quantity}</p>
								</div>
								<div className='border-b border-gray-300'>
									<p className='text-gray-800 text-xs'>{item.units || '-'}</p>
								</div>
								<div className='border-b border-gray-300'>
									<p className='sm:text-right text-gray-800'>
										{item.unitPrice} {details.currency}
									</p>
								</div>
								<div className='border-b border-gray-300'>
									<p className='sm:text-right text-gray-800'>
										{item.total} {details.currency}
									</p>
								</div>
							</React.Fragment>
						))}
					</div>
					<div className='sm:hidden border-b border-gray-200'></div>
				</div>
			</div>

			<div className='mt-2 flex sm:justify-end page-break-avoid'>
				<div className='sm:text-right space-y-2'>
					<div className='grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2'>
						<dl className='grid sm:grid-cols-5 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Subtotal:</dt>
							<dd className='col-span-2 text-gray-500'>
								{formatNumberWithCommas(Number(details.subTotal))} {details.currency}
							</dd>
						</dl>
						{details.discountDetails?.amount != undefined &&
							details.discountDetails?.amount > 0 && (
								<dl className='grid sm:grid-cols-5 gap-x-3'>
									<dt className='col-span-3 font-semibold text-gray-800'>Discount:</dt>
									<dd className='col-span-2 text-gray-500'>
										{details.discountDetails.amountType === "amount"
											? `- ${details.discountDetails.amount} ${details.currency}`
											: `- ${details.discountDetails.amount}%`}
									</dd>
								</dl>
							)}
						{details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Tax:</dt>
								<dd className='col-span-2 text-gray-500'>
									{details.taxDetails.amountType === "amount"
										? `+ ${details.taxDetails.amount} ${details.currency}`
										: `+ ${details.taxDetails.amount}%`}
								</dd>
							</dl>
						)}
						{details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Shipping:</dt>
								<dd className='col-span-2 text-gray-500'>
									{details.shippingDetails.costType === "amount"
										? `+ ${details.shippingDetails.cost} ${details.currency}`
										: `+ ${details.shippingDetails.cost}%`}
								</dd>
							</dl>
						)}
						<dl className='grid sm:grid-cols-5 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Total:</dt>
							<dd className='col-span-2 text-gray-500'>
								{formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
							</dd>
						</dl>
						{details.totalAmountInWords && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Total in words:</dt>
								<dd className='col-span-2 text-gray-500'>
									<em>
										{details.totalAmountInWords} {details.currency}
									</em>
								</dd>
							</dl>
						)}
					</div>
				</div>
			</div>

			<div className='page-break-avoid'>
				<div className='my-4'>
					<div className='my-2'>
						<p className='font-semibold text-blue-600'>Additional notes:</p>
						<p className='font-regular text-gray-800'>{details.additionalNotes}</p>
					</div>
					<div className='my-2'>
						<p className='font-semibold text-blue-600'>Payment terms:</p>
						<p className='font-regular text-gray-800'>{details.paymentTerms}</p>
					</div>
					<div className='my-2'>
						<span className='font-semibold text-md text-gray-800'>
							Bank Details:
							<p className='text-sm'>Beneficiary: {details.paymentInformation?.accountName}</p>
							<p className='text-sm'>A/C No: {details.paymentInformation?.accountNumber}</p>
							{details.paymentInformation?.ifscCode && (
								<p className='text-sm'>IFS Code: {details.paymentInformation.ifscCode}</p>
							)}
							{details.paymentInformation?.branch && (
								<p className='text-sm'>Branch: {details.paymentInformation.branch}</p>
							)}
							{details.paymentInformation?.swiftCode && (
								<p className='text-sm'>SWIFT CODE: {details.paymentInformation.swiftCode}</p>
							)}
							<p className='text-sm'>BANK: {details.paymentInformation?.bankName}</p>
							{details.paymentInformation?.adCode && (
								<p className='text-sm'>Authorized Dealer Code: {details.paymentInformation.adCode}</p>
							)}
						</span>
					</div>
				</div>
				<p className='text-gray-500 text-sm'>
					If you have any questions concerning this invoice, use the following contact information:
				</p>
				<div>
					<p className='block text-sm font-medium text-gray-800'>{sender.email}</p>
					<p className='block text-sm font-medium text-gray-800'>{sender.phone}</p>
				</div>
			</div>

			{/* Signature */}
			{details?.signature?.data && isDataUrl(details?.signature?.data) ? (
				<div className='mt-6'>
					<p className='font-semibold text-gray-800'>Signature:</p>
					<img
						src={details.signature.data}
						width={120}
						height={60}
						alt={`Signature of ${sender.name}`}
					/>
				</div>
			) : details.signature?.data ? (
				<div className='mt-6'>
					<p className='text-gray-800'>Signature:</p>
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

			{/* Company Footer */}
			<div className='mt-8 text-center text-sm text-gray-800 page-break-avoid'>
				<p>mail.imrengineering@gmail.com | <a href='https://www.imrengineeringservices.in/' target='_blank' rel='noopener noreferrer' className='text-blue-600'>https://www.imrengineeringservices.in/</a></p>
			</div>
		</InvoiceLayout>
	);
};

export default InvoiceTemplate;
