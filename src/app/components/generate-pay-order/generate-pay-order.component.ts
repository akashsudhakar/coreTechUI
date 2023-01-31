import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';

import { SupplierService } from '../../services/supplier.service';
import { PayOrderService } from '../../services/pay-order.service';
import { Supplier } from '../../models/supplier';

@Component({
  selector: 'app-generate-pay-order',
  templateUrl: './generate-pay-order.component.html',
  styleUrls: ['./generate-pay-order.component.css']
})
export class GeneratePayOrderComponent implements OnInit {
  suppliers: Supplier[];
  selectedSupplier: Supplier;
  generateDisabled: boolean;
  shipping: string;
  pAndF: string;

  generatePOMatcher = new MyErrorStateMatcher();
  shippingFormControl = new FormControl('', [Validators.pattern('^\\d+(.\\d{2})?$')]);
  pAndFFormControl = new FormControl('', [Validators.pattern('^\\d+(.\\d{2})?$')]);
  supplierFormControl = new FormControl('', [Validators.required]);

  constructor(private supplierService: SupplierService, private payOrderService: PayOrderService,
    public snackBar: MatSnackBar) {
    this.suppliers = [];
    this.generateDisabled = false;
    this.shipping = '';
    this.pAndF = '';
    this.selectedSupplier = {} as Supplier;
  }

  ngOnInit() {
    this.supplierService.getSuppliers().subscribe(suppliersResponse => {
      this.addSuppliers(suppliersResponse);
    });
  }

  addSuppliers(suppliersResponse: Supplier[]) {
    console.log('count' + this.suppliers.length);
    this.suppliers = suppliersResponse;
  }

  generatePO(generatePOForm: NgForm) {
    if (this.generateDisabled) { return false; }
    if (!this.pAndFFormControl.valid || !this.shippingFormControl.valid || !this.supplierFormControl.valid) {
      return false;
    }

    this.generateDisabled = true;
    console.log('generatePO' + this.selectedSupplier.supplierName + this.pAndF +
      this.shipping + generatePOForm.valid);
    this.payOrderService.generatePOReport(this.selectedSupplier.supplierName, this.shipping, this.pAndF).subscribe(
      function (response) {
        this.downloadPDF(response);
      }.bind(this),
      (data) => { this.serverError(data); },
      () => { this.generateDisabled = false; }
    );
  }

  downloadPDF(success) {
    // console.log('header' + success.headers.get('content-disposition'));
    const filename = success.headers.get('content-disposition').split('"')[1];
    // console.log(filename);
    const blob = new Blob([success.body], { type: 'application/vnd.ms-excel' });
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
