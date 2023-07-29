import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/ApiResponse.interface';
import { BasicPersonResponse } from 'src/app/model/BasicPersonResponse.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  public showLoader: boolean = true;
  public usersList: BasicPersonResponse[] = [];
  showConfirmationAlert: boolean = false;
  userToDelete!: string;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsersList()
      .subscribe({
        next: (resp: ApiResponse)=> {
          this.usersList = resp.data as BasicPersonResponse[];
          this.showLoader = false;
        },
        error: (error)=> {
          console.error(error);
        }
      });
    
  }

  goHome() {
    this.router.navigate(['/home']);
  };

  cancel(cancel: boolean) {
    this.showConfirmationAlert = cancel;
  }

  showConfModal(username: string) {
    this.showConfirmationAlert = true;
    this.userToDelete = username;
  }

  delete(confirmation: boolean) {
    if (confirmation) {
      this.userService.deleteUser(this.userToDelete)
      .subscribe({
        next: (resp: ApiResponse)=> {
          const newList = this.usersList.filter((user)=> user.username != this.userToDelete);
          this.usersList = newList;
          this.showConfirmationAlert = false;
        },
        error: (error)=> {
          console.error(error);
        }
      });
    }
    
  }

}
