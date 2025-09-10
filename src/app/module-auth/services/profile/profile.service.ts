import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Utilisateur } from '../../models/utilisateur';

export interface ProfileUpdateRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  numero?: number;
  adresse?: string;
  dateNaissance?: string;
  photoProfil?: string;
}

export interface ProfileResponse {
  trackingId: string;
  nom: string;
  prenom: string;
  email: string;
  numero: number;
  adresse: string;
  dateNaissance: string;
  cni: string;
  role: string;
  photoProfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiUrl}/api/profile`;

  constructor(private http: HttpClient) { }

  // Récupérer le profil de l'utilisateur
  getProfile(trackingId: string): Observable<ProfileResponse> {
    return this.http
      .get<{ date: string; message: string; data: ProfileResponse; error: boolean }>(`${this.apiUrl}/${trackingId}`)
      .pipe(map((response) => response.data));
  }

  // Mettre à jour le profil
  updateProfile(trackingId: string, profileData: ProfileUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${trackingId}`, profileData);
  }

  // Uploader une photo de profil
  uploadProfilePhoto(trackingId: string, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post(`${this.apiUrl}/${trackingId}/photo`, formData);
  }

  // Supprimer la photo de profil
  deleteProfilePhoto(trackingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${trackingId}/photo`);
  }

  // Récupérer le profil de l'utilisateur connecté (par email)
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
} 