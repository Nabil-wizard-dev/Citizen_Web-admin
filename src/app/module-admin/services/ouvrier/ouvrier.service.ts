import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Ouvrier } from '../../models/ouvrier';

@Injectable({
  providedIn: 'root'
})
export class OuvrierService {

  private apiUrl = `${environment.apiUrl}/api/ouvriers`;

  constructor(private http: HttpClient) { }

  getOuvriers(): Observable<Ouvrier[]> {
    return this.http.get<Ouvrier[]>(`${this.apiUrl}/all`);
  }

  getOuvrierById(id: number): Observable<Ouvrier> {
    return this.http.get<Ouvrier>(`${this.apiUrl}/${id}`);
  }

  createOuvrier(Ouvrier: Ouvrier): Observable<Ouvrier> {
    return this.http.post<Ouvrier>(`${this.apiUrl}/add`, Ouvrier);
  }

  updateOuvrier(id: string, Ouvrier: Ouvrier): Observable<Ouvrier> {
    return this.http.put<Ouvrier>(`${this.apiUrl}/update/${id}`, Ouvrier);
  }

  updateOuvrierSignalementActuId(id: string, signalementActuelId:string):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/updateOuvrierSignalementActuId/${id}`, signalementActuelId);
  }

  // updateOuvrierSignalementActuId(id: string, signalementActuelId: string): Observable<Ouvrier> {
  //   // Envoyer un objet JSON avec le UUID
  //   const updateData = {
  //     signalementActuelId: signalementActuelId
  //   };
    
  //   console.log('Données envoyées à l\'API:', updateData);
    
  //   return this.http.put<Ouvrier>(
  //     `${this.apiUrl}/updateOuvrierSignalementActuId/${id}`,
  //     updateData,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     }
  //   );
  // }

  deleteOuvrier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
