import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-banner',
  templateUrl: './user-banner.component.html',
  styleUrls: ['./user-banner.component.css']
})
export class UserBannerComponent {

  @Input()
  username!: string;

  constructor(private authService: AuthService, 
    private router: Router,
    private userService: UserService) {}

  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(['/']);
  }

}
