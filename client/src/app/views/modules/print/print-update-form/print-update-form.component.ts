import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Print} from '../../../../entities/print';
import {PrintService} from '../../../../services/print.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Printorder} from '../../../../entities/printorder';
import {Printstatus} from '../../../../entities/printstatus';
import {PrintorderService} from '../../../../services/printorder.service';
import {PrintstatusService} from '../../../../services/printstatus.service';

@Component({
  selector: 'app-print-update-form',
  templateUrl: './print-update-form.component.html',
  styleUrls: ['./print-update-form.component.scss']
})
export class PrintUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  print: Print;

  printorders: Printorder[] = [];
  printstatuses: Printstatus[] = [];

  form = new FormGroup({
    printorder: new FormControl(null, [
      Validators.required,
    ]),
    sdate: new FormControl(null, [
      Validators.required,
    ]),
    edate: new FormControl(null, [
    ]),
    printstatus: new FormControl('1', [
      Validators.required,
    ]),
  });

  get printorderField(): FormControl{
    return this.form.controls.printorder as FormControl;
  }

  get sdateField(): FormControl{
    return this.form.controls.sdate as FormControl;
  }

  get edateField(): FormControl{
    return this.form.controls.edate as FormControl;
  }

  get printstatusField(): FormControl{
    return this.form.controls.printstatus as FormControl;
  }

  constructor(
    private printorderService: PrintorderService,
    private printstatusService: PrintstatusService,
    private printService: PrintService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.printstatusService.getAll().then((printstatuses) => {
      this.printstatuses = printstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.printorderService.getAllBasic(new PageRequest()).then((printorderDataPage) => {
      this.printorders = printorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.print = await this.printService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.printorderField.pristine) {
      this.printorderField.setValue(this.print.printorder.id);
    }
    if (this.sdateField.pristine) {
      this.sdateField.setValue(this.print.sdate);
    }
    if (this.edateField.pristine) {
      this.edateField.setValue(this.print.edate);
    }
    if (this.printstatusField.pristine) {
      this.printstatusField.setValue(this.print.printstatus.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newprint: Print = new Print();
    newprint.printorder = this.printorderField.value;
    newprint.sdate = DateHelper.getDateAsString(this.sdateField.value);
    newprint.edate = this.edateField.value ? DateHelper.getDateAsString(this.edateField.value) : null;
    newprint.printstatus = this.printstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.printService.update(this.selectedId, newprint);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/prints/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/prints');
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
          if (msg.edate) { this.edateField.setErrors({server: msg.edate}); knownError = true; }
          if (msg.printstatus) { this.printstatusField.setErrors({server: msg.printstatus}); knownError = true; }
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
