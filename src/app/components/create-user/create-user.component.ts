import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core/src/metadata/ng_module';
import { Router } from '@angular/router';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';

import { UserI } from '../../models/user-i';
import { UserService } from '../../services/user.service';
import { UserRoles } from '../../models/user-roles';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userRoles = [UserRoles.FRONT_END, UserRoles.BACK_END, UserRoles.ADMIN];
  user: UserI;
  redirectUrl: string;
  confirmPassword: string;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);
  userRoleFormControl = new FormControl('', [Validators.required]);
  createDisabled: boolean;

  constructor(private userService: UserService, private router: Router, public snackBar: MatSnackBar) {
    this.user = {} as UserI;
    this.confirmPassword = '';
    this.createDisabled = false;
  }

  ngOnInit() { }

  register(createUserForm: NgForm) {
    this.createDisabled = true;
    if (this.confirmPasswordFormControl.valid && this.newPasswordFormControl.valid &&
      this.usernameFormControl.valid && this.userRoleFormControl.valid) {
      if (this.user.newPassword !== this.confirmPassword) {
        this.confirmPasswordFormControl.setErrors({ 'equal': false });
        return;
      }
      this.user.password = this.user.newPassword;
      this.user.createdBy = this.userService.getUserId();
      this.userService.register(this.user).subscribe(
        () => {
          this.success(createUserForm);
        },
        (data) => { console.log('failure'); this.serverError(data); },
        function () { this.createDisabled = false; }
      );
    }
  }

  invalidLogin() {
    this.openSnackBar('Invalid credentials');
  }

  success(createUserForm: NgForm) {
    this.openSnackBar('User Created');
    this.user = {} as UserI;
    this.confirmPassword = '';
    createUserForm.resetForm();
    this.usernameFormControl.reset();
    this.passwordFormControl.reset();
    this.newPasswordFormControl.reset();
    this.confirmPasswordFormControl.reset();
    this.userRoleFormControl.reset();
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
  // createBuyLead(customerDetailsForm: NgForm) {
  //   this.register();
  // }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
