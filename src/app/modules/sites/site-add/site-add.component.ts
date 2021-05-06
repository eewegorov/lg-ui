import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, SubscriptionLike } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSiteData, Smartpoints } from '../../../core/models/sites';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../services/sites.service';


@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.scss']
})
export class SiteAddComponent implements OnInit, AfterViewChecked {
  @Input() public hidePhone: boolean;
  @Output() private updateSites = new EventEmitter<boolean>();
  public newSiteForm: FormGroup;
  public createdSite = {} as CreateSiteData;
  public tab = 1;
  public isUrlInvalid = false;
  public smartPoints = {} as Smartpoints;
  private createSiteSub: SubscriptionLike;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private sitesService: SitesService
  ) {
  }

  ngOnInit(): void {
    this.resetForm();
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip();
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
          } else {
            return of(null);
          }
        })
    ).subscribe(
      () => {
        this.tab = 2;
        this.updateSites.emit(true);
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

  public goToCreateOwnWidgets() {
    this.router.navigate(['widgets'], { queryParams: { enableModal: true, selected: this.createdSite.id } }).then(
      () => this.closeModal()
    );
  }

  public setTab(newTab) {
    if (newTab === 3) {
      this.sitesService.getSiteSmartpointsList(this.createdSite.id).subscribe((response: Smartpoints) => {
        this.smartPoints = response;
        this.tab = newTab;
      });
    } else {
      this.tab = newTab;
    }
  }

  private resetForm() {
    this.newSiteForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      phone: new FormControl('')
    });
  }

}
