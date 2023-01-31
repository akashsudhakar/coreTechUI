export interface ProcuralItemI {
    id: number;
    createdBy: number;
    poNumber: string;
    itemName: string;
    quantity: number;
    customerName: string;
    updatedBy: number;
    supplierName: string;
    createdDate: number;
    status: string;
    rateinPO: string;
    purchaseRateUSD: number;
    purchaseRateINR: number;
    totalPurchaseRateInr: number;
    igst: string;
    customDuty: string;
    courierName: string;
    trackingId: string;
    supplierId: number;
    buyleadItemId: number;
    updatedDate: number;
}
