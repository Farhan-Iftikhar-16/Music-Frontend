import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  API_URL = environment.API_URL

  constructor(
    private httpClient: HttpClient
  ) { }

  getFilterArtists(queryParams): Observable<any> {
    let httpParams = new HttpParams();
    if (queryParams) {
      for (let params in queryParams) {
        httpParams = httpParams.set(params, queryParams[params]);
      }
    }

    return this.httpClient.get(`${this.API_URL}filterArtists`, {params: httpParams});
  }

  getValueRanges(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}valueRanges`);
  }
}
