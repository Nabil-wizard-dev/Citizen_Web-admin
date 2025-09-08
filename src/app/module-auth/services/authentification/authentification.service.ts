import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Utilisateur } from '../../models/utilisateur';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private apiUrl = `${environment.apiUrl}/api/auth`;
  private profileUpdateSubject = new Subject<void>();
  
  constructor(private http: HttpClient) { }

  // Observable pour les mises à jour de profil
  get profileUpdated$(): Observable<void> {
    return this.profileUpdateSubject.asObservable();
  }

  // Méthode pour émettre une mise à jour
  emitProfileUpdate(): void {
    this.profileUpdateSubject.next();
  }

  register(Utilisateur: any): Observable<Utilisateur[]> {
    return this.http.post<Utilisateur[]>(`${this.apiUrl}/register`, Utilisateur);
  }

  authentificate(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, utilisateur);
  }

  // Décoder le token JWT pour récupérer les informations utilisateur
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // Récupérer les informations utilisateur depuis le token
  private getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;
    
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;

    console.log('🔍 Token décodé:', decodedToken);

    // Extraire les informations utilisateur du token
    const userInfo = {
      trackingId: decodedToken.trackingId || decodedToken.sub,
      email: decodedToken.email || decodedToken.sub,
      nom: decodedToken.nom || '',
      prenom: decodedToken.prenom || '',
      role: decodedToken.role || decodedToken.authorities?.[0]?.authority?.replace('ROLE_', '') || '',
      cni: decodedToken.cni || '',
      numero: decodedToken.numero || '',
      adresse: decodedToken.adresse || '',
      dateNaissance: decodedToken.dateNaissance || '',
      photoProfil: decodedToken.photoProfil || null
    };

    console.log('👤 Informations utilisateur extraites:', userInfo);
    return userInfo;
  }

  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  // Enregistrer le token
  saveToken(token: string): void {
    console.log(' Sauvegarde du token...');
    localStorage.setItem(this.tokenKey, token);
    
    // Sauvegarder automatiquement les informations utilisateur
    const userInfo = this.getUserFromToken();
    if (userInfo) {
      console.log(' Sauvegarde des informations utilisateur:', userInfo);
      this.saveUser(userInfo);
    } else {
      console.log(' Impossible d\'extraire les informations utilisateur du token');
    }
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Enregistrer les informations utilisateur
  saveUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Récupérer les informations utilisateur
  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    // Si pas d'infos sauvegardées, essayer de les récupérer depuis le token
    const userFromToken = this.getUserFromToken();
    if (userFromToken) {
      this.saveUser(userFromToken);
      return userFromToken;
    }
    
    return null;
  }

  // Récupérer le trackingId de l'utilisateur connecté
  getCurrentUserTrackingId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.trackingId : null;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Déconnexion (supprimer le token et les infos utilisateur)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Vérifier la validité du token
  checkTokenValidity(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    // Faire une requête de test vers une route protégée
    return this.http.get<any>(`${environment.apiUrl}/api/signalements/all`).pipe(
      map(() => true),
      catchError(() => {
        // Si la requête échoue, le token est invalide
        this.logout();
        return of(false);
      })
    );
  }

  // Vérifier si l'utilisateur est connecté et si le token est valide
  isAuthenticated(): Observable<boolean> {
    return this.checkTokenValidity();
  }
}
