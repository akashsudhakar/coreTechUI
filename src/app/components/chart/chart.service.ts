import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from '../../services/utils.service';
import { UrlConstants } from '../../models/url-constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChartService {

  constructor(private _http: HttpClient, private utilsService: UtilsService) { }

  getBuyleadCount(status: string[]): Observable<number> {
	let paramsX = new HttpParams().set('status', status.join(','));
	paramsX = this.utilsService.addTokenParam(paramsX);  
	return this._http
      .get<number>(UrlConstants.getBuyLeadCount, {
        params: paramsX,
        headers: this.utilsService.getJsonHeader(),
        responseType: 'json'
      });
  }
}
