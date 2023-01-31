import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource, PageEvent, ErrorStateMatcher, MatDatepicker } from '@angular/material';
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
import { FormControl, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { PayOrderStatus } from '../../models/pay-order-status';

@Component({
  selector: 'app-edit-buy-lead',
  templateUrl: './edit-buy-lead.component.html',
  styleUrls: ['./edit-buy-lead.component.css']
})
export class EditBuyLeadComponent implements OnInit {
  selectedTab: number;
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custLocation', 'custPhone', 'custEmail', 'companyName', 'createdDate', 'edit'];
  itemsDataSource: MatTableDataSource<BuyLeadItemsI>;
  displayedItemsColumns = ['itemName', 'partNumber', 'manufacturer', 'quantity', 'category', 'remarks', 'deliveryDate',
    'rate', 'iGST', 'cGST', 'sGST', 'total', 'delete'];
  buyLeadsI: BuyLeadI[];
  buyLeadBeingEdited: BuyLeadI;
  buyLeadIndexBeingEdited: number;
  pageEvent: PageEvent;
  statusesEditable = [StatusConstants.CREATED_STATUS, StatusConstants.APPROVED_STATUS, StatusConstants.RATEUPDATED_STATUS,
  StatusConstants.QUOTATION_GENERATED, StatusConstants.ACCEPTED, StatusConstants.REJECTED];
  // statusFormControl = new FormControl('', [Validators.required]);

  newBuyLeadItem: BuyLeadItemsI;
  addItemMatcher = new MyErrorStateMatcher();
  itemNameFormControl = new FormControl('', [Validators.required]);
  quantityFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  categoryFormControl = new FormControl('', [Validators.required]);
  remarksFormControl = new FormControl('');
  partNumberFormControl = new FormControl('');
  manufacturerFormControl = new FormControl('');

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar, private userService: UserService,
    private utilsService: UtilsService) {
    this.selectedTab = 0;
    this.buyLeadsI = [];
    this.buyLeadBeingEdited = {} as BuyLeadI;
    this.pageEvent = new PageEvent;
    this.newBuyLeadItem = {} as BuyLeadItemsI;
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
    this.buyLeadService.getBuyLeads4(this.statusesEditable, pageNumber,
      event.pageSize).subscribe(buyLeadIResponse => {
        this.buyLeadsI = [];
        this.addCustomerDetails(buyLeadIResponse);
      });
  }

  addCustomerDetails(buyLeadsIResponse: BuyLeadI[]) {
    buyLeadsIResponse.forEach(e => {
      if (e.createdDate) {
        e.createdDateObject = this.utilsService.convertDateStringToDate(e.createdDate);
      }
      this.buyLeadsI.push(e);
    });
    this.buyLeadDataSource = new MatTableDataSource<BuyLeadI>(this.buyLeadsI);
  }

  editBuyLead(buyLeadToEdit: BuyLeadI, rowIndex: number) {
    // console.log('rowindex' + rowIndex + this.buyLeadsI[rowIndex].custName);

    this.buyLeadBeingEdited = buyLeadToEdit;
    buyLeadToEdit.buyLeadItems.forEach(e => {
      if (e.deliveryDate) {
        e.deliveryDateObject = this.utilsService.convertDateStringToDate(e.deliveryDate);
      }
    });
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
	itemToChange.updatedBy = this.userService.getUserId();
	if (itemToChange.rate != undefined) {
		const total = itemToChange.quantityAsked * itemToChange.rate;
		itemToChange.total = total;
		if (itemToChange.iGST != undefined)
			itemToChange.total += total * itemToChange.iGST / 100;
		if (itemToChange.sGST != undefined)
			itemToChange.total += total * itemToChange.sGST / 100;
		if (itemToChange.cGST != undefined)
			itemToChange.total += total * itemToChange.cGST / 100;
		itemToChange.total = parseFloat(itemToChange.total.toFixed(2));
	}
  }

  updateBuyLead() {
    if (this.buyLeadBeingEdited.buyLeadItems.length === 0) {
      this.openSnackBar('Please add Items');
      return;
    }
    // if (!this.statusFormControl.valid) {
    //   return;
    // }
    if (this.buyLeadBeingEdited.status === StatusConstants.ACCEPTED) {
      if (this.buyLeadBeingEdited.poNumber) {
        for (const item of this.buyLeadBeingEdited.buyLeadItems) {
          item.poNumber = this.buyLeadBeingEdited.poNumber;
          item.poStatus = PayOrderStatus.PENDING;
          item.customerName = this.buyLeadBeingEdited.custName;
        }
      } else {
        this.openSnackBar('Please enter PO number');
        return;
      }
    }
    let updateItemError;
    this.buyLeadBeingEdited.buyLeadItems.forEach(e => {
	  if (e.deliveryDateObject != undefined)
		e.deliveryDate = this.utilsService.getFormattedDate(e.deliveryDateObject);
      if (!updateItemError && !e.id) {
        this.buyLeadService.addBuyLeadItem(e).subscribe(
          (data) => { },
          (data) => {
            console.log('error adding buy lead item');
            updateItemError = data;
          },
          () => { });
      } else {
        return;
      }
    });
    if (updateItemError) {
      console.log('Error adding buy lead items');
      this.serverError(updateItemError);
      return;
    }

    this.buyLeadService.updateBuyLead(this.buyLeadBeingEdited)
      .subscribe(
        (data) => { this.updateSuccess('Successfully Updated'); },
        (data) => { this.serverError(data); },
        () => { this.toggleTab(); }
      );
  }

  deleteBuyLeadItem(element: BuyLeadItemsI, cIndex) {
    if (element.id) {
      this.buyLeadService.deleteBuyLeadItem(element.id)
        .subscribe(
          (data) => { this.updateSuccess('Successfully Deleted'); },
          (data) => { this.serverError(data); },
          () => { this.toggleTab(); }
        );
    } else {
      for (let i = this.buyLeadBeingEdited.buyLeadItems.length - 1; i >= 0; i--) {
        if (this.buyLeadService.itemsAreEqual(this.buyLeadBeingEdited.buyLeadItems[i], element)) {
          this.buyLeadBeingEdited.buyLeadItems.splice(i, 1);
          // this.dataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadItems);
          break;
        }
      }
    }
  }

  deleteBuyLead() {
    this.buyLeadService.deleteBuyLead(this.buyLeadBeingEdited.id)
      .subscribe(
        (data) => { this.updateSuccess('Successfully Deleted'); },
        (data) => { this.serverError(data); },
        () => { this.toggleTab(); }
      );
  }

  updateSuccess(message: string) {
    this.getServerData(this.pageEvent);
    this.openSnackBar(message);
  }

  addNewItemDetails(form: NgForm) {
    if (!this.itemNameFormControl.valid || !this.quantityFormControl.valid) {
      return false;
    }
    if (!this.categoryFormControl.valid || !this.remarksFormControl.valid || !this.manufacturerFormControl.valid) {
      return false;
    }
    this.newBuyLeadItem.buyLeadId = this.buyLeadBeingEdited.id;
    this.newBuyLeadItem.createdBy = this.userService.getUserId();
    this.newBuyLeadItem.createdDate = this.utilsService.getFormattedDate(new Date());
    this.buyLeadBeingEdited.buyLeadItems.push(this.newBuyLeadItem);
    this.newBuyLeadItem = {} as BuyLeadItemsI;
    this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadBeingEdited.buyLeadItems);
    this.resetItemDetailValidators();
    form.resetForm();
  }

  resetItemDetailValidators() {
    this.itemNameFormControl.reset();
    this.quantityFormControl.reset();
    this.categoryFormControl.reset();
    this.remarksFormControl.reset();
    this.manufacturerFormControl.reset();
  }

  openDeliveryDatePicker(deliveryDatePick: MatDatepicker<Date>) {
    deliveryDatePick.open();
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
