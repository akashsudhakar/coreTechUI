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
import { PayOrderStatus } from '../../models/pay-order-status';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.css']
})
export class FollowUpComponent implements OnInit {
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custEmail', 'custPhone', 'followUpCount', 'poNumber', 'update',
    'accept', 'reject'];
  buyLeadsI: BuyLeadI[];
  followUpCountControl = new FormControl('', [
    Validators.required, Validators.pattern('\\+?[0-9]*'), Validators.min(1), Validators.max(10)
  ]);
  quoteIdControl = new FormControl('', [Validators.required]);
  pageEvent: PageEvent;

  constructor(public snackBar: MatSnackBar, private buyLeadService: BuyLeadService) {
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
    this.buyLeadService.getBuyLeads3(StatusConstants.QUOTATION_GENERATED, pageNumber,
      event.pageSize).subscribe(buyLeadIResponse => {
        this.buyLeadsI = [];
        this.addCustomerDetails(buyLeadIResponse);
      });
  }

  addCustomerDetails(buyLeadsIResponse: BuyLeadI[]) {
    buyLeadsIResponse.forEach(e => {
      // console.log('adding buy lead' + e.custName);
      this.buyLeadsI.push(e);
    });
    this.buyLeadDataSource = new MatTableDataSource<BuyLeadI>(this.buyLeadsI);
  }

  accept(buyLead: BuyLeadI) {
    if (!buyLead.poNumber) {
      this.openSnackBar('Please enter PO number');
      return false;
    }

    buyLead.status = StatusConstants.ACCEPTED;
    for (const e of buyLead.buyLeadItems) {
      e.poStatus = PayOrderStatus.PENDING;
      e.poNumber = buyLead.poNumber;
      e.customerName = buyLead.custName;
    }
    this.buyLeadService.updateBuyLead(buyLead)
      .subscribe(
        (data) => {
          this.getServerData(this.pageEvent);
          this.openSnackBar('Successfully Approved');
        },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  reject(buyLead: BuyLeadI) {
    buyLead.status = StatusConstants.REJECTED;
    this.buyLeadService.updateBuyLead(buyLead)
      .subscribe(
        (data) => {
          this.getServerData(this.pageEvent);
          this.openSnackBar('Successfully Rejected');
        },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  update(buyLead: BuyLeadI) {
    if (buyLead.poNumber) {
      for (const item of buyLead.buyLeadItems) {
        item.poNumber = buyLead.poNumber;
        item.poStatus = PayOrderStatus.PENDING;
        item.customerName = buyLead.custName;
      }
    }
    this.buyLeadService.updateBuyLead(buyLead)
      .subscribe(
        (data) => {
          this.getServerData(this.pageEvent);
          this.openSnackBar('Successfully Updated');
        },
        (data) => { this.serverError(data); },
        () => { }
      );
  }
  serverError(data) {
    console.log('Error: ' + data);
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss');
  }
}
