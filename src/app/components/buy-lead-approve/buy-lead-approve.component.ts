import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
// import { deserialize } from 'json-typescript-mapper';
// import { DataSource } from '@angular/cdk/table';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

import { BuyLeadService } from '../../services/buy-lead.service';
import { BuyLeadI } from '../../models/buy-lead-i';
import { BuyLeadItemsI } from '../../models/buy-lead-items-i';
import { StatusConstants } from '../../models/status-constants';
import { UtilsService } from '../../services/utils.service';
// import { elementAttribute } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-buy-lead-approve',
  templateUrl: './buy-lead-approve.component.html',
  styleUrls: ['./buy-lead-approve.component.css']
})
export class BuyLeadApproveComponent implements OnInit {
  selectedTab: number;
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custLocation', 'custPhone', 'custEmail', 'companyName', 'createdDate', 'approve'];
  itemsDataSource: MatTableDataSource<BuyLeadItemsI>;
  displayedItemsColumns = ['itemName', 'quantity', 'quantitySend', 'category', 'remarks', 'rate', 'iGST', 'cGST', 'sGST', 'total'];
  buyLeadsI: BuyLeadI[];
  buyLeadSelected: BuyLeadI;
  pageEvent: PageEvent;

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar, private utilsService: UtilsService) {
    this.selectedTab = 0;
    this.buyLeadsI = [];
    this.buyLeadSelected = {} as BuyLeadI;
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
    this.buyLeadService.getBuyLeads3(StatusConstants.RATEUPDATED_STATUS, pageNumber,
      event.pageSize).subscribe(buyLeadIResponse => {
        this.buyLeadsI = [];
        this.addCustomerDetails(buyLeadIResponse);
      });
  }

  addCustomerDetails(buyLeadsIResponse: BuyLeadI[]) {
    buyLeadsIResponse.forEach(e => {
      e.createdDateObject = this.utilsService.convertDateStringToDate(e.createdDate);
      this.buyLeadsI.push(e);
    });
    this.buyLeadDataSource = new MatTableDataSource<BuyLeadI>(this.buyLeadsI);
  }

  editBuyLead(elementSelected: BuyLeadI) {
    // console.log('Edit buy lead' + JSON.stringify(elementSelected));
    this.buyLeadSelected = elementSelected;
    this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(elementSelected.buyLeadItems);
    this.toggleTab();
  }

  approveBuyLead() {
    this.buyLeadService.approveBuyLead(this.buyLeadSelected)
      .subscribe(
        (data) => {
          this.getServerData(this.pageEvent);
          this.approveSuccess(data);
        },
        (data) => { this.serverError(data); },
        () => { this.toggleTab(); }
      );
  }

  toggleTab() {
    this.selectedTab += 1;
    if (this.selectedTab >= 2) {
      this.selectedTab = 0;
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
  }

  approveSuccess(data) {
    this.openSnackBar('Successfully Approved');
  }
  serverError(data) {
    console.log('Error: ' + data);
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
