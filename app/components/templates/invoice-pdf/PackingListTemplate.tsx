import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { PackingListType } from "@/types";

const PackingListTemplate = (data: PackingListType) => {
	const { exporter, consignee, buyer, details, items } = data;

	// Calculate totals
	const totalNetWeight = items.reduce((sum, item) => sum + (parseFloat(item.netWeight?.toString() || "0") || 0), 0);
	const totalGrossWeight = items.reduce((sum, item) => sum + (parseFloat(item.grossWeight?.toString() || "0") || 0), 0);

	return (
		<InvoiceLayout data={data}>
			{/* Header */}
			<div className='text-center mb-4'>
				<h1 className='text-3xl font-bold text-gray-900'>PACKING LIST</h1>
			</div>

			{/* Main Information Table */}
			<div className='border-2 border-gray-900 mb-3 page-break-avoid'>
				{/* Row 1: Exporter Section and Packing List Details */}
				<div className='grid grid-cols-2 border-b-2 border-gray-900'>
					{/* Exporter Section */}
					<div className='border-r-2 border-gray-900 p-3'>
						<div className='font-bold text-gray-900 mb-2'>Exporter</div>
						<div className='text-sm'>
							<div className='font-semibold'>{exporter.name}</div>
							<div>{exporter.address}</div>
							<div>
								{exporter.city} - {exporter.zipCode},
							</div>
							<div>{exporter.country}.</div>
							{exporter.gst && <div>GST: {exporter.gst}</div>}
							{exporter.adCode && <div>AD Code: {exporter.adCode}</div>}
						</div>
					</div>

					{/* Packing List Details */}
					<div className='p-0'>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Packing List No:</div>
							<div className='p-2 font-semibold text-sm'>Date:</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.packingListNumber}</div>
							<div className='p-2 text-sm'>
								{new Date(details.date).toLocaleDateString("en-US", DATE_OPTIONS)}
							</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 font-semibold text-sm'>Invoice Number</div>
							<div className='p-2 font-semibold text-sm'>Buyer's Order No.</div>
						</div>
						<div className='grid grid-cols-2 border-b border-gray-900'>
							<div className='p-2 border-r border-gray-900 text-sm'>{details.invoiceNumber || "-"}</div>
							<div className='p-2 text-sm'>{details.buyerOrderNumber || "-"}</div>
						</div>
						<div className='border-b border-gray-900'>
							<div className='p-2 font-semibold text-sm'>Reference No.</div>
						</div>
						<div>
							<div className='p-2 text-sm whitespace-pre-line'>{details.referenceNumber || "-"}</div>
						</div>
					</div>
				</div>

				{/* Row 2: Consignee Section */}
				<div className='border-b-2 border-gray-900 p-3'>
					<div className='font-bold text-gray-900 mb-2'>Consignee (Ship to)</div>
					<div className='text-sm'>
						<div className='font-semibold'>{consignee.name}</div>
						<div>{consignee.address}</div>
						<div>
							{consignee.city}, {consignee.country}
						</div>
					</div>
				</div>

				{/* Row 3: Buyer Section */}
				<div className='p-3'>
					<div className='font-bold text-gray-900 mb-2'>Buyer (Bill to)</div>
					<div className='text-sm'>
						<div className='font-semibold'>{buyer.name}</div>
						<div>{buyer.address}</div>
						<div>
							{buyer.city}, {buyer.country}
						</div>
					</div>
				</div>
			</div>

			{/* Items Table */}
			<div className='mt-3 page-break-avoid'>
				<div className='border border-gray-900'>
					<div className='grid grid-cols-12 bg-gray-100 border-b border-gray-900'>
						<div className='col-span-1 p-2 border-r border-gray-900 text-xs font-bold text-center'>Box No.</div>
						<div className='col-span-5 p-2 border-r border-gray-900 text-xs font-bold text-center'>
							Description of Goods
						</div>
						<div className='col-span-2 p-2 border-r border-gray-900 text-xs font-bold text-center'>HSN CODE</div>
						<div className='col-span-1 p-2 border-r border-gray-900 text-xs font-bold text-center'>Quantity</div>
						<div className='col-span-1.5 p-2 border-r border-gray-900 text-xs font-bold text-center'>
							Net Weight (KG)
						</div>
						<div className='col-span-1.5 p-2 text-xs font-bold text-center'>Gross Weight (KG)</div>
					</div>
					{items.map((item, index) => (
						<div key={index} className='grid grid-cols-12 border-b border-gray-900'>
							<div className='col-span-1 p-2 border-r border-gray-900 text-sm text-center'>{item.boxNo}</div>
							<div className='col-span-5 p-2 border-r border-gray-900 text-sm'>
								<div className='whitespace-pre-line'>{item.description}</div>
							</div>
							<div className='col-span-2 p-2 border-r border-gray-900 text-sm text-center'>{item.hsnCode || "-"}</div>
							<div className='col-span-1 p-2 border-r border-gray-900 text-sm text-center'>{item.quantity}</div>
							<div className='col-span-1.5 p-2 border-r border-gray-900 text-sm text-right'>
								{formatNumberWithCommas(Number(item.netWeight))}
							</div>
							<div className='col-span-1.5 p-2 text-sm text-right'>
								{formatNumberWithCommas(Number(item.grossWeight))}
							</div>
						</div>
					))}
					{/* Totals Row */}
					<div className='grid grid-cols-12 bg-gray-100'>
						<div className='col-span-9 p-2 border-r border-gray-900 text-sm font-bold text-right'>Total:</div>
						<div className='col-span-1.5 p-2 border-r border-gray-900 text-sm font-bold text-right'>
							{formatNumberWithCommas(totalNetWeight)} KG
						</div>
						<div className='col-span-1.5 p-2 text-sm font-bold text-right'>
							{formatNumberWithCommas(totalGrossWeight)} KG
						</div>
					</div>
				</div>
			</div>

			{/* Total Summary */}
			<div className='mt-6 page-break-avoid'>
				<div className='border-2 border-gray-900 p-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<span className='font-bold text-sm'>Total Net Weight:</span>
							<span className='ml-2 text-sm'>{formatNumberWithCommas(totalNetWeight)} KG</span>
						</div>
						<div>
							<span className='font-bold text-sm'>Total Gross Weight:</span>
							<span className='ml-2 text-sm'>{formatNumberWithCommas(totalGrossWeight)} KG</span>
						</div>
					</div>
					<div className='mt-4'>
						<span className='font-bold text-sm'>Total Number of Boxes:</span>
						<span className='ml-2 text-sm'>{items.length}</span>
					</div>
				</div>
			</div>

			{/* Footer Note */}
			<div className='mt-6 text-sm text-gray-600 page-break-avoid'>
				<p className='italic'>This packing list is issued for customs clearance purposes.</p>
			</div>
		</InvoiceLayout>
	);
};

export default PackingListTemplate;
