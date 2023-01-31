import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';

import { BuyLeadCreateComponent } from './components/buy-lead-create/buy-lead-create.component';
import { BuyLeadUpdateComponent } from './components/buy-lead-update/buy-lead-update.component';
import { BuyLeadApproveComponent } from './components/buy-lead-approve/buy-lead-approve.component';
import { AddPoComponent } from './components/add-po/add-po.component';
import { HomeComponent } from './components/home/home.component';
import { CreateQuotationComponent } from './components/create-quotation/create-quotation.component';
import { FollowUpComponent } from './components/follow-up/follow-up.component';
import { PendingPayOrderComponent } from './components/pending-pay-order/pending-pay-order.component';
import { GeneratePayOrderComponent } from './components/generate-pay-order/generate-pay-order.component';
import { ProcuralItemsComponent } from './components/procural-items/procural-items.component';
import { ProcurementTrackingComponent } from './components/procurement-tracking/procurement-tracking.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { CreateSupplierComponent } from './components/create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from './components/update-supplier/update-supplier.component';
import { CustomerReportComponent } from './components/customer-report/customer-report.component';
import { BlankHomePageComponent } from './components/blank-home-page/blank-home-page.component';
import { EditBuyLeadComponent } from './components/edit-buy-lead/edit-buy-lead.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const AppRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'createBuyLead', component: BuyLeadCreateComponent },
    { path: 'updateBuyLead', component: BuyLeadUpdateComponent },
    { path: 'approveBuyLead', component: BuyLeadApproveComponent },
    { path: 'addPO', component: AddPoComponent },
    { path: 'createQuotation', component: CreateQuotationComponent },
    { path: 'followUp', component: FollowUpComponent },
    { path: 'pendingPayOrder', component: PendingPayOrderComponent },
    { path: 'generatePayOrder', component: GeneratePayOrderComponent },
    { path: 'procuralItems', component: ProcuralItemsComponent },
    { path: 'procurementTracking', component: ProcurementTrackingComponent },
    { path: 'createUser', component: CreateUserComponent },
    { path: 'updateUser', component: UpdateUserComponent },
    { path: 'createSupplier', component: CreateSupplierComponent },
    { path: 'updateSupplier', component: UpdateSupplierComponent },
    { path: 'createCustomerReport', component: CustomerReportComponent },
    { path: 'blankHomePage', component: BlankHomePageComponent },
    { path: 'editBuyLead', component: EditBuyLeadComponent },
    { path: 'changePassword', component: ChangePasswordComponent }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
