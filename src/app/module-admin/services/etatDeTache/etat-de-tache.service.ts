import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { EtatDeTache } from '../../models/etatDeTache';

@Injectable({
  providedIn: 'root'
})
export class EtatDeEtatDeEtatDeTacheService {

  private apiUrl = `${environment.apiUrl}/api/etatsDeTaches`;

  constructor(private http: HttpClient) { }

  getEtatDeTaches(): Observable<EtatDeTache[]> {
    return this.http.get<EtatDeTache[]>(`${this.apiUrl}/all`);
  }

  getEtatDeTacheById(id: number): Observable<EtatDeTache> {
    return this.http.get<EtatDeTache>(`${this.apiUrl}/${id}`);
  }

  createEtatDeTache(EtatDeTache: EtatDeTache): Observable<EtatDeTache> {
    return this.http.post<EtatDeTache>(`${this.apiUrl}/add`, EtatDeTache);
  }

  getEtatsByTache(id: string): Observable<EtatDeTache[]> {
    return this.http.get<EtatDeTache[]>(`${this.apiUrl}/allByTache/${id}`);
  }

  updateEtatDeTache(id: string, EtatDeTache: EtatDeTache): Observable<EtatDeTache> {
    return this.http.put<EtatDeTache>(`${this.apiUrl}/update/${id}`, EtatDeTache);
  }

  deleteEtatDeTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
