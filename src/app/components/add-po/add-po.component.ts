import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { BuyLeadService } from '../../services/buy-lead.service';
import { PayOrderService } from '../../services/pay-order.service';
import { UserService } from '../../services/user.service';
import { BuyLeadI } from '../../models/buy-lead-i';
import { BuyLeadItemsI } from '../../models/buy-lead-items-i';
import { ProcuralItemI } from '../../models/procural-item-i';
import { StatusConstants } from '../../models/status-constants';
import { elementAttribute } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-add-po',
  templateUrl: './add-po.component.html',
  styleUrls: ['./add-po.component.css']
})
export class AddPoComponent implements OnInit {
  selectedTab: number;
  buyLeadDataSource: MatTableDataSource<BuyLeadI>;
  displayedBuyLeadColumns = ['custName', 'custLocation', 'custPhone', 'custEmail', 'approve'];
  itemsDataSource: MatTableDataSource<BuyLeadItemsI>;
  displayedItemsColumns = ['itemName', 'quantity', 'category', 'remarks', 'rate', 'gst', 'total', 'stock'];
  buyLeadsI: BuyLeadI[];
  buyLeadSelected: BuyLeadI;

  constructor(private buyLeadService: BuyLeadService, public snackBar: MatSnackBar,
    private payOrderService: PayOrderService, private userService: UserService) {
    this.selectedTab = 0;
  }

  ngOnInit() {
    this.buyLeadsI = [];
    this.buyLeadSelected = {} as BuyLeadI;
    this.buyLeadService.getBuyLeads2(StatusConstants.APPROVED_STATUS).subscribe(buyLeadIResponse => {
      this.addCustomerDetails(buyLeadIResponse);
    });
  }

  addCustomerDetails(buyLeadsIResponse: BuyLeadI[]) {
    buyLeadsIResponse.forEach(e => {
      this.buyLeadsI.push(e);
    });
    this.buyLeadDataSource = new MatTableDataSource<BuyLeadI>(this.buyLeadsI);
  }

  editBuyLead(elementSelected: BuyLeadI) {
    // console.log('Edit buy lead' + JSON.stringify(elementSelected));
    this.buyLeadSelected = elementSelected;
    this.itemsDataSource = new MatTableDataSource<BuyLeadItemsI>(elementSelected.buyLeadItems);
    this.toggleTab();
  }

  addPO() {
    const procuralItems = [] as ProcuralItemI[];
    const userId = this.userService.getUserId();
    for (let i = this.buyLeadSelected.buyLeadItems.length - 1; i >= 0; i--) {
      const procuralItem = {} as ProcuralItemI;
      // procuralItem.buyLeadId = this.buyLeadSelected.buyLeadItems[i].buyLeadId;
      procuralItem.itemName = this.buyLeadSelected.buyLeadItems[i].itemName;
      procuralItem.quantity = this.buyLeadSelected.buyLeadItems[i].quantityAsked;
      procuralItem.updatedBy = userId;
      procuralItem.status = StatusConstants.ARRIVED_STATUS;
      procuralItems.push(procuralItem);
    }

    this.payOrderService.addProcuralItems(procuralItems)
      .subscribe(
      (data) => { this.approveSuccess(data); },
      (data) => { this.serverError(data); },
      () => { this.toggleTab(); }
      );
  }

  toggleTab() {
    this.selectedTab += 1;
    if (this.selectedTab >= 2) {
      this.selectedTab = 0;
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
  }

  approveSuccess(data) {
    this.openSnackBar('Successfully Approved');
  }
  serverError(data) {
    this.openSnackBar('Server error');
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }
}
