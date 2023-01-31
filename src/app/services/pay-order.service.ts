import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UrlConstants } from '../models/url-constants';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import { ProcuralItemI } from '../models/procural-item-i';
import { UserService } from './user.service';
import { StatusConstants } from '../models/status-constants';
import { UtilsService } from './utils.service';

@Injectable()
export class PayOrderService {

  constructor(private http: HttpClient, private utilsService: UtilsService, private userService: UserService) {
  }

  getProcuralItems(status: string, pageNo: number, pageSize: number): Observable<ProcuralItemI[]> {
    let paramsX = new HttpParams().set('status', status).set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    return this.http
      .get<ProcuralItemI[]>(UrlConstants.getProcuralItem, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  getProcuralItemsForStatuses(status: string[], pageNo: number, pageSize: number): Observable<ProcuralItemI[]> {
    let paramsX = new HttpParams().set('status', status.join(',')).set('pageNo',
      pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    return this.http
      .get<ProcuralItemI[]>(UrlConstants.getProcuralItem, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
  updateProcuralItem(procuralItem: ProcuralItemI): Observable<Object> {
    procuralItem.updatedBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    const body = JSON.stringify(procuralItem);
    return this.http.put(UrlConstants.updateProcuralItem, body, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX,
      responseType: 'json'
    });
  }

  addProcuralItems(procuralItem: ProcuralItemI[]): Observable<Object> {
    const body = '{"procuralItemList":' + JSON.stringify(procuralItem) + '}';
    const paramsX = this.utilsService.addTokenParam(null);
    // console.log('adding proc item ' + body);
    return this.http
      .post(UrlConstants.addProcuralItem, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  approveProcuralItem(procuralItem: ProcuralItemI): Observable<Object> {
    procuralItem.updatedBy = this.userService.getUserId();
    const paramsX = this.utilsService.addTokenParam(null);
    procuralItem.status = StatusConstants.APPROVED_STATUS;
    const body = JSON.stringify(procuralItem);
    return this.http
      .post(UrlConstants.updateProcuralItem, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  generatePOReport(supplier: string, shipping: string, pAndF: string): Observable<Object> {
    let paramsX = new HttpParams().set('supplierName', supplier).set('shipping', shipping).set('pAndF', pAndF);
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http
      .get(UrlConstants.generatePOReport, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        observe: 'response',
        responseType: 'blob'
      });
  }
}



