import { Injectable } from '@angular/core';
import { Tache } from '../../models/tache';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TacheService {

  private apiUrl = `${environment.apiUrl}/api/taches`;

  constructor(private http: HttpClient) { }

  getTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/all`);
  }

  getTacheById(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`);
  }

  setTacheResolu(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/setResolu/${id}`);
  }

  setTacheActiver(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/setActiver/${id}`);
  }

  getTacheBysignalement(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/bysignalement/${id}`);
  }

  createTache(Tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/add`, Tache);
  }

  updateTache(id: string, Tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/update/${id}`, Tache);
  }

  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTachesAValider(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/a-valider`);
  }

  validerRapport(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/valider-rapport/${id}`, {});
  }

  rejeterRapport(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/rejeter-rapport/${id}`, {});
  }
}
