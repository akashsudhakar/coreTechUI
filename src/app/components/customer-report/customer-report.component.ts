import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, NgForm, Validators, ValidationErrors } from '@angular/forms';
import { BuyLeadService } from '../../services/buy-lead.service';
import { MatSnackBar, MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.css']
})
export class CustomerReportComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<Date>;
  @ViewChild('startDatePicker') startDatePicker: MatDatepicker<Date>;

  startDate: Date;
  endDate: Date;
  startDateFormControl = new FormControl(new Date(), [Validators.required]);
  endDateFormControl = new FormControl(new Date(), [Validators.required]);
  generateDisabled: boolean;

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.generateDisabled = false;
  }

  ngOnInit() {
  }

  getMaxEndDate(): Date {
    const maxEndDate = new Date(this.startDate);
    maxEndDate.setDate(this.startDate.getDate() + 90);
    return maxEndDate;
  }

  getMinStartDate(): Date {
    return this.startDate;
  }

  generateCustomerReport(generatePOForm: NgForm) {
    if (!this.startDateFormControl.valid || !this.endDateFormControl.valid) { return false; }
    if (this.generateDisabled) { return false; }

    this.generateDisabled = true;
    // const controlErrors: ValidationErrors = this.endDateFormControl.errors;
    // if (controlErrors != null) {
    //   Object.keys(controlErrors).forEach(keyError => {
    //     console.log(', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
    //   });
    // }
    this.buyLeadService.generateCustomerReport(this.startDate, this.endDate).subscribe(
      function (response) {
        this.downloadPDF(response);
      }.bind(this), errorData => {
        this.serverError(errorData);
      }
    );
    this.generateDisabled = false;
  }

  downloadPDF(success) {
    const filename = success.headers.get('content-disposition').split('"')[1];
    // console.log(filename);
    const blob = new Blob([success.body], { type: 'text/csv;charset=utf-8' });
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
  openStartDatePicker() {
    this.startDatePicker.open();
  }
  openEndDatePicker() {
    this.endDatePicker.open();
  }
}
