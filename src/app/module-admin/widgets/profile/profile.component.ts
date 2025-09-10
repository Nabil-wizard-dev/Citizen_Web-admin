import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService, ProfileResponse, ProfileUpdateRequest } from '../../../module-auth/services/profile/profile.service';
import { AuthentificationService } from '../../../module-auth/services/authentification/authentification.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  profile: ProfileResponse | null = null;
  isLoading = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  environment = environment;

  constructor(
    private profileService: ProfileService,
    private authService: AuthentificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      adresse: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Récupérer les informations utilisateur depuis localStorage
    const user = this.authService.getCurrentUser();
    if (!user || !user.trackingId) {
      console.log(' Aucun utilisateur trouvé dans localStorage');
      this.errorMessage = 'Impossible de récupérer les informations utilisateur';
      this.isLoading = false;
      return;
    }

    // Tenter de récupérer le profil complet depuis l'API (meilleure source)
    this.profileService.getProfile(user.trackingId).subscribe({
      next: (apiProfile: ProfileResponse) => {
        this.profile = apiProfile;
        this.populateForm();

        if (this.profile.photoProfil) {
          this.previewUrl = `${environment.apiUrl}/${this.profile.photoProfil}`;
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        console.warn(' Échec du chargement via API, utilisation du localStorage:', err);

        // Fallback vers les données locales si l'API échoue
        this.profile = {
          trackingId: user.trackingId,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          numero: user.numero,
          adresse: user.adresse,
          dateNaissance: user.dateNaissance as any,
          cni: user.cni,
          role: user.role,
          photoProfil: user.photoProfil
        } as ProfileResponse;

        this.populateForm();

        if (this.profile.photoProfil) {
          this.previewUrl = `${environment.apiUrl}/${this.profile.photoProfil}`;
        }

        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    console.log(' Population du formulaire avec:', this.profile);
    
    if (this.profile) {
      const formData = {
        nom: this.profile.nom || '',
        prenom: this.profile.prenom || '',
        email: this.profile.email || '',
        numero: this.profile.numero || '',
        adresse: this.profile.adresse || '',
        dateNaissance: this.profile.dateNaissance || ''
      };
      
      console.log(' Données du formulaire:', formData);
      
      this.profileForm.patchValue(formData);
      
      // Vérifier que les valeurs ont été appliquées
      console.log(' Formulaire après patchValue:', this.profileForm.value);
    } else {
      console.log(' Aucun profil disponible pour peupler le formulaire');
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(); // Restaurer les valeurs originales
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La taille de l\'image ne doit pas dépasser 5MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile || !this.profile) {
      this.errorMessage = 'Veuillez sélectionner une image';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.uploadProfilePhoto(this.profile.trackingId, this.selectedFile).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Photo de profil mise à jour avec succès';
          
          // Mettre à jour les données locales
          if (this.profile) {
            this.profile.photoProfil = response.data;
          }
          
          // Mettre à jour les données dans localStorage
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              photoProfil: response.data
            };
            
            this.authService.saveUser(updatedUser);
            console.log('💾 Photo de profil mise à jour dans localStorage:', updatedUser);
            
            // Émettre la mise à jour pour le header
            this.authService.emitProfileUpdate();
          }
          
          this.selectedFile = null;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de l\'upload de la photo';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'upload:', error);
        this.errorMessage = 'Erreur lors de l\'upload de la photo';
        this.isLoading = false;
      }
    });
  }

  deletePhoto(): void {
    if (!this.profile) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      this.isLoading = true;
      this.errorMessage = '';

      this.profileService.deleteProfilePhoto(this.profile.trackingId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = 'Photo de profil supprimée avec succès';
            if (this.profile) {
              this.profile.photoProfil = undefined;
            }
            this.previewUrl = null;
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la suppression';
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression de la photo';
          this.isLoading = false;
        }
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.profile) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updateData: ProfileUpdateRequest = this.profileForm.value;

    // Mettre à jour les données locales d'abord
    if (this.profile) {
      this.profile.nom = updateData.nom || '';
      this.profile.prenom = updateData.prenom || '';
      this.profile.email = updateData.email || '';
      this.profile.numero = updateData.numero || 0;
      this.profile.adresse = updateData.adresse || '';
      this.profile.dateNaissance = updateData.dateNaissance || '';
    }

    // Mettre à jour les données dans localStorage
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        nom: updateData.nom,
        prenom: updateData.prenom,
        email: updateData.email,
        numero: updateData.numero,
        adresse: updateData.adresse,
        dateNaissance: updateData.dateNaissance
      };
      
      this.authService.saveUser(updatedUser);
      console.log(' Utilisateur mis à jour dans localStorage:', updatedUser);
      
      // Émettre la mise à jour pour le header
      this.authService.emitProfileUpdate();
    }

    // Appeler l'API pour sauvegarder sur le serveur
    this.profileService.updateProfile(this.profile!.trackingId, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Profil mis à jour avec succès';
          this.isEditing = false;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de la mise à jour';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      }
    });
  }

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'ADMINISTRATEUR': 'Administrateur',
      'AUTORITE_LOCALE': 'Autorité Locale',
      'OUVRIER': 'Ouvrier',
      'CITOYEN': 'Citoyen',
      'SERVICE_HYGIENE': 'Service d\'Hygiène',
      'SERVICE_MUNICIPAL': 'Service Municipal'
    };
    return roleNames[role] || role;
  }

  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/faces/default-avatar.png';
    }
  }

  cancelPhotoSelection(): void {
    this.selectedFile = null;
    if (this.profile && this.profile.photoProfil) {
      this.previewUrl = `${environment.apiUrl}/${this.profile.photoProfil}`;
    } else {
      this.previewUrl = null;
    }
  }
} 