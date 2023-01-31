import { Component, ViewChild, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';

import { StatusConstants } from '../../models/status-constants';
import { BuyLeadService } from '../../services/buy-lead.service';
import { BankDetails } from '../../models/bank-details';
import { BuyLeadI } from '../../models/buy-lead-i';
import { QuotationRequest } from '../../models/quotation-request';
import { HttpResponse } from '@angular/common/http';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.css']
})
export class CreateQuotationComponent implements OnInit {
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custLocation', 'custPhone', 'custEmail', 'createdDate', 'shipping', 'term1',
    'term3', 'bankAccounts', 'generateQuotation'];
  buyLeadsI: BuyLeadI[];

  bankAccounts = [BankDetails.ICICI_CURRENT, BankDetails.ICICI_FOREX, BankDetails.CANARA_CURRENT, BankDetails.SBI_SUBSIDIARY];
  bankAccountsControl = new FormControl('', [Validators.required]);
  pageEvent: PageEvent;

  constructor(public snackBar: MatSnackBar, private buyLeadService: BuyLeadService, private utilsService: UtilsService) {
    this.buyLeadsI = [];
    this.pageEvent = new PageEvent;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 50;
    this.pageEvent.length = 5000;
  }

  ngOnInit() {
    this.getServerData(this.pageEvent);
  }

  getServerData(event?: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pageEvent = event;
    this.pageEvent.length = 100;
    this.buyLeadService.getBuyLeads3(StatusConstants.APPROVED_STATUS, pageNumber,
      event.pageSize).subscribe(buyLeadIResponse => {
        this.buyLeadsI = [];
        this.addCustomerDetails(buyLeadIResponse);
      },
        (data) => { this.serverError(data); });
  }

  addCustomerDetails(buyLeadsIResponse: BuyLeadI[]) {
    buyLeadsIResponse.forEach(e => {
      // console.log('adding buy lead' + e.custName);
      e.createdDateObject = this.utilsService.convertDateStringToDate(e.createdDate);
      this.buyLeadsI.push(e);
    });
    this.buyLeadDataSource = new MatTableDataSource<BuyLeadI>(this.buyLeadsI);
  }

  generateQuotation(buyLead: BuyLeadI) {
    if (!buyLead.bankAccount) {
      this.openSnackBar('Please select a Bank Account');
      return false;
    } else if (buyLead.shipping && !buyLead.shipping.match(/^\d+(.\d{2})?$/)) {
	  this.openSnackBar('Please enter valid Shipping');
      return false;
	}
    const quotationRequest: QuotationRequest = {} as QuotationRequest;
    quotationRequest.account = buyLead.bankAccount;
    quotationRequest.buyLeadId = buyLead.id.toString();
    quotationRequest.shipCost = buyLead.shipping;
    quotationRequest.terms1 = buyLead.term1;
    quotationRequest.terms3 = buyLead.term3;

    this.buyLeadService.generateQuotation(quotationRequest).subscribe(
      function (response) {
        this.downloadPDF(response);
        this.updateBuyLeadStatus(buyLead);
      }.bind(this),
      (data) => { this.serverError(data); }
    );
  }

  updateBuyLeadStatus(buyLead: BuyLeadI) {
    buyLead.status = StatusConstants.QUOTATION_GENERATED;
    this.buyLeadService.updateBuyLead(buyLead).subscribe(() => {
      this.getServerData(this.pageEvent);
    },
      (data) => { this.serverError(data); });
  }

  downloadPDF(success) {
//    console.log('header' + success.headers.get('content-disposition'));
    const filename = success.headers.get('content-disposition').split('"')[1];
    // console.log(filename);
    const blob = new Blob([success.body], { type: 'application/pdf' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Dismiss');
  }
}
