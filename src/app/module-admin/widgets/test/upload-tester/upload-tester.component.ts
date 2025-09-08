import { Component } from '@angular/core';
import { UploadServiceService } from '../../../services/uploads/upload-service.service';

@Component({
  selector: 'app-upload-tester',
  standalone: false,
  templateUrl: './upload-tester.component.html',
  styleUrl: './upload-tester.component.css',
  
})
export class UploadTesterComponent {

  selectedFile: File | null = null;
  // imagePath: string | null = null;

  constructor(private uploadService: UploadServiceService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    this.uploadService.uploadImage(this.selectedFile)
      .subscribe({
        next: (response: any) => {
          if (response && response.path) {
            // this.imagePath = response.path;
            console.log('Upload réussi. Chemin du fichier:', response.path);
          } else {
            console.error('Réponse invalide du serveur');
          }
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload :', err);
        },
        complete: () => {
          // Réinitialiser le formulaire après l'upload
          this.selectedFile = null;
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        }
      });
  }
}
