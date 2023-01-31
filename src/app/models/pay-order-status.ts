export class PayOrderStatus {
    public static readonly DISPATCHED = 'DISPATCHED';
    public static readonly FULLY_DISPATCHED = 'FULLY_DISPATCHED';
    public static readonly PARTIALLY_DISPATCHED = 'PARTIALLY_DISPATCHED';
    public static readonly PENDING = 'PENDING';
    public static readonly TO_BE_ORDERED = 'TO_BE_ORDERED';
    public static readonly ORDERED = 'ORDERED';
    public static readonly IN_TRANSIT = 'IN_TRANSIT';
    public static readonly AT_CUSTOMS = 'AT_CUSTOMS';
    public static readonly CUSTOMS_CLEARED = 'CUSTOMS_CLEARED';
    public static readonly ARRIVED_AT_STORE = 'ARRIVED_AT_STORE';
    public static readonly RECEIVED_AT_STORE = 'RECEIVED_AT_STORE';
}
