import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { UserI } from '../../models/user-i';
import { UserService } from '../../services/user.service';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  user: UserI;
  redirectUrl: string;
  confirmPassword: string;
  matcher = new MyErrorStateMatcher();
  passwordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);
  createDisabled: boolean;

  constructor(private userService: UserService, public snackBar: MatSnackBar) {
    this.user = {} as UserI;
    this.confirmPassword = '';
    this.createDisabled = false;
  }

  ngOnInit() { }

  changePassword(createUserForm: NgForm) {
    this.createDisabled = true;
    if (this.passwordFormControl.valid && this.confirmPasswordFormControl.valid && this.newPasswordFormControl.valid) {
      if (this.user.newPassword !== this.confirmPassword) {
        this.confirmPasswordFormControl.setErrors({ 'equal': false });
        return;
      }
      const userUpdate = {} as UserI;
      userUpdate.userId = this.userService.getUserId();
      userUpdate.username = this.userService.getUserName();
      userUpdate.updatedBy = this.userService.getUserId();
      userUpdate.password = this.user.password;
      userUpdate.newPassword = this.user.newPassword;
      this.userService.updateUser(userUpdate).subscribe(
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
    this.passwordFormControl.reset();
    this.newPasswordFormControl.reset();
    this.confirmPasswordFormControl.reset();
  }

  serverError(data) {
    console.log(JSON.stringify(data));
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
