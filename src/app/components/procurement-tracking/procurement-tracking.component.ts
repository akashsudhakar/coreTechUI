import { Component, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent, MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { ProcuralItemI } from '../../models/procural-item-i';
import { PayOrderService } from '../../services/pay-order.service';
import { UserService } from '../../services/user.service';
import { OrderStatus } from '../../models/order-status';
import { PayOrderStatus } from '../../models/pay-order-status';
import { ProcuralItemService } from '../../services/procural-item.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-procurement-tracking',
  templateUrl: './procurement-tracking.component.html',
  styleUrls: ['./procurement-tracking.component.css']
})
export class ProcurementTrackingComponent implements OnInit {
  // itemName,quantity, rateinPO, amount?, igst, customDuty, courierName,   trackingId, supplierName, customerName, status

  itemsDataSource: MatTableDataSource<ProcuralItemI>;
  displayedItemsColumns = ['itemName', 'quantity', 'rateinPO', 'amount', 'igst', 'customDuty', 'courierName',
    'trackingId', 'supplierName', 'customerName', 'status', 'update'];
  procuralItems: ProcuralItemI[];
  pageEvent: PageEvent;
  orderStatuses = [PayOrderStatus.ORDERED, PayOrderStatus.IN_TRANSIT, PayOrderStatus.AT_CUSTOMS,
  PayOrderStatus.CUSTOMS_CLEARED, PayOrderStatus.ARRIVED_AT_STORE];
  poNumberFilter: string;
  itemNameFilter: string;
  customerNameFilter: string;

  constructor(public snackBar: MatSnackBar, private payOrderService: PayOrderService, private userService: UserService
    , private procuralItemService: ProcuralItemService, public dialog: MatDialog) {
    this.procuralItems = [];
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
    this.pageEvent.length = 100;
    this.procuralItemService.getProcuralItemsForStatuses(this.orderStatuses, this.poNumberFilter, this.itemNameFilter,
      this.customerNameFilter, pageNumber,
      event.pageSize).subscribe(procuralItemsResponse => {
        this.procuralItems = [];
        this.addProcuralItems(procuralItemsResponse);
      });
  }
  addProcuralItems(procuralItemsResponse: ProcuralItemI[]) {
    procuralItemsResponse.forEach(e => {
      console.log('adding buy lead' + e.itemName + e.supplierName);

      e.totalPurchaseRateInr = e.purchaseRateINR * e.quantity;
      this.procuralItems.push(e);
    });
    this.itemsDataSource = new MatTableDataSource<ProcuralItemI>(this.procuralItems);
  }

  update(element: ProcuralItemI) {
	if (element.igst && !element.igst.match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please provide valid IGST value');
		return false;
	} else if (element.customDuty && !element.customDuty.match(/^\d+(.\d{2})?$/)) {
		this.openSnackBar('Please provide valid Custom Duty value');
		return false;
	}
    this.payOrderService.updateProcuralItem(element).subscribe(response => {
      this.openSnackBar('Successfully updated');
      this.getServerData(this.pageEvent);
    }, errorData => {
      this.serverError(errorData);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        title: 'Procurement Tracking Filter', poNumber: this.poNumberFilter, itemName: this.itemNameFilter,
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
