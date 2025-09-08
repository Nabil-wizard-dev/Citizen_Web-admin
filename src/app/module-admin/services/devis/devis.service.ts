import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Devis {
  trackingId: string;
  titre: string;
  signalementId: string;
  ouvrierId: string;
  dateCreation: string;
  chemin: string;
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = `${environment.apiUrl}/api/signalements`;

  constructor(private http: HttpClient) { }

  // Récupérer les devis d'un signalement
  getDevisBySignalement(signalementId: string): Observable<any> {
    const url = `${this.apiUrl}/devis/${signalementId}`;
    console.log(' Appel API URL:', url);
    console.log(' apiUrl:', this.apiUrl);
    console.log(' signalementId:', signalementId);
    console.log(' URL complète:', url);
    return this.http.get<any>(url);
  }

  // Télécharger un devis PDF
  downloadDevisPdf(devisId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/devis/${devisId}/pdf`, { responseType: 'blob' });
  }

  // Récupérer les rapports d'un signalement
  getRapportsBySignalement(signalementId: string): Observable<any> {
    const url = `${this.apiUrl}/rapports/${signalementId}`;
    console.log(' Appel API Rapports URL:', url);
    return this.http.get<any>(url);
  }

  // Télécharger un rapport PDF
  downloadRapportPdf(rapportId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/devis/${rapportId}/pdf`, { responseType: 'blob' });
  }

  // Associer un devis à un signalement
  associerDevis(signalementId: string, fichierId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/associerDevis/${signalementId}/${fichierId}`, {});
  }
} 