import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../models/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../../services/authentification/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
//vars
  protected loginRequest: LoginRequest[] = [];
  loginForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imageError: string | null = null;


/**
 *constructor
 */
  constructor(private authService: AuthentificationService, private fb: FormBuilder, private router: Router) {
 this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    motDePasse:['',[Validators.required]]
 })
  
}

ngOnInit(): void {
   
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(){
    if (this.loginForm.valid) {
          // Création de l'objet Utilisateur
          const loginRequest: LoginRequest = {
            ...this.loginForm.value,
          };
    
      this.authService.authentificate(loginRequest).subscribe({
            next: (response: any) => {
              this.successMessage = 'connexion valide';
              this.errorMessage = null;
              this.loginForm.reset();
              // console.log("usertoken -> ",response.data.token);
              
              setTimeout(() => {
                this.successMessage = null,
                localStorage.removeItem("authToken") //supprimer les traces de la procedante connexion
                this.authService.saveToken(response.token)
                this.router.navigate(['/admin/dashboard']);
              }, 1000);
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
