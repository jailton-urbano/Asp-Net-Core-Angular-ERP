import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from '../../core/config/app.config';
import { Coordenada } from './haversine.service';

@Injectable({
  providedIn: 'root'
})
export class NominatimService
{
  constructor (
    private http: HttpClient
  ) { }

  buscarEndereco(end: string): Observable<any> 
  {
    const url = `https://nominatim.openstreetmap.org/search?q=${end}&format=json&addressdetails=1`;

    return this.http.get<any>(url).pipe(
      map((data: any) => data)
    );
  }

  private buscarRota(latOrigem: string, lngOrigem: string, latDestino: string, lngDestino: string) 
  {
    let key = Math.floor(Math.random() * c.map_quest_keys.length);
    const url = `https://www.mapquestapi.com/directions/v2/route?key=${c.map_quest_keys[key]}&from=${latOrigem},${lngOrigem}&to=${latDestino},${lngDestino}`;

    return fetch(url).then(p => { return p.json() });
  }

  public async deslocamentoEmMinutos(origem: Coordenada, destino: Coordenada): Promise<number>
  {
    return (await this.buscarRota(origem.coordenadas[0], origem.coordenadas[1],
      destino.coordenadas[0], destino.coordenadas[1])).route.time / 60.0;
  }
}
