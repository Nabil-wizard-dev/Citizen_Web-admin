import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OuvrierService } from '../../../../services/ouvrier/ouvrier.service';
import { Ouvrier } from '../../../../models/ouvrier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ouvrier',
  standalone: false,
  templateUrl: './add-ouvrier.component.html',
  styleUrl: './add-ouvrier.component.css'
})
export class AddOuvrierComponent implements OnInit {
  
  // Variables
  ouvrierForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private ouvrierService: OuvrierService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    // Construction du formulaire basé sur les attributs du backend
    this.ouvrierForm = this.fb.group({
      // Champs obligatoires
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      cni: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}-[0-9]{4}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      motDePasse: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@!%?&])[A-Za-z\\d@!%?&]{8,}$')]],
      numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      specialite: ['', [Validators.required]],
      
      // Champs optionnels
      dateNaissance: ['', []],
      adresse: ['', []],
      
      // Champs automatiques (cachés)
      role: ['OUVRIER', [Validators.required]],
      serviceId: [1, [Validators.required]],
      imagePath: ['', []]
    });
  }

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  onSubmit() {
    if (this.ouvrierForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      // Création de l'objet Ouvrier exactement comme dans Postman
      const ouvrier = {
        nom: this.ouvrierForm.value.nom,
        prenom: this.ouvrierForm.value.prenom,
        cni: this.ouvrierForm.value.cni,
        email: this.ouvrierForm.value.email,
        motDePasse: this.ouvrierForm.value.motDePasse,
        numero: this.ouvrierForm.value.numero, // Garder comme string
        dateNaissance: this.ouvrierForm.value.dateNaissance || "string", // Utiliser "string" si vide
        adresse: this.ouvrierForm.value.adresse || "string", // Utiliser "string" si vide
        role: "OUVRIER",
        specialite: this.ouvrierForm.value.specialite
      };

      console.log('Données envoyées au serveur:', ouvrier);

      this.ouvrierService.createOuvrier(ouvrier).subscribe({
        next: (response: any) => {
          this.successMessage = 'Ouvrier créé avec succès';
          this.errorMessage = null;
          this.ouvrierForm.reset();
          this.loading = false;
          
          // Redirection après 3 secondes
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/admin/listOuvrier']);
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création de l\'ouvrier';
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
    this.ouvrierForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Getter pour accéder aux contrôles du formulaire
  get form() {
    return this.ouvrierForm.controls;
  }
}