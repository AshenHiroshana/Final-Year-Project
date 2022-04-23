import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Auction} from '../../../../entities/auction';
import {AuctionService} from '../../../../services/auction.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Procurementitem} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';

@Component({
  selector: 'app-auction-update-form',
  templateUrl: './auction-update-form.component.html',
  styleUrls: ['./auction-update-form.component.scss']
})
export class AuctionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  auction: Auction;

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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.procurementitemService.getAllItemForAllocation().then((procurementitemDataPage) => {
      this.procurementitems = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.auction = await this.auctionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_AUCTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_AUCTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_AUCTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_AUCTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_AUCTION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.buyerField.pristine) {
      this.buyerField.setValue(this.auction.buyer);
    }
    if (this.procurementitemField.pristine) {
      this.procurementitemField.setValue(this.auction.procurementitem.id);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.auction.amount);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.auction.date);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.auction.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newauction: Auction = new Auction();
    newauction.buyer = this.buyerField.value;
    newauction.procurementitem = this.procurementitemField.value;
    newauction.amount = this.amountField.value;
    newauction.date = DateHelper.getDateAsString(this.dateField.value);
    newauction.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.auctionService.update(this.selectedId, newauction);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/auctions/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/auctions');
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
}
