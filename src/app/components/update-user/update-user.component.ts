import { Component, OnInit } from '@angular/core';
import { UserI } from '../../models/user-i';
import { MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { UserService } from '../../services/user.service';
import { UserRoles } from '../../models/user-roles';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  itemsDataSource: MatTableDataSource<UserI>;
  userRoles = [UserRoles.FRONT_END, UserRoles.BACK_END, UserRoles.ADMIN];
  displayedItemsColumns = ['username', 'newPassword', 'userRole', 'update', 'delete'];
  pageEvent: PageEvent;
  users: UserI[];
  loggedInUsername: string;

  constructor(public snackBar: MatSnackBar, private userService: UserService) {
    this.pageEvent = new PageEvent;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 50;
    this.pageEvent.length = 5000;
    this.users = [];
    this.loggedInUsername = '';
  }

  ngOnInit() {
    this.getServerData(this.pageEvent);
    this.loggedInUsername = this.userService.getUserName();
  }

  getServerData(event?: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    this.pageEvent = event;
    this.pageEvent.length = 100;
    this.userService.getUsers(pageNumber, event.pageSize).subscribe(response => {
      this.users = [];
      this.addUserDetails(response);
    });
  }

  addUserDetails(suppliersResponse: UserI[]) {
    suppliersResponse.forEach(e => {
      this.users.push(e);
    });
    this.itemsDataSource = new MatTableDataSource<UserI>(this.users);
  }

  update(userBeingEdited: UserI) {
    userBeingEdited.updatedBy = this.userService.getUserId();
    this.userService.updateUser(userBeingEdited)
      .subscribe(
        (data) => { this.updateSuccess('Successfully Updated'); },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  delete(userBeingEdited: UserI) {
    this.userService.deleteUser(userBeingEdited.id)
      .subscribe(
        (data) => { this.updateSuccess('Successfully Deleted'); },
        (data) => { this.serverError(data); },
        () => { }
      );
  }

  updateSuccess(message: string) {
    this.getServerData(this.pageEvent);
    this.openSnackBar(message);
  }
  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
