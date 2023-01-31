import { Component, OnInit, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatDatepicker, MatDialog } from '@angular/material';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { BuyLeadService } from '../../services/buy-lead.service';
import { BuyLeadI } from '../../models/buy-lead-i';
import { BuyLeadItemsI } from '../../models/buy-lead-items-i';
import { UserI } from '../../models/user-i';
import { StatusConstants } from '../../models/status-constants';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-buy-lead-create',
  templateUrl: './buy-lead-create.component.html',
  styleUrls: ['./buy-lead-create.component.css']
})
export class BuyLeadCreateComponent implements OnInit {
  buyLead: BuyLeadI;
  buyLeadItems: BuyLeadItemsI[];
  newBuyLeadItem: BuyLeadItemsI;
  createDisabled = false;
  displayedColumns = ['itemName', 'partNumber', 'manufacturer', 'quantity', 'category', 'remarks', 'remove'];
  dataSource: MatTableDataSource<BuyLeadItemsI>;
  containsItems: boolean;

  matcher = new MyErrorStateMatcher();
  customerNameValidator = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  companyNameValidator = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  postalAddressValidator = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  customerLocationValidator = new FormControl('', [Validators.required, Validators.maxLength(40)]);
  customerPhoneValidator = new FormControl('', [
    Validators.required, Validators.pattern('\\+?[0-9, \\+]*'), Validators.minLength(10), Validators.maxLength(25)
  ]);
  customerEmailValidator = new FormControl('', [
    Validators.required, Validators.maxLength(60),
    // tslint:disable-next-line:max-line-length
    Validators.pattern('(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))')
  ]);

  addItemMatcher = new MyErrorStateMatcher();
  itemNameFormControl = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  quantityFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  categoryFormControl = new FormControl('', [Validators.required, Validators.maxLength(30)]);
  remarksFormControl = new FormControl('', [Validators.maxLength(100)]);
  partNumberFormControl = new FormControl('', [Validators.maxLength(30)]);
  manufacturerFormControl = new FormControl('', [Validators.maxLength(30)]);

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar,
    private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.buyLeadItems = [];
    this.buyLead = {} as BuyLeadI;
    this.newBuyLeadItem = {} as BuyLeadItemsI;
    this.containsItems = false;
  }
  createBuyLead(createBuyLeadForm: NgForm) {
    if (this.createDisabled) {
      return false;
    }
    if (this.customerLocationValidator.valid && this.customerNameValidator.valid && this.companyNameValidator.valid) {
      if (this.customerPhoneValidator.valid && this.customerEmailValidator.valid && this.postalAddressValidator.valid) {
        if (this.buyLeadItems.length > 0) {
          this.createDisabled = true;
          this.buyLead.buyLeadItems = this.buyLeadItems;
          this.buyLeadService.createBuyLead(this.buyLead).subscribe(
            () => { this.success(createBuyLeadForm); },
            (data) => { this.serverError(data); this.createDisabled = false; },
            () => {
              this.createDisabled = false;
              this.resetCustomerDetailsValidators();
            });
        } else {
          this.openSnackBar('Please add Items');
          this.itemNameFormControl.markAsDirty();
          this.quantityFormControl.markAsDirty();
          this.categoryFormControl.markAsDirty();
          this.remarksFormControl.markAsDirty();
          this.manufacturerFormControl.markAsDirty();
        }
      }
    }
  }
  clear() {
    this.buyLeadItems = [];
    this.buyLead = {} as BuyLeadI;
    this.newBuyLeadItem = {} as BuyLeadItemsI;
    this.containsItems = false;
  }
  addNewItemDetails(form: NgForm) {
    if (!this.itemNameFormControl.valid || !this.quantityFormControl.valid) {
      return false;
    }
    if (!this.categoryFormControl.valid || !this.remarksFormControl.valid || !this.manufacturerFormControl.valid) {
      return false;
    }
    this.buyLeadItems.push(this.newBuyLeadItem);
    this.containsItems = true;
    this.newBuyLeadItem = {} as BuyLeadItemsI;
    this.dataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadItems);
    this.resetItemDetailValidators();
    form.resetForm();
  }
  onFileInput(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.openDialog(file);
    }
  }

  uploadCsv(file: File) {
    this.buyLeadService.uploadBuyLeadCsv(file).subscribe(
      () => { this.openSnackBar('Successfully uploaded'); },
      (data) => { this.serverError(data); },
      () => { });
  }

  openDialog(file: File): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'Please confirm to upload CSV', buttonText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadCsv(file);
      }
    });
  }

  removeItem(element: BuyLeadItemsI) {
    for (let i = this.buyLeadItems.length - 1; i >= 0; i--) {
      if (this.buyLeadService.itemsAreEqual(this.buyLeadItems[i], element)) {
        this.buyLeadItems.splice(i, 1);
        this.dataSource = new MatTableDataSource<BuyLeadItemsI>(this.buyLeadItems);
        break;
      }
    }
    if (this.buyLeadItems.length === 0) {
      this.containsItems = false;
    }
  }

  success(createBuyLeadForm: NgForm) {
    this.buyLeadItems = [];
    this.buyLead = {} as BuyLeadI;
    this.newBuyLeadItem = {} as BuyLeadItemsI;
    this.containsItems = false;
    this.openSnackBar('Successfully created');
    createBuyLeadForm.resetForm();
  }
  serverError(data) {
    console.log('Error ' + JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Dismiss');
  }

  resetCustomerDetailsValidators() {
    this.customerLocationValidator.reset();
    this.customerNameValidator.reset();
    this.companyNameValidator.reset();
    this.postalAddressValidator.reset();
    this.customerPhoneValidator.reset();
    this.customerEmailValidator.reset();
  }
  resetItemDetailValidators() {
    this.itemNameFormControl.reset();
    this.quantityFormControl.reset();
    this.categoryFormControl.reset();
    this.remarksFormControl.reset();
    this.manufacturerFormControl.reset();
  }
}
