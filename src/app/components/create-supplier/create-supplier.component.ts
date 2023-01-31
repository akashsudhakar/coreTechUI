import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { Supplier } from '../../models/supplier';
import { UserService } from '../../services/user.service';
import { SupplierService } from '../../services/supplier.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent implements OnInit {
  supplier: Supplier;
  createDisabled: boolean;

  supplierNameFormControl = new FormControl('', [Validators.required, Validators.maxLength(25)]);
  contactFormControl = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  matcher = new MyErrorStateMatcher();

  constructor(private userService: UserService, private supplierService: SupplierService, public snackBar: MatSnackBar) {
    this.supplier = {} as Supplier;
    this.createDisabled = false;
  }

  ngOnInit() {

  }
  createSupplier(createSupplierForm: NgForm) {
    this.createDisabled = true;
    if (this.supplierNameFormControl.valid && this.contactFormControl.valid) {
      this.supplier.createdBy = this.userService.getUserId();
      this.supplierService.addSupplier(this.supplier).subscribe(
        () => {
          this.success(createSupplierForm);
        },
        (data) => { this.serverError(data); },
        function () { this.createDisabled = false; }
      );
    }
  }

  success(createUserForm: NgForm) {
    this.openSnackBar('Supplier created');
    this.supplier = {} as Supplier;
    createUserForm.resetForm();
    this.supplierNameFormControl.reset();
    this.contactFormControl.reset();
  }

  serverError(data) {
    console.log(data);
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
