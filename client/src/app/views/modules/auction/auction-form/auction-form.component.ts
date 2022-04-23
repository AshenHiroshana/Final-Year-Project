import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Auction} from '../../../../entities/auction';
import {AuctionService} from '../../../../services/auction.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Procurementitem} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.scss']
})
export class AuctionFormComponent extends AbstractComponent implements OnInit {

  procurementitems: Procurementitem[] = [];

  form = new FormGroup({
    buyer: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    procurementitem: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get buyerField(): FormControl{
    return this.form.controls.buyer as FormControl;
  }

  get procurementitemField(): FormControl{
    return this.form.controls.procurementitem as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private procurementitemService: ProcurementitemService,
    private auctionService: AuctionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.procurementitemService.getAllItemForAllocation().then((procurementitemDataPage) => {
      this.procurementitems = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_AUCTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_AUCTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_AUCTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_AUCTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_AUCTION);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const auction: Auction = new Auction();
    auction.buyer = this.buyerField.value;
    auction.procurementitem = this.procurementitemField.value;
    auction.amount = this.amountField.value;
    auction.date = DateHelper.getDateAsString(this.dateField.value);
    auction.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.auctionService.add(auction);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/auctions/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.buyer) { this.buyerField.setErrors({server: msg.buyer}); knownError = true; }
          if (msg.procurementitem) { this.procurementitemField.setErrors({server: msg.procurementitem}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
