import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Print} from '../../../../entities/print';
import {PrintService} from '../../../../services/print.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Printorder} from '../../../../entities/printorder';
import {PrintorderService} from '../../../../services/printorder.service';

@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss']
})
export class PrintFormComponent extends AbstractComponent implements OnInit {

  printorders: Printorder[] = [];

  form = new FormGroup({
    printorder: new FormControl(null, [
      Validators.required,
    ]),
    sdate: new FormControl(null, [
      Validators.required,
    ]),
  });

  get printorderField(): FormControl{
    return this.form.controls.printorder as FormControl;
  }

  get sdateField(): FormControl{
    return this.form.controls.sdate as FormControl;
  }

  constructor(
    private printorderService: PrintorderService,
    private printService: PrintService,
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

    this.printorderService.getAllBasic(new PageRequest()).then((printorderDataPage) => {
      this.printorders = printorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const print: Print = new Print();
    print.printorder = this.printorderField.value;
    print.sdate = DateHelper.getDateAsString(this.sdateField.value);
    try{
      const resourceLink: ResourceLink = await this.printService.add(print);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/prints/' + resourceLink.id);
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
          if (msg.printorder) { this.printorderField.setErrors({server: msg.printorder}); knownError = true; }
          if (msg.sdate) { this.sdateField.setErrors({server: msg.sdate}); knownError = true; }
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
