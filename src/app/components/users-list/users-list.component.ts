import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/ApiResponse.interface';
import { BasicPersonResponse } from 'src/app/model/BasicPersonResponse.class';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  @Input()
  usersList: BasicPersonResponse[] = [];

  public loggedUser: string = '';

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.authService.extractUsername();
  }

  delete(username: string) {
    console.log('borrar usuario: ', username);
    this.userService.deleteUser(username)
          .subscribe({
            next: (resp: ApiResponse)=> {
              console.log(resp.data);
              const newList = this.usersList.filter((user)=> user.username != username);
              this.usersList = newList;
            },
            error: (error)=> {
              console.error(error);
            }
          })
  }
}
