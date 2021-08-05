import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {
  constructor(
    private http: HttpClient
  ) {}

  buscarEndereco(end: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?q=${end}&format=json&addressdetails=1`;
    
    return this.http.get<any>(url).pipe(
      map((obj) => obj)
    );
  }

  buscarRota(latOrigem: number, lngOrigem: number, latDestino: number, lngDestino: number) {
    let key = Math.floor(Math.random()*c.map_quest_keys.length);

    const url = `https://www.mapquestapi.com/directions/v2/route?key=
      ${c.map_quest_keys[key]}&from=${latOrigem},${lngOrigem}&to=${latDestino},${lngDestino}`;

    return this.http.get<any>(url).pipe(
      map((obj) => obj)
    );
  }
}