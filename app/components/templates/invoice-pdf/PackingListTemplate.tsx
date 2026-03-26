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
	const { exporter, consignee, buyer, details } = data;

	// Calculate totals
	const totalNetWeight = details.items.reduce((sum, item) => sum + (parseFloat(item.netWeight?.toString() || "0") || 0), 0);
	const totalGrossWeight = details.items.reduce((sum, item) => sum + (parseFloat(item.grossWeight?.toString() || "0") || 0), 0);

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

			{/* Header */}
			<div className='text-center mb-4'>
				<h1 className='text-3xl font-bold text-gray-900'>PACKING LIST</h1>
			</div>

			{/* Main Information Table */}
			<div className='border-2 border-gray-900 mb-3 page-break-avoid'>
				{/* Row 1: Exporter Section and Consignee Section */}
				<div className='grid grid-cols-2 border-b-2 border-gray-900'>
					{/* Exporter and Details Section */}
					<div className='border-r-2 border-gray-900 p-3'>
						<div className='font-bold text-gray-900 mb-2'>Exporter</div>
						<div className='text-sm mb-3'>
							<div className='font-semibold'>{exporter.name}</div>
							<div>{exporter.address}</div>
							<div>
								{exporter.city} - {exporter.zipCode},
							</div>
							<div>{exporter.country}.</div>
							{exporter.gst && <div>GST: {exporter.gst}</div>}
							{exporter.adCode && <div>AD Code: {exporter.adCode}</div>}
						</div>
						
						{/* Shipment Details */}
						<div className='border-t border-gray-900 pt-2 text-xs'>
							{details.iecNo && <div className='mb-1'><span className='font-semibold'>IEC No:</span> {details.iecNo}</div>}
							{details.freightMode && <div className='mb-1'><span className='font-semibold'>Freight Mode:</span> {details.freightMode}</div>}
							{details.portOfLoading && <div className='mb-1'><span className='font-semibold'>Port of Loading:</span> {details.portOfLoading}</div>}
							{details.countryOfOrigin && <div className='mb-1'><span className='font-semibold'>Country of Origin:</span> {details.countryOfOrigin}</div>}
							{details.portOfDischarge && <div className='mb-1'><span className='font-semibold'>Port of Discharge:</span> {details.portOfDischarge}</div>}
							{details.finalDestination && <div className='mb-1'><span className='font-semibold'>Final Destination:</span> {details.finalDestination}</div>}
							{details.countryOfFinalDestination && <div className='mb-1'><span className='font-semibold'>Country of Final Destination:</span> {details.countryOfFinalDestination}</div>}
						</div>
					</div>

					{/* Consignee Section (Right side) */}
					<div className='p-3'>
						<div className='font-bold text-gray-900 mb-2'>Consignee</div>
						<div className='text-sm mb-4'>
							<div className='font-semibold'>{consignee.name}</div>
							<div>{consignee.address}</div>
							<div>
								{consignee.city}, {consignee.country}
							</div>
						</div>
						<div className='border-t border-gray-900 pt-2'>
							<div className='font-bold text-gray-900 text-xs mb-2'>Reference Details</div>
							<div className='text-xs'>
								<div className='mb-1'><span className='font-semibold'>Packing List No:</span> {details.packingListNumber}</div>
								<div className='mb-1'><span className='font-semibold'>Date:</span> {new Date(details.date).toLocaleDateString("en-US", DATE_OPTIONS)}</div>
								<div className='mb-1'><span className='font-semibold'>Invoice Number:</span> {details.invoiceNumber || "-"}</div>
								<div className='mb-1'><span className='font-semibold'>Buyer's Order No:</span> {details.buyerOrderNumber || "-"}</div>
								{details.referenceNumber && <div className='mb-1'><span className='font-semibold'>Reference No:</span> {details.referenceNumber}</div>}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Items Table */}
			<div className='mt-3'>
				<div className='border-2 border-gray-900'>
					{/* Header Row */}
					<div className='grid grid-cols-12 bg-gray-100 border-b-2 border-gray-900'>
						<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900 text-xs font-bold text-center'>Box No.</div>
						<div className='col-span-4 p-2 border-r-2 border-gray-900 text-xs font-bold text-center'>Description of Goods</div>
						<div className='col-span-2 p-2 border-r-2 border-gray-900 text-xs font-bold text-center'>HSN CODE</div>
						<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900 text-xs font-bold text-center'>Qty</div>
						<div className='col-span-2 p-2 border-r-2 border-gray-900 text-xs font-bold text-center'>Box Dimension</div>
						<div className='col-span-1 p-2 border-r-2 border-gray-900 text-xs font-bold text-center'>Net Wt (Kg)</div>
						<div className='col-span-1 p-2 text-xs font-bold text-center'>Gross Wt</div>
					</div>

					{/* Items */}
					{details.items.map((item, index) => (
						<div key={index} className='grid grid-cols-12 border-b-2 border-gray-900'>
							<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900 text-sm font-bold text-center'>{item.boxNo}</div>
							<div className='col-span-4 p-2 border-r-2 border-gray-900 text-sm'>
							<div>{item.description}</div>
							</div>
							<div className='col-span-2 p-2 border-r-2 border-gray-900 text-sm text-center'>{item.hsnCode || "-"}</div>
							<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900 text-sm text-center'>{item.quantity}</div>
							<div className='col-span-2 p-2 border-r-2 border-gray-900 text-xs text-center'>{item.boxDimension || "-"}</div>
							<div className='col-span-1 p-2 border-r-2 border-gray-900 text-sm text-right font-semibold'>{formatNumberWithCommas(Number(item.netWeight))}</div>
							<div className='col-span-1 p-2 text-sm text-right font-semibold'>{formatNumberWithCommas(Number(item.grossWeight))}</div>
						</div>
					))}

					{/* Totals Row */}
					<div className='grid grid-cols-12 bg-gray-100 border-t-2 border-gray-900'>
						<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900'>&nbsp;</div>
						<div className='col-span-4 p-2 border-r-2 border-gray-900 text-sm font-bold'>Total:</div>
						<div className='col-span-2 p-2 border-r-2 border-gray-900'>&nbsp;</div>
						<div className='col-span-1 px-1 py-2 border-r-2 border-gray-900'>&nbsp;</div>
						<div className='col-span-2 p-2 border-r-2 border-gray-900'>&nbsp;</div>
						<div className='col-span-1 p-2 border-r-2 border-gray-900 text-sm font-bold text-right'>{formatNumberWithCommas(totalNetWeight)} KG</div>
						<div className='col-span-1 p-2 text-sm font-bold text-right'>{formatNumberWithCommas(totalGrossWeight)} KG</div>
					</div>
				</div>
			</div>

			{/* Total Summary */}
			<div className='mt-3'>
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
						<span className='ml-2 text-sm'>{details.items.length}</span>
					</div>
				</div>
			</div>

			{/* Signature Section */}
			<div className='mt-4 page-break-avoid'>
				<div className='border-2 border-gray-900'>
					<div className='p-4 flex justify-end'>
						<div className='text-right'>
							<div className='font-bold text-gray-900 mb-8'>For {exporter.name}</div>
							<div className='text-sm font-semibold'>Authorized Signature</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer Note */}
			<div className='mt-6 text-sm text-gray-600 page-break-avoid'>
				<p className='italic'>This packing list is issued for customs clearance purposes.</p>
			</div>

			{/* Company Footer */}
			<div className='mt-8 text-xs text-gray-800 page-break-avoid'>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<p className='mb-1'><span className='font-semibold'>Head Office :</span> H.No. 15-11-28/204, VDOS Colony, HYDERABAD, Telangana, INDIA. Pin:500 201</p>
						<p className='mb-1'><span className='font-semibold'>CELL No :</span> 9059597743</p>
						<p className='mb-1'><span className='font-semibold'>E-Mail :</span> mail.imrengineeringsg@gmail.com</p>
					<p><span className='font-semibold'>Website :</span> <a href='https://www.imrengineeringservices.in/' target='_blank' rel='noopener noreferrer' className='text-blue-600'>https://www.imrengineeringservices.in/</a></p>
					</div>
					<div>
						<p className='mb-1'><span className='font-semibold'>CIN No :</span> U52599TG2020PLC166005</p>
						<p className='mb-1'><span className='font-semibold'>GSTIN :</span> 36AAGCI8221A1S</p>
						<p className='mb-1'><span className='font-semibold'>PAN :</span> AAGC18221A</p>
						<p className='mb-1'><span className='font-semibold'>IEC No :</span> AAGC18227A</p>
						<p><span className='font-semibold'>TAN No :</span> HYD107889A</p>
					</div>
				</div>
			</div>
		</InvoiceLayout>
	);
};

export default PackingListTemplate;
