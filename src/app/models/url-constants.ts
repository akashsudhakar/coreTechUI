export class UrlConstants {
    private static readonly base = 'http://139.162.38.94:8080/orderProcessorService/service';
    public static readonly userLogin = UrlConstants.base + '/getUser';
    public static readonly getUsers = UrlConstants.base + '/getAllUsers';
    public static readonly userRegister = UrlConstants.base + '/addUser';
    public static readonly updateUser = UrlConstants.base + '/updateUser';
    public static readonly deleteUser = UrlConstants.base + '/deleteUser';
    public static readonly getBuyLead = UrlConstants.base + '/getBuyLead';
    public static readonly createBuyLead = UrlConstants.base + '/addBuyLead';
    public static readonly updateBuyLead = UrlConstants.base + '/updateBuyLead';
    public static readonly deleteBuyLead = UrlConstants.base + '/deleteBuyLead';
    public static readonly getBuyLeaditems = UrlConstants.base + '/getBuyLeadItem';
    public static readonly updateBuyLeadItem = UrlConstants.base + '/updateBuyLeadItem';
    public static readonly deleteBuyLeadItem = UrlConstants.base + '/deleteBuyLeadItem';
    public static readonly addBuyLeadItem = UrlConstants.base + '/addBuyLeadItem';
    public static readonly getProcuralItem = UrlConstants.base + '/getProcuralItem'; // status=CREATED
    public static readonly addProcuralItem = UrlConstants.base + '/addProcuralItem'; // STATUS ARRIVED
    public static readonly updateProcuralItem = UrlConstants.base + '/updateProcuralItem'; // status=REJECTED
    public static readonly deleteProcuralItem = UrlConstants.base + '/deleteProcuralItem';
    public static readonly getSuppliers = UrlConstants.base + '/getSuppliers';
    public static readonly addSupplier = UrlConstants.base + '/addSupplier';
    public static readonly updateSupplier = UrlConstants.base + '/updateSupplier';
    public static readonly deleteSupplier = UrlConstants.base + '/deleteSupplier';
    public static readonly generateQuotation = UrlConstants.base + '/generateQuotation'; // buyLeadId=1&account=icici_forex
    public static readonly generateCustomerReport = UrlConstants.base + '/generateCustomerReport';
    public static readonly uploadBuyLeadCsv = UrlConstants.base + '/upload';
    public static readonly generatePOReport = UrlConstants.base + '/generatePOReport'; // generatePOReport?status=TO_BE_ORDERED
    public static readonly getBuyLeadCount = UrlConstants.base + '/getBuyLeadCount';
}
