import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '../../../core/models/api';
import { CreateSiteData } from '../../../core/models/sites';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../services/sites.service';


@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.scss']
})
export class SiteAddComponent implements OnInit {
  @Input() public hidePhone: boolean;
  public newSiteForm: FormGroup;
  public createdSite: CreateSiteData;
  public tab = 1;
  public isUrlInvalid = false;
  private createSiteSub: SubscriptionLike;


  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private sitesService: SitesService
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  public createSite() {
    const newSiteData = Object.assign({}, this.newSiteForm.getRawValue());
    delete newSiteData.phone;
    this.createSiteSub = this.sitesService.createSite(newSiteData).pipe(
      switchMap(
        (response: CreateSiteData) => {
          this.createdSite = {
            id: response.id,
            link: this.sitesService.generatePath(response.link),
          };
          if (this.newSiteForm.controls.phone.value) {
            return this.userService.savePhone({ phone: this.newSiteForm.controls.phone.value });
          }
        })
    ).subscribe(
      (response: ApiResponse) => {
        this.tab = 2;
      },
      error => {
        console.log(error);
        this.isUrlInvalid = true;
      }
    );
  }

  public enableTyping(): void {
    this.isUrlInvalid = false;
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  private resetForm() {
    this.newSiteForm = new FormGroup({
      name: new FormControl('', [ Validators.required ]),
      url: new FormControl('', [ Validators.required ]),
      phone: new FormControl('')
    });
  }


}
