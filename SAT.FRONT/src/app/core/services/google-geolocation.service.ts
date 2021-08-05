import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'


@Injectable({
  providedIn: 'root'
})
export class GoogleGeolocationService {
  constructor(
    private http: HttpClient
  ) {}

  buscarPorEnderecoOuCEP(endCep: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${endCep}&key=${Config.GOOGLE_KEY}`;
    return this.http.get<any>(url).pipe(
      map((obj) => obj)
    );
  }

  errorHandler(e: any): Observable<any> {
    return EMPTY;
  }
}