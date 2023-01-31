import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core/src/metadata/ng_module';
import { Router } from '@angular/router';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { UserI } from '../../models/user-i';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input()
  newUser: boolean;
  user: UserI;
  redirectUrl: string;
  confirmPassword: string;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  constructor(private userService: UserService, private router: Router, public snackBar: MatSnackBar) {
    this.user = {} as UserI;
    this.confirmPassword = '';
  }

  ngOnInit() { }

  register(url: string) {
    if (this.confirmPasswordFormControl.valid && this.newPasswordFormControl.valid &&
      this.usernameFormControl.valid) {
      if (this.user.newPassword !== this.confirmPassword) {
        this.confirmPasswordFormControl.setErrors({ 'equal': false });
        return;
      }
      console.log('user ' + this.user.username + this.user.password + this.user.newPassword);
      // this.userService.updateUser(this.user).subscribe(
      //   (data) => {
      //     if (data == null) {
      //       this.success(data);
      //     } else {
      //       this.serverError(data);
      //     }
      //   },
      //   (data) => { this.serverError(data); },
      //   function () { }
      // );
    }
  }
  invalidLogin() {
    this.openSnackBar('Invalid credentials');
  }

  success(data) {
    this.openSnackBar('Please sign in').afterDismissed().subscribe(() => { this.newUser = false; });
  }
  serverError(data) {
    this.openSnackBar('Server error' + JSON.stringify(data));
  }
  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Dismiss');
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
