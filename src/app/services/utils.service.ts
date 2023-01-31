import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class UtilsService {

  private token: string;
  private jsonHeader = new HttpHeaders().set('Content-Type', 'application/json');
  private formDataHeader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  constructor() { }

  setAuthenticationToken(token: string) {
    // console.log('setting token' + token);
    this.token = token;
    // this.jsonHeaderWithToken = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
  }

  getJsonHeader() {
    // if (this.jsonHeaderWithToken) {
    //   console.log('getting json header with token');
    //   return this.jsonHeaderWithToken;
    // } else {
    return this.jsonHeader;
    // }
  }

  getFormDataHeader() {
    return this.formDataHeader;
  }

  addTokenParam(paramsX: HttpParams) {
    if (paramsX) {
      return paramsX.set('token', this.token);
    } else {
      return new HttpParams().set('token', this.token);
    }
  }

  convertDateStringToDate(dateString: string): Date {
    console.log(dateString);
    // input: 2018-03-16 17:23:51
    const dateTimeSplits = dateString.split('T')[0];
    const dateSplits = dateTimeSplits.split('-');
    // console.log('date' + parseInt(dateSplits[2], 10) + ' ' + parseInt(dateSplits[1], 10) + ' ' + parseInt(dateSplits[0], 10));
    const resultDate = new Date();
    resultDate.setDate(parseInt(dateSplits[2], 10));
    resultDate.setMonth(parseInt(dateSplits[1], 10) - 1);
    resultDate.setFullYear(parseInt(dateSplits[0], 10));
    return resultDate;
  }

  // Output format: 2017-01-01T00:00:00.000
  getFormattedDate(dateInput: Date): string {
    const month = dateInput.getMonth() + 1;
    const date = dateInput.getDate();
    let monthString: string, dateString: string;
    if (month > 9) {
      monthString = month.toString();
    } else {
      monthString = '0' + month.toString();
    }
    if (date > 9) {
      dateString = date.toString();
    } else {
      dateString = '0' + date.toString();
    }
    return dateInput.getFullYear() + '-' + monthString + '-' + dateString + 'T00:00:00.000';
  }
}
