import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Workexperience} from '../../../../../entities/workexperience';

@Component({
  selector: 'app-workexperience-update-sub-form',
  templateUrl: './workexperience-update-sub-form.component.html',
  styleUrls: ['./workexperience-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WorkexperienceUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WorkexperienceUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class WorkexperienceUpdateSubFormComponent extends AbstractSubFormComponent<Workexperience> implements OnInit{


  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    title: new FormControl(),
    description: new FormControl(),
    file: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get titleField(): FormControl{
    return this.form.controls.title as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get fileField(): FormControl{
    return this.form.controls.file as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.titleField)
      &&   this.isEmptyField(this.descriptionField)
      &&   this.isEmptyField(this.fileField);
  }

  constructor(
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
  }

  setValidations(): void{
    this.hasValidations = true;
    this.titleField.setValidators([
      Validators.required,
      Validators.maxLength(255),
    ]);
    this.descriptionField.setValidators([
      Validators.maxLength(65535),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.titleField.clearValidators();
    this.descriptionField.clearValidators();
  }

  fillForm(dataItem: Workexperience): void {
    this.idField.patchValue(dataItem.id);
    this.titleField.patchValue(dataItem.title);
    this.descriptionField.patchValue(dataItem.description);
    if (dataItem.file){
      this.fileField.patchValue([dataItem.file]);
    } else {
      this.fileField.patchValue([]);
    }
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(workexperience: Workexperience): string {
    return 'Are you sure to remove \u201C ' + workexperience.title + ' \u201D from work experience?';
  }

  getUpdateConfirmMessage(workexperience: Workexperience): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + workexperience.title + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + workexperience.title + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Workexperience = new Workexperience();
    dataItem.id = this.idField.value;
    dataItem.title = this.titleField.value;
    dataItem.description = this.descriptionField.value;
    const fileIds = this.fileField.value;
    if (fileIds !== null && fileIds !== []){
      dataItem.file = fileIds[0];
    }else{
      dataItem.file = null;
    }
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
