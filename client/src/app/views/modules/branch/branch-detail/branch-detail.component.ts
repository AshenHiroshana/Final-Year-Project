import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent extends AbstractComponent implements OnInit {

  branch: Branch;
  selectedId: number;
  urlSafe: SafeResourceUrl;
  photo: string = null;
  photos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    public sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshRate = 60000;
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.branch.code + ' - ' + this.branch.city}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.branchService.delete(this.selectedId);
        await this.router.navigateByUrl('/branches');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.branch = await this.branchService.get(this.selectedId);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.branch.maplink);
    if (this.branch.photo == null){
      this.photo = null;
    }else {
      const photoObject = await this.branchService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }

    if (this.branch.branchbranchplanList == null || this.branch.branchbranchplanList === []){
      this.photos = null;
    }else {
      this.photos = [];
      const photoObjects = await this.branchService.getPhotos(this.selectedId);
      console.log(photoObjects);
      photoObjects.forEach((object) => {
        this.photos.push(object.file);
      });
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }
}
