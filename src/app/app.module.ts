import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ROUTING } from './app.routing';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.service';
import { BuyLeadService } from './services/buy-lead.service';
import { PayOrderService } from './services/pay-order.service';
import { ProcuralItemService } from './services/procural-item.service';
import { SupplierService } from './services/supplier.service';
import { BuyLeadCreateComponent } from './components/buy-lead-create/buy-lead-create.component';
import { BuyLeadApproveComponent } from './components/buy-lead-approve/buy-lead-approve.component';
import { BuyLeadUpdateComponent } from './components/buy-lead-update/buy-lead-update.component';
import { HeaderComponent } from './components/header/header.component';
import { StatusConstants } from './models/status-constants';
import { AddPoComponent } from './components/add-po/add-po.component';
import { UrlConstants } from './models/url-constants';
import { CreateQuotationComponent } from './components/create-quotation/create-quotation.component';
import { FollowUpComponent } from './components/follow-up/follow-up.component';
import { PendingPayOrderComponent } from './components/pending-pay-order/pending-pay-order.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { ProcuralItemsComponent } from './components/procural-items/procural-items.component';
import { CreateSupplierComponent } from './components/create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from './components/update-supplier/update-supplier.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ProcurementTrackingComponent } from './components/procurement-tracking/procurement-tracking.component';
import { GeneratePayOrderComponent } from './components/generate-pay-order/generate-pay-order.component';
import { CustomerReportComponent } from './components/customer-report/customer-report.component';
import { BlankHomePageComponent } from './components/blank-home-page/blank-home-page.component';
import { EditBuyLeadComponent } from './components/edit-buy-lead/edit-buy-lead.component';
import { UtilsService } from './services/utils.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ChartService } from './components/chart/chart.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BuyLeadCreateComponent,
    BuyLeadApproveComponent,
    BuyLeadUpdateComponent,
    HeaderComponent,
    AddPoComponent,
    CreateQuotationComponent,
    FollowUpComponent,
    PendingPayOrderComponent,
    ProcuralItemsComponent,
    CreateSupplierComponent,
    UpdateSupplierComponent,
    UpdateUserComponent,
    CreateUserComponent,
    ProcurementTrackingComponent,
    GeneratePayOrderComponent,
    CustomerReportComponent,
    BlankHomePageComponent,
    FilterDialogComponent,
    EditBuyLeadComponent,
    ChangePasswordComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    ROUTING,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [UserService, BuyLeadService, PayOrderService, UrlConstants, SupplierService, ProcuralItemService, UtilsService, ChartService],
  bootstrap: [AppComponent],
  entryComponents: [FilterDialogComponent, ConfirmDialogComponent]
})
export class AppModule { }
