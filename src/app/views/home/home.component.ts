import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  public username: string | null = null;
  public actualMonth!: Date;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = this.authService.extractUsername();
    this.actualMonth = new Date();
  }

  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(['/']);
  }
}
