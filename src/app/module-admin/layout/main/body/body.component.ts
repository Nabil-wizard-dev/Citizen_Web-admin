import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: false,
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  currentUrl: string = '';

  constructor(private router: Router) {
    
  }


  ngOnInit(): void {
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects; // Mise à jour de l'URL
        // console.log('Nouvelle URL:', this.currentUrl);
        // return this.currentUrl;
      }
    });
  };
}
