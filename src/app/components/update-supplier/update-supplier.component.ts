import { Component, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css']
})
export class UpdateSupplierComponent implements OnInit {
  itemsDataSource: MatTableDataSource<Supplier>;
  displayedItemsColumns = ['supplierName', 'contact', 'update', 'delete'];
  pageEvent: PageEvent;
  suppliers: Supplier[];
  constructor(public snackBar: MatSnackBar, private supplierService: SupplierService) {
    this.pageEvent = new PageEvent;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 50;
    this.pageEvent.length = 5000;
    this.suppliers = [];
  }

  ngOnInit() {
    this.getServerData(this.pageEvent);
  }

  getServerData(event?: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pageEvent = event;
    this.pageEvent.length = 100;
    this.supplierService.getSuppliersPaginated(pageNumber, event.pageSize).subscribe(response => {
      this.suppliers = [];
      this.addSupplierDetails(response);
    });
  }

  addSupplierDetails(suppliersResponse: Supplier[]) {
    suppliersResponse.forEach(e => {
      this.suppliers.push(e);
    });
    this.itemsDataSource = new MatTableDataSource<Supplier>(this.suppliers);
  }

  update(supplierBeingEdited: Supplier) {
    this.supplierService.updateSupplier(supplierBeingEdited)
      .subscribe(
        (data) => { this.updateSuccess('Successfully Updated'); },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  deleteSupplier(supplierBeingEdited: Supplier) {
    this.supplierService.deleteSupplier(supplierBeingEdited.id)
      .subscribe(
        (data) => { this.updateSuccess(supplierBeingEdited.supplierName + ' Successfully Deleted'); },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  updateSuccess(data: string) {
    this.getServerData(this.pageEvent);
    this.openSnackBar(data);
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
