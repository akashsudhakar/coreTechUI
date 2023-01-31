import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { BuyLeadService } from '../../services/buy-lead.service';
import { PayOrderService } from '../../services/pay-order.service';
import { UserService } from '../../services/user.service';
import { SupplierService } from '../../services/supplier.service';
import { ProcuralItemI } from '../../models/procural-item-i';
import { Supplier } from '../../models/supplier';
import { StatusConstants } from '../../models/status-constants';
import { OrderStatus } from '../../models/order-status';
import { elementAttribute } from '@angular/core/src/render3/instructions';
import { ProcuralItemService } from '../../services/procural-item.service';
import { PayOrderStatus } from '../../models/pay-order-status';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-procural-items',
  templateUrl: './procural-items.component.html',
  styleUrls: ['./procural-items.component.css']
})
export class ProcuralItemsComponent implements OnInit {

  suppliers: Supplier[];
  procuralItems: ProcuralItemI[];
  orderStatuses = [PayOrderStatus.ORDERED, PayOrderStatus.TO_BE_ORDERED];
  itemsDataSource: MatTableDataSource<ProcuralItemI>;
  displayedItemsColumns = ['poNumber', 'customerName', 'itemName', 'quantity', 'rateinPO',
    'supplierName', 'purchaseRateUSD', 'purchaseRateINR', 'totalPurchaseRateInr', 'orderStatus', 'update', 'delete'];
  supplierSelected: Supplier;
  pageEvent: PageEvent;
  poNumberFilter: string;
  itemNameFilter: string;
  customerNameFilter: string;

  constructor(private supplierService: SupplierService, public snackBar: MatSnackBar, public dialog: MatDialog,
    private procuralItemService: ProcuralItemService, private payOrderService: PayOrderService, private userService: UserService) {
    this.suppliers = [];
    this.supplierSelected = {} as Supplier;
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

    this.supplierService.getSuppliers().subscribe(suppliersResponse => {
      this.addSuppliers(suppliersResponse);
    });
  }

  getServerData(event?: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pageEvent = event;
    this.pageEvent.length = 100;
    // this.payOrderService.getProcuralItems(OrderStatus.TO_BE_ORDERED, pageNumber,
    //   event.pageSize)
    this.procuralItemService.getProcuralItemsForStatuses([OrderStatus.TO_BE_ORDERED], this.poNumberFilter, this.itemNameFilter,
      this.customerNameFilter, pageNumber, event.pageSize).subscribe(procuralItemsResponse => {
        this.procuralItems = [];
        this.addProcuralItems(procuralItemsResponse);
      });
  }
  addSuppliers(suppliersResponse: Supplier[]) {
    this.suppliers = suppliersResponse;
  }

  addProcuralItems(procuralItemsResponse: ProcuralItemI[]) {
    procuralItemsResponse.forEach(e => {
      // console.log('adding buy lead' + e.itemName);
      e.totalPurchaseRateInr = parseFloat((e.purchaseRateINR * e.quantity).toFixed(2));
      this.procuralItems.push(e);
    });
    this.itemsDataSource = new MatTableDataSource<ProcuralItemI>(this.procuralItems);
  }

  update(element: ProcuralItemI) {
	this.payOrderService.updateProcuralItem(element).subscribe(response => {
      this.openSnackBar('Successfully updated');
      this.getServerData(this.pageEvent);
    }, errorData => {
      this.serverError(errorData);
    });
  }

  updateTotal(e: ProcuralItemI) {
    e.totalPurchaseRateInr = parseFloat((e.purchaseRateINR * e.quantity).toFixed(2));
  }

  delete(element: ProcuralItemI) {
    this.procuralItemService.deleteProcuralItem(element.id).subscribe(response => {
      this.openSnackBar('Successfully deleted');
      this.getServerData(this.pageEvent);
    }, errorData => {
      this.serverError(errorData);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        title: 'Procural Items Filter', poNumber: this.poNumberFilter, itemName: this.itemNameFilter,
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
