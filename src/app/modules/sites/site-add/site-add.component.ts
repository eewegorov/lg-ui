import {AfterViewChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSiteData, Smartpoints } from '../../../core/models/sites';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../services/sites.service';
import { WidgetService } from '../../widgets/services/widget.service';


@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.scss']
})
export class SiteAddComponent implements OnInit, AfterViewChecked {
  @Input() public hidePhone: boolean;
  @Output() public updateSites = new EventEmitter<boolean>();
  public newSiteForm: FormGroup;
  public createdSite = {} as CreateSiteData;
  public tab = 1;
  public isUrlInvalid = false;
  public smartPoints = {} as Smartpoints;
  private createSiteSub: SubscriptionLike;


  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private sitesService: SitesService
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip();
  }

  public createSite() {
    const newSiteData = Object.assign({}, this.newSiteForm.getRawValue());
    delete newSiteData.phone;
    /*this.createSiteSub = this.sitesService.createSite(newSiteData).pipe(
      switchMap(
        (response: CreateSiteData) => {*/
          const response = {"id":"5a60c3891185132fa781",
            "link":"https://gate.leadgenic.ru/getscript?site=5a60c3891185132fa781"};
          this.createdSite = {
            id: response.id,
            link: this.sitesService.generatePath(response.link),
          };
          /*if (this.newSiteForm.controls.phone.value) {
            return this.userService.savePhone({ phone: this.newSiteForm.controls.phone.value });
          }*/
        /*})
    ).subscribe(
      () => {*/
        this.tab = 2;
        this.updateSites.emit(true);
      /*},
      error => {
        console.log(error);
        this.isUrlInvalid = true;
      }
    );*/
  }

  public enableTyping(): void {
    this.isUrlInvalid = false;
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public setTab(newTab) {
    if (newTab === 3) {
      /*this.sitesService.getSiteSmartpointsList(this.createdSite.id).subscribe((response: Smartpoints) => {*/
      const response = {
        "enabled": true,
        "list": [{
          "enabled": true,
          "autoinvite": true,
          "pos": "LEFT_DOWN",
          "type": "CALLBACK"
        }, {
          "enabled": false,
          "autoinvite": false,
          "pos": "LEFT_EDGE",
          "type": "POPUP"
        }]
      };
        this.smartPoints = response;
        this.tab = newTab;
      /*});*/
    } else {
      this.tab = newTab;
    }
  }

  private resetForm() {
    this.newSiteForm = new FormGroup({
      name: new FormControl('', [ Validators.required ]),
      url: new FormControl('', [ Validators.required ]),
      phone: new FormControl('')
    });
  }

}
