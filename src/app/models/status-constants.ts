import { Injectable } from '@angular/core';
// export enum StatusConstants {
//     STATUS_KEY = 'status',
//     CREATED_STATUS = 'CREATED',
//     RATEUPDATED_STATUS = 'RATEUPDATED',
//     APPROVED_STATUS = 'APPROVED'
// }
@Injectable()
export class StatusConstants {
    public static readonly STATUS_KEY = 'status';
    public static readonly CREATED_STATUS = 'CREATED';
    public static readonly RATEUPDATED_STATUS = 'RATEUPDATED';
    public static readonly APPROVED_STATUS = 'APPROVED';
    public static readonly ARRIVED_STATUS = 'ARRIVED';
    public static readonly PENDING_STATUS = 'PENDING';
    public static readonly QUOTATION_GENERATED = 'QUOTATIONGENERATED';
    public static readonly ACCEPTED = 'ACCEPTED';
    public static readonly REJECTED = 'REJECTED';
    public static readonly FOLLOWUP = 'FOLLOWUP';
}
