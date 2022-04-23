import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Educationqualification} from '../../../../../entities/educationqualification';

@Component({
  selector: 'app-educationqualification-update-sub-form',
  templateUrl: './educationqualification-update-sub-form.component.html',
  styleUrls: ['./educationqualification-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EducationqualificationUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EducationqualificationUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class EducationqualificationUpdateSubFormComponent extends AbstractSubFormComponent<Educationqualification> implements OnInit{


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

  fillForm(dataItem: Educationqualification): void {
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
  getDeleteConfirmMessage(educationqualification: Educationqualification): string {
    return 'Are you sure to remove \u201C ' + educationqualification.title + ' \u201D from education qualification?';
  }

  getUpdateConfirmMessage(educationqualification: Educationqualification): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + educationqualification.title + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + educationqualification.title + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Educationqualification = new Educationqualification();
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
