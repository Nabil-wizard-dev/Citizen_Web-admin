import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../../models/utilisateur';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { passwordMatch } from '../../validators/password-matcher.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  //vars
  protected utilisateur: Utilisateur[] = [];
  utilisateurForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imageError: string | null = null;

  /**
   *
   */
  constructor(private authService: AuthentificationService, private fb: FormBuilder, private router: Router) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      cni: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}-[0-9]{4}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      motDePasse: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@!%?&])[A-Za-z\\d@!%?&]{8,}$')]],
      passwordConfirmation: ['', [Validators.required, Validators.pattern('')]],
      numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      role: ['AUTORITE_LOCALE', [, Validators.pattern('^(ADMINISTRATEUR|AUTORITE_LOCALE|OUVRIER|CITOYEN)$')]],
      adresse: ['', []],
      dateNaissance: ['', []],
      imagePath: ['', []],
    }, { validators: passwordMatch() } // <-- Application du validateur
    )
  }

  ngOnInit(): void {

  }

  get form() {
    return this.utilisateurForm.controls;
  }

  onSubmit() {
    if (this.utilisateurForm.valid) {
      // Création de l'objet Utilisateur
      const utilisateur: Utilisateur = {
        ...this.utilisateurForm.value,
      };

      this.authService.register(utilisateur).subscribe({
        next: (response: any) => {
          this.successMessage = 'inscrit avec succes';
          this.errorMessage = null;
          this.utilisateurForm.reset();
          setTimeout(() => {
            this.successMessage = null,
            this.router.navigate(['/auth/login']);
          }, 3000);
        
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.successMessage = null;
          console.error(err);
        }
      }
    )
    } else {
      this.errorMessage = 'les 2 mot de passe ne matches pas';
      this.successMessage = null;
    }
  }
}