import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signalement } from '../../models/signalement';

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  private apiUrl = `${environment.apiUrl}/api/signalements`;
  private apiUrl2 = `${environment.apiUrl}/signalements`;

  constructor(private http: HttpClient) { }

  getSignalements(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}?page=${page}&size=${size}`);
  }

  getSignalementById(id: string): Observable<Signalement> {
    return this.http.get<Signalement>(`${this.apiUrl}/${id}`);
  }

  createSignalement(signalement: Signalement): Observable<Signalement> {
    return this.http.post<Signalement>(`${this.apiUrl}`, signalement);
  }

  updateSignalement(id: string, signalement: Signalement): Observable<Signalement> {
    return this.http.put<Signalement>(`${this.apiUrl}/update/${id}`, signalement);
  }

  deleteSignalement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activerSignalement(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activer/${id}`, {});
  }
  // Rejeter un signalement
  rejeterSignalement(signalementId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rejeter/${signalementId}`, {});
  }

  // Finaliser un signalement
  finaliserSignalement(signalementId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/finaliser/${signalementId}`, {});
  }


  // recuperer l'adresse par defaut
  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get(url);
  }
}