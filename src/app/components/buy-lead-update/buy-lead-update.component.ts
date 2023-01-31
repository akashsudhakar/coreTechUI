import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent, MatDatepicker } from '@angular/material';
import { MatTab } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
// import { deserialize } from 'json-typescript-mapper';

import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

import { BuyLeadService } from '../../services/buy-lead.service';
import { BuyLeadI } from '../../models/buy-lead-i';
import { BuyLeadItemsI } from '../../models/buy-lead-items-i';
import { UserI } from '../../models/user-i';
import { StatusConstants } from '../../models/status-constants';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-buy-lead-update',
  templateUrl: './buy-lead-update.component.html',
  styleUrls: ['./buy-lead-update.component.css']
})
export class BuyLeadUpdateComponent implements OnInit {
  @ViewChild(MatDatepicker) deliveryDatePicker: MatDatepicker<Date>;
  selectedTab: number;
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custLocation', 'custPhone', 'custEmail', 'companyName', 'createdDate', 'edit'];
  itemsDataSource: MatTableDataSource<BuyLeadItemsI>;
  displayedItemsColumns = ['itemName', 'partNumber', 'manufacturer', 'quantity',
    'category', 'remarks', 'deliveryDate', 'rate', 'iGST', 'cGST', 'sGST', 'total'];
  buyLeadsI: BuyLeadI[];
  buyLeadBeingEdited: BuyLeadI;
  buyLeadIndexBeingEdited: number;
  pageEvent: PageEvent;

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar, private userService: UserService,
    private utilsService: UtilsService) {
    this.selectedTab = 0;
    this.buyLeadsI = [];
    this.buyLeadBeingEdited = {} as BuyLeadI;
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
    this.buyLeadService.getBuyLeads3(StatusConstants.CREATED_STATUS, pageNumber,
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

  editBuyLead(buyLeadToEdit: BuyLeadI, rowIndex: number) {
    // console.log('rowindex' + rowIndex + this.buyLeadsI[rowIndex].custName);

    this.buyLeadBeingEdited = buyLeadToEdit;
    this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(buyLeadToEdit.buyLeadItems);
    this.toggleTab();
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

  updateTotal(itemToChange: BuyLeadItemsI) {
    const total = itemToChange.quantityAsked * itemToChange.rate;
    itemToChange.total = total;
    itemToChange.total += total * itemToChange.iGST / 100;
    itemToChange.total += total * itemToChange.sGST / 100;
    itemToChange.total += total * itemToChange.cGST / 100;
    itemToChange.total = parseFloat(itemToChange.total.toFixed(2));
    itemToChange.updatedBy = this.userService.getUserId();
  }
//yyyy-MM-dd HH:mm:ss
  updateBuyLead() {
    this.buyLeadBeingEdited.status = StatusConstants.RATEUPDATED_STATUS;
    let valid = true;
    this.buyLeadBeingEdited.buyLeadItems.forEach(e => {
      if (!e.deliveryDate) {
        this.openSnackBar('Please enter delivery date');
        valid = false;
      } else if (!e.rate) {
		this.openSnackBar('Please enter Rate');
        valid = false;  
	  } else if (!e.rate.toString().match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please enter valid Rate');
        valid = false;  
	  } else if (!e.iGST) {
		this.openSnackBar('Please enter IGST');
        valid = false;  
	  } else if (!e.iGST.toString().match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please enter valid IGST');
        valid = false;  
	  }  else if (!e.cGST) {
		this.openSnackBar('Please enter CGST');
        valid = false;  
	  } else if (!e.cGST.toString().match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please enter valid CGST');
        valid = false;  
	  }  else if (!e.sGST) {
		this.openSnackBar('Please enter SGST');
        valid = false;  
	  } else if (!e.sGST.toString().match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please enter valid SGST');
        valid = false;  
	  } else {
		const dateTimeMillis: Date = new Date(e.deliveryDate);
		e.deliveryDate = this.utilsService.getFormattedDate(dateTimeMillis);  
      }
    });
    if (!valid) { 
		this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadBeingEdited.buyLeadItems);
		return; 
	}
    this.buyLeadService.updateBuyLead(this.buyLeadBeingEdited)
      .subscribe(
        (data) => { this.updateSuccess(data); },
        (data) => { this.serverError(data); },
        () => { this.toggleTab(); }
      );
  }

  updateSuccess(data) {
    this.getServerData(this.pageEvent);
    this.openSnackBar('Successfully Updated');
  }
  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }

  openDeliveryDatePicker(deliveryDatePick: MatDatepicker<Date>) {
    deliveryDatePick.open();
  }
}