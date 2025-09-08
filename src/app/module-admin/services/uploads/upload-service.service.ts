import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {
  private apiUrl = `${environment.apiUrl}/Upload`;
  
  constructor(private http: HttpClient) { }

  
  // Méthode pour uploader les fichiers
  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/FilesUploader_2`, formData);
  }
}
