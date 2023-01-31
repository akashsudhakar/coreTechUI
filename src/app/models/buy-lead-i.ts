import { BuyLeadItemsI } from './buy-lead-items-i';

export interface BuyLeadI {
    buyLeadItems: BuyLeadItemsI[];
    id: number;
    createdBy: number;
    custName: string;
    custLocation: string;
    custPhone: string;
    custEmail: string;
    poNumber: string;
    followUpCount: number;
    followUpDate: string;
    followUpBy: number; // number?
    companyName: string;
    postalAddress: string;
    poDate: string;
    updatedBy: number;
    createdDate: string;
    status: string;
    updatedDate: string;
    bankAccount: string; // added only on UI
    shipping: string;
    term1: string;
    term3: string;
    createdDateObject: Date;
}
