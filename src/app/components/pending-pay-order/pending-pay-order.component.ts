import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { MatTableDataSource, PageEvent, MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { BuyLeadService } from '../../services/buy-lead.service';
import { BuyLeadI } from '../../models/buy-lead-i';
import { BuyLeadItemsI } from '../../models/buy-lead-items-i';
import { StatusConstants } from '../../models/status-constants';
import { PayOrderStatus } from '../../models/pay-order-status';
import { StockStatus } from '../../models/stock-status';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-pending-pay-order',
  templateUrl: './pending-pay-order.component.html',
  styleUrls: ['./pending-pay-order.component.css']
})
export class PendingPayOrderComponent implements OnInit {
  @ViewChild(MatDatepicker) poDatePicker: MatDatepicker<Date>;

  poStatus = [PayOrderStatus.PARTIALLY_DISPATCHED, PayOrderStatus.PENDING, PayOrderStatus.FULLY_DISPATCHED,
  PayOrderStatus.ORDERED, PayOrderStatus.TO_BE_ORDERED, PayOrderStatus.IN_TRANSIT,
  PayOrderStatus.AT_CUSTOMS, PayOrderStatus.CUSTOMS_CLEARED, PayOrderStatus.ARRIVED_AT_STORE];

  poStatusesToFetch = [PayOrderStatus.PARTIALLY_DISPATCHED, PayOrderStatus.PENDING,
  PayOrderStatus.ORDERED, PayOrderStatus.TO_BE_ORDERED, PayOrderStatus.IN_TRANSIT,
  PayOrderStatus.AT_CUSTOMS, PayOrderStatus.CUSTOMS_CLEARED, PayOrderStatus.ARRIVED_AT_STORE];

  stockStatus = [StockStatus.IN_STOCK, StockStatus.OUT_OF_STOCK];
  displayedItemsColumns = ['poNumber', 'poDate', 'itemName', 'quantity', 'quantitySend', 'rate',
    'customerName', 'stockAvailable', 'stockToBeProcured', 'stockStatus', 'poStatus', 'dispatchCourier',
    'lrNumber', 'poRemarks', 'update'];
  buyLeadsI: BuyLeadI[];
  buyLeadItems: BuyLeadItemsI[];
  itemsDataSource: MatTableDataSource<BuyLeadItemsI>;
  pageEvent: PageEvent;
  poNumberFilter: string;
  itemNameFilter: string;
  customerNameFilter: string;

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar, public dialog: MatDialog) {
    this.buyLeadsI = [];
    this.buyLeadItems = [];
    this.pageEvent = new PageEvent;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 50;
    this.pageEvent.length = 5000;
    this.poNumberFilter = '';
    this.itemNameFilter = '';
    this.customerNameFilter = '';

  }

  ngOnInit() {
    this.getServerData(this.pageEvent);
  }

  getServerData(event?: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pageEvent = event;
    // this.pageEvent.length = 100;
    this.buyLeadService.getBuyLeadsItemsWithPendingPOFilter(this.poStatusesToFetch, this.poNumberFilter, this.itemNameFilter,
      this.customerNameFilter, pageNumber, event.pageSize)
      .subscribe(buyLeadIResponse => {
        this.buyLeadsI = [];
        this.buyLeadItems = [];
        this.addItemDetails(buyLeadIResponse);
      });
  }

  addItemDetails(buyLeadsIResponse: BuyLeadItemsI[]) {
    buyLeadsIResponse.forEach(e => {
      console.log(e.itemName + e.quantitySend);
      e.quantitySendOriginal = e.quantitySend;
      this.updateToProcure(e);
      this.buyLeadItems.push(e);
    });
    this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadItems);
  }

  update(element: BuyLeadItemsI) {
    if (element.poStatus === PayOrderStatus.PARTIALLY_DISPATCHED) {
      console.log('original ' + element.quantitySendOriginal + ' ' + element.quantitySend);
      if (element.quantitySend <= 0) {
        this.openSnackBar('Please enter quantity sent');
        return;
      } else if (element.quantitySendOriginal && element.quantitySendOriginal > element.quantitySend) {
        this.openSnackBar('Quantity sent should be more than previous value');
        return;
      } else if (element.quantitySend >= element.quantityAsked) {
        this.openSnackBar('Quantity sent exceeds required quantity');
        return;
      }
    } else if (element.quantitySendOriginal != element.quantitySend
	  && element.quantitySend > 0 && element.quantitySend !== element.quantityAsked
      && element.poStatus !== PayOrderStatus.PARTIALLY_DISPATCHED) {
        this.openSnackBar('PO Status should be partially dispatched');
        return;
    }
    this.buyLeadService.updateBuyLeadItem(element).subscribe(response => {
      this.openSnackBar(response.toString());
      this.getServerData(this.pageEvent);
    }, errorData => {
      this.serverError(errorData);
    });
  }

  updateToProcure(element: BuyLeadItemsI) {
    const stockToBeProcured = element.quantityAsked - element.stockAvailable;
    if (stockToBeProcured >= 0) {
      element.stockToBeProcured = stockToBeProcured;
    } else {
      element.stockToBeProcured = 0;
    }
  }

  openPODatePicker() {
    this.poDatePicker.open();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        title: 'Pending PO Filter', poNumber: this.poNumberFilter, itemName: this.itemNameFilter,
        customerName: this.customerNameFilter
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.poNumberFilter = result.poNumber;
        this.itemNameFilter = result.itemName;
        this.customerNameFilter = result.customerName;
        this.getServerData(this.pageEvent);
      }
    });
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }

}
