import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../../../../../module-auth/services/authentification/authentification.service';
import { Utilisateur } from '../../../../../module-auth/models/utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-autority',
  standalone: false,
  templateUrl: './add-autority.component.html',
  styleUrl: './add-autority.component.css'
})
export class AddAutorityComponent implements OnInit {
  
  // Variables
  autoriteForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthentificationService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    // Construction du formulaire basé sur les attributs du modèle Utilisateur
    this.autoriteForm = this.fb.group({
      // Champs obligatoires
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      cni: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}-[0-9]{4}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      motDePasse: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@!%?&])[A-Za-z\\d@!%?&]{8,}$')]],
      numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      role: ['AUTORITE_LOCALE', [Validators.required]], // Rôle fixe pour les autorités
      
      // Champs optionnels
      adresse: ['', []],
      dateNaissance: ['', []]
    });
  }

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  onSubmit() {
    if (this.autoriteForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      // Création de l'objet Utilisateur pour l'autorité (même structure que register)
      const autorite: Utilisateur = {
        nom: this.autoriteForm.value.nom,
        prenom: this.autoriteForm.value.prenom,
        cni: this.autoriteForm.value.cni,
        email: this.autoriteForm.value.email,
        motDePasse: this.autoriteForm.value.motDePasse,
        numero: this.autoriteForm.value.numero,
        adresse: this.autoriteForm.value.adresse || '',
        dateNaissance: this.autoriteForm.value.dateNaissance || "string",
        role: this.autoriteForm.value.role,
      };

      console.log('Données envoyées au serveur:', autorite);
      console.log('Valeurs du formulaire:', this.autoriteForm.value);

      this.authService.register(autorite).subscribe({
        next: (response: any) => {
          this.successMessage = 'Autorité créée avec succès';
          this.errorMessage = null;
          this.autoriteForm.reset();
          this.loading = false;
          
          // Redirection après 3 secondes
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/admin/listAutority']);
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création de l\'autorité';
          this.successMessage = null;
          this.loading = false;
          console.error('Erreur lors de la création:', err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      this.successMessage = null;
    }
  }

  onReset() {
    this.autoriteForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Getter pour accéder aux contrôles du formulaire
  get form() {
    return this.autoriteForm.controls;
  }
}