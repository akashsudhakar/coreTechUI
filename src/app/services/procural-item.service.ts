import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UrlConstants } from '../models/url-constants';
import { Observable } from 'rxjs/Observable';

import { ProcuralItemI } from '../models/procural-item-i';
import { UserService } from './user.service';
import { StatusConstants } from '../models/status-constants';
import { UtilsService } from './utils.service';

@Injectable()
export class ProcuralItemService {

  constructor(private http: HttpClient, private utilsService: UtilsService, private userService: UserService) { }

  getProcuralItem(status: string): Observable<ProcuralItemI[]> {
    let paramsX = new HttpParams().set('status', status);
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
    // console.log('updating proc item' + body);
    return this.http.put(UrlConstants.updateProcuralItem, body, {
      headers: this.utilsService.getJsonHeader(),
      params: paramsX
    });
  }

  deleteProcuralItem(procuralItemId): Observable<Object> {
    let paramsX = new HttpParams().set('id', procuralItemId);
    paramsX = this.utilsService.addTokenParam(paramsX);
    console.log('params ' + paramsX.toString());
    return this.http.delete(UrlConstants.deleteProcuralItem, {
      params: paramsX,
      headers: this.utilsService.getJsonHeader()
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

  getProcuralItemsForStatuses(status: string[], poNumber: string, itemName: string, customerName: string,
    pageNo: number, pageSize: number): Observable<ProcuralItemI[]> {
    let paramsX = new HttpParams().set('status', status.join(',')).set('pageNo',
      pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    if (poNumber) { paramsX = paramsX.set('poNumber', poNumber); }
    if (itemName) { paramsX = paramsX.set('itemName', itemName); }
    if (customerName) { paramsX = paramsX.set('customerName', customerName); }
    console.log('params ' + paramsX.toString());
    return this.http
      .get<ProcuralItemI[]>(UrlConstants.getProcuralItem, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
}
