import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newUser: boolean;
  constructor() {
  }

  ngOnInit() {
    this.newUser = false;
  }
  setNewUser(newUser: boolean) {
    this.newUser = newUser;
  }
}
