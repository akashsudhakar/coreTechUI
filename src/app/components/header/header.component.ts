import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material';

import { UserService } from '../../services/user.service';
import { UserRoles } from '../../models/user-roles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public sectionName;
  events = [];
  shouldRun = true;
  showPOMenu = false;
  showBuyLeadMenu = false;
  showProcurementsMenu = false;
  showUsersMenu = false;
  showCustomerReportMenu = false;
  showSupplierMenu = false;
  showEditBuyLead = false;

  constructor(private userService: UserService, private router: Router) {
    this.sectionName = '';
    if (!this.userService.isUserAuthenticated()) {
      this.router.navigate(['.']);
    } else {
      const userRole = this.userService.getUserRole();
      if (userRole === UserRoles.ADMIN) {
        this.showPOMenu = true;
        this.showBuyLeadMenu = true;
        this.showProcurementsMenu = true;
        this.showUsersMenu = true;
        this.showCustomerReportMenu = true;
        this.showSupplierMenu = true;
        this.showEditBuyLead = true;
      } else if (userRole === UserRoles.FRONT_END) {
        this.showPOMenu = true;
      } else if (userRole === UserRoles.BACK_END) {
        this.showBuyLeadMenu = true;
        this.showProcurementsMenu = true;
        this.showCustomerReportMenu = true;
        this.showSupplierMenu = true;
      }
    }
  }

  ngOnInit() {
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['.']);
  }

  public setSectionName(name: string) {
    this.sectionName = name;
  }

}
