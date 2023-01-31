import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UrlConstants } from '../models/url-constants';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import { Supplier } from '../models/supplier';
import { UserService } from './user.service';
import { UtilsService } from './utils.service';

@Injectable()
export class SupplierService {

  constructor(private http: HttpClient, private utilsService: UtilsService, private userService: UserService) { }

  getSuppliers(): Observable<Supplier[]> {
    const paramsX = this.utilsService.addTokenParam(null);
    return this.http
      .get<Supplier[]>(UrlConstants.getSuppliers, {
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json',
        params: paramsX
      });
  }

  getSuppliersPaginated(pageNo: number, pageSize: number): Observable<Supplier[]> {
    let paramsX = new HttpParams().set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    // console.log('params ' + paramsX.toString());
    return this.http
      .get<Supplier[]>(UrlConstants.getSuppliers, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }

  addSupplier(supplier: Supplier): Observable<Object> {
    supplier.createdDate = new Date().toISOString();
    const paramsX = this.utilsService.addTokenParam(null);
    supplier.createdBy = this.userService.getUserId();
    const body = JSON.stringify(supplier);
    console.log('creating supplier' + body);
    return this.http
      .post<Object>(UrlConstants.addSupplier, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  deleteSupplier(supplierId: number): Observable<Object> {
    let paramsX = new HttpParams().set('id', supplierId.toString());
    paramsX = this.utilsService.addTokenParam(paramsX);
    return this.http
      .delete(UrlConstants.deleteSupplier, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }

  updateSupplier(supplier: Supplier): Observable<Object> {
    supplier.updatedDate = new Date().toISOString();
    const paramsX = this.utilsService.addTokenParam(null);
    supplier.updatedBy = this.userService.getUserId();
    const body = JSON.stringify(supplier);
    // console.log('updating supplier' + body);
    return this.http
      .put<Object>(UrlConstants.updateSupplier, body, {
        headers: this.utilsService.getJsonHeader(),
        params: paramsX
      });
  }
}
