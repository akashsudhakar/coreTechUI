import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

import { BuyLeadI } from '../models/buy-lead-i';
import { UrlConstants } from '../models/url-constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BuyLeadItemsI } from '../models/buy-lead-items-i';
import { UserService } from './user.service';
import { StatusConstants } from '../models/status-constants';
import { BankDetails } from '../models/bank-details';
import { QuotationRequest } from '../models/quotation-request';
import { PayOrderStatus } from '../models/pay-order-status';
import { UtilsService } from './utils.service';

@Injectable()
export class BuyLeadService {
  public redirectUrl: string;
  private router: Router;

  constructor(private http: HttpClient, private utilsService: UtilsService, private userService: UserService) { }

  getBuyLeads(): Observable<JSON> {
    const paramsX = this.utilsService.addTokenParam(null);
    return this.http
      .get<JSON>(UrlConstants.getBuyLead, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX,
        responseType: 'json'
      });
  }

  generateCustomerReport(from: Date, to: Date): Observable<Object> {
    // ?from=2017-01-01T00:00:00.000&to=2017-01-01T00:00:00.000
    const fromDateFormatted = from.toISOString().substr(0, 10) + 'T00:00:00.000';;
    const toDateFormatted = to.toISOString().substr(0, 10) + 'T23:59:59.999';;
    let paramsX = new HttpParams().set('from', fromDateFormatted).set('to', toDateFormatted);
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http
      .get(UrlConstants.generateCustomerReport, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        observe: 'response',
        responseType: 'blob'
      });
  }

  generateQuotation(buyLead: QuotationRequest): Observable<Object> {
    const body = JSON.stringify(buyLead);
    console.log('generateQuotation' + body);
    const paramsX = this.utilsService.addTokenParam(null);
    return this.http
      .post(UrlConstants.generateQuotation, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX,
        observe: 'response',
        responseType: 'blob'
      });
  }

  getBuyLeads2(status: string): Observable<BuyLeadI[]> {
    let paramsX = new HttpParams().set('status', status);
    paramsX = this.utilsService.addTokenParam(paramsX);
    return this.http
      .get<BuyLeadI[]>(UrlConstants.getBuyLead, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  getBuyLeads3(status: string, pageNo: number, pageSize: number): Observable<BuyLeadI[]> {
    let paramsX = new HttpParams().set('status', status).set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http
      .get<BuyLeadI[]>(UrlConstants.getBuyLead, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  getBuyLeads4(status: string[], pageNo: number, pageSize: number): Observable<BuyLeadI[]> {
    let paramsX = new HttpParams().set('status', status.join(',')).set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http
      .get<BuyLeadI[]>(UrlConstants.getBuyLead, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  getBuyLeadsItems(status: string[], pageNo: number, pageSize: number): Observable<BuyLeadItemsI[]> {
    let paramsX = new HttpParams().set('status', status.join(',')).set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http
      .get<BuyLeadItemsI[]>(UrlConstants.getBuyLeaditems, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  getBuyLeadsItemsWithPendingPOFilter(status: string[], poNumber: string, itemName: string, customerName: string,
    pageNo: number, pageSize: number): Observable<BuyLeadItemsI[]> {
    console.log('params ini' + poNumber + itemName + customerName);
    let paramsX = new HttpParams().set('status', status.join(',')).set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    if (poNumber) { paramsX = paramsX.set('poNumber', poNumber); }
    if (itemName) { paramsX = paramsX.set('itemName', itemName); }
    if (customerName) { paramsX = paramsX.set('customerName', customerName); }
    console.log('params ' + paramsX.toString());
    return this.http
      .get<BuyLeadItemsI[]>(UrlConstants.getBuyLeaditems, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }

  updateBuyLead(buyLead: BuyLeadI): Observable<Object> {
    buyLead.updatedBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(buyLead);
    // console.log('updating buy lead' + body);
    return this.http.put(UrlConstants.updateBuyLead, body, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX
    });
  }

  updateBuyLeadItem(buyLeadItem: BuyLeadItemsI): Observable<Object> {
    buyLeadItem.updatedBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(buyLeadItem);
    console.log('updating buy lead item' + body);
    return this.http.put(UrlConstants.updateBuyLeadItem, body, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX,
      responseType: 'text'
    });
  }
  deleteBuyLeadItem(buyLeadItemId: number): Observable<Object> {
    let paramsX = new HttpParams().set('id', buyLeadItemId.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('deleting buy lead item' + buyLeadItemId);
    return this.http.delete(UrlConstants.deleteBuyLeadItem, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX,
      responseType: 'text'
    });
  }
  deleteBuyLead(buyLeadId: number): Observable<Object> {
    let paramsX = new HttpParams().set('id', buyLeadId.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('deleting buy lead ' + buyLeadId);
    return this.http.delete(UrlConstants.deleteBuyLead, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX,
      responseType: 'text'
    });
  }
  addBuyLeadItem(buyLeadItem: BuyLeadItemsI): Observable<Object> {
    buyLeadItem.createdBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(buyLeadItem);
    console.log('adding buy lead item' + body);
    return this.http.post(UrlConstants.addBuyLeadItem, body, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX
    });
  }

  createBuyLead(buyLead: BuyLeadI): Observable<Object> {
    buyLead.createdBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(buyLead);
    console.log('creating buy lead ' + body);
    return this.http
      .post(UrlConstants.createBuyLead, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  approveBuyLead(buyLead: BuyLeadI): Observable<Object> {
    buyLead.updatedBy = this.userService.getUserId();
    buyLead.status = StatusConstants.APPROVED_STATUS;
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(buyLead);
    console.log('approvng' + body + buyLead.status);
    return this.http
      .put(UrlConstants.updateBuyLead, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  public itemsAreEqual(item1: BuyLeadItemsI, item2: BuyLeadItemsI): boolean {
    if (item1.category === item2.category && item1.itemName === item2.itemName
      && item1.quantityAsked === item2.quantityAsked && item1.remarks === item2.remarks
      && item1.manufacturer === item2.manufacturer && item1.partNumber === item2.partNumber) {
      return true;
    }
    return false;
  }

  uploadBuyLeadCsv(file: File): Observable<Object> {
    let paramsX = new HttpParams().set('userId', this.userService.getUserId().toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log('uploading csv ' + file.name);
    return this.http
      .post(UrlConstants.uploadBuyLeadCsv, formData, {
        // headers: this.utilsService.getFormDataHeader(),
        params: paramsX,
        responseType: 'text'
      });
  }
}
