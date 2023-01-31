import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core/src/metadata/ng_module';
import { Router } from '@angular/router';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';

import { UserI } from '../../models/user-i';
import { UserService } from '../../services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserI;
  redirectUrl: string;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private userService: UserService, private router: Router, public snackBar: MatSnackBar) {
    this.user = {} as UserI;
  }

  ngOnInit() { }

  login(url: string) {
    if (this.passwordFormControl.valid && this.usernameFormControl.valid) {
      this.redirectUrl = url;
      this.userService.login(this.user).subscribe(
        (data) => {
          if (data == null) {
            this.invalidLogin();
          } else {
            this.loginSuccess(data);
          }
        },
        (data) => { this.serverError(data); },
        function () { }
      );
    }
  }

  invalidLogin() {
    this.openSnackBar('Invalid credentials');
  }

  loginSuccess(data: UserI) {
    this.userService.setUser(data);
    this.userService.setUserAuthenticated(true);
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    }

  }
  serverError(data) {
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
