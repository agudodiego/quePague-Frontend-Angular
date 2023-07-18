import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output()
  deleteEvent = new EventEmitter<string>();

  public loggedUser: string = '';

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.authService.extractUsername();
  }

  delete(username: string) {
    this.deleteEvent.emit(username);
  }
}
