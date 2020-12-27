import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {
  AmoAuthResponse,
  AmoFunnel,
  AmoFunnelResponse,
  AmoGrantTypes,
  AmoParams,
  AmoStatus,
  BitrixConnectionTypes,
  CreateIntegrationRequest,
  FunnelCheckDuplicate,
  FunnelCheckDuplicateValues,
  Integration,
  IntegrationItem,
  IntegrationService,
  IntegrationTypes,
  SiteShort
} from '../../../core/models/sites';
import {SitesService} from '../services/sites.service';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-integration-add',
  templateUrl: './integration-add.component.html',
  styleUrls: ['./integration-add.component.scss']
})
export class IntegrationAddComponent implements OnInit, AfterViewChecked {
  @Input() private siteId: string;
  @Input() private integrationId: string;
  public IntegrationTypes = IntegrationTypes;
  public BitrixTypes = BitrixConnectionTypes;
  public AmoGrantTypes = AmoGrantTypes;
  public item;
  public sites = [];
  public defIntegrationServiceName = '';
  public defIntegrationSiteName = '';
  public currentIntegrationService = {} as IntegrationService;
  public newCurrentIntegration = { default: true } as IntegrationItem;
  public currentIntegrationSite = {} as IntegrationItem;
  public currentIntegrationSiteService = { default: true } as IntegrationItem;
  public editableIntegration;
  public editableIntegrationServiceName;
  public isEditIntegration;
  public tab: 'NEW' | 'EDIT' | 'COPY' = 'NEW';
  public integrationIsOnProgress = false;
  public integrationServices;
  public getResponseParams = { code: '', campaignId: '' };
  public mailchimpUniParams = { code: '', listId: '' };
  public sendPBParams = { id: '', secret: '', book: '' };
  public bitrixWebhookParams = { url: '', hash: '' };
  public bitrixApiParams = { host: '', login: '', password: '' };
  public amoParams: AmoParams = { subdomain: '', clientId: '', clientSecret: '', code: '', accessToken: '', refreshToken: '',
    funnelId: '', funnelName: '', leadStateId: '', leadStateName: '', checkDuplicate: FunnelCheckDuplicate.NONE };
  public emailParams = { email: '' };
  public roistatParams = { url: '' };
  public currentIntegrationSiteServiceClone = {} as IntegrationItem;
  public integrationSitesLoading = false;
  public integrationSiteServicesCRM;
  public integrationSiteServicesMailing;
  public integrationSiteServicesNotifications;
  public integrationSiteServicesOthers;
  public integrationFieldsIds = [{ leadGenicId: '', crmId: '' }];
  public bitrixConnectionType: BitrixConnectionTypes = BitrixConnectionTypes.Webhook;
  public funnelCheckDuplicates = FunnelCheckDuplicateValues;
  public pipelines: AmoFunnel[] = [];
  public leadStates: AmoStatus[] = [];
  public isAmoActivated = false;


  constructor(
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private sitesService: SitesService
  ) {
  }

  ngOnInit(): void {
    this.isEditIntegration = !!this.integrationId;
    this.defIntegrationServiceName = this.translate.instant('settings.site.newIntegration.choseIntegrationService');
    this.defIntegrationSiteName = this.translate.instant('widgetsList.add.chooseSite');

    this.integrationServices = this.sitesService.getIntegrationServicesList();
    if (this.isEditIntegration) {
      this.tab = 'EDIT';
      this.editableIntegration = {};
      /*this.sitesService.getSiteIntegration(this.siteId, this.integrationId).subscribe((response: IntegrationItem) => {*/
      const response: IntegrationItem = {
        id: '8330be13431534c0f3808286ea145a9e',
        name: 'Bitrix integrations',
        active: false,
        type: 'AMOCRM',
        params: {
          subdomain: 'dfggdgd',
            clientId: 'ytitit',
        clientSecret: 'yututyut',
        accessToken: 'rthrtyrty',
        refreshToken: 'rghgfhgfh',
        funnelId: 'ryrtyrty',
        leadStateId: 'ttyutu',
        checkDuplicate: 'EMAIL'
    },
        customFieldsMapping: {},
        default: false
      };

      this.editableIntegration = response;

      if (response.type === IntegrationTypes.BITRIX) {
        this.bitrixConnectionType = response.params.login ? BitrixConnectionTypes.Api : BitrixConnectionTypes.Webhook;
      }

      if (response.type === IntegrationTypes.AMOCRM) {
        if (response.params.funnelId) {
          this.pipelines.push({ id: response.params.funnelId, name: response.params.funnelId } as AmoFunnel);

          this.editableIntegration.params = {...this.editableIntegration.params, funnelName: response.params.funnelId};
        }

        if (response.params.leadStateId) {
          this.leadStates.push({ id: response.params.leadStateId, name: response.params.leadStateId } as AmoStatus);

          this.editableIntegration.params = {...this.editableIntegration.params, leadStateName: response.params.leadStateId};
        }

        Object.entries(response.customFieldsMapping).forEach((value) => {
          this.integrationFieldsIds.push({ leadGenicId: value[0], crmId: value[1] as string });
        });

        if (this.integrationFieldsIds.length > 1) {
          this.integrationFieldsIds.shift();
        }

        this.activateIntegration(AmoGrantTypes.RefreshToken);
      }

      this.editableIntegrationServiceName = this.sitesService.getCorrectNameByType(response.type);
      /*});*/
    }
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip();
  }

  public setIntegrationType(newTab) {
    this.tab = newTab;
    if (newTab === 'COPY') {
      /*this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {*/
      const response =  [
        {
          id: '5a57b226936a824c0396eb0b',
          name: 'Another site',
          url: 'another.com',
          tariffName: 'Another',
          tariffExp: null,
          trial: false
        },
        {
          id: '5a57b226936a824c0396eb0a',
          name: 'Test site',
          url: 'test.com',
          tariffName: 'Payment',
          tariffExp: 1484032321000,
          trial: true
        }
      ];
      this.sitesService.sites = response;
      this.sites = response.filter((item: SiteShort) => {
          return item.id !== this.siteId;
        });
      /*});*/
    }
  }

  public changeCurrentIntegrationService(service) {
    this.currentIntegrationService = service;
  }

  public changeCurrentIntegrationSite(site) {
    this.currentIntegrationSite = site;
    this.integrationSitesLoading = true;
    /*this.sitesService.getSiteIntegrations(site.id).subscribe((response: Integration[]) => {*/
    const response =  [
      {
        id: 'a97e831035277bdb2d580cce4de0e399',
        name: 'Amo integration',
        type: 'AMOCRM',
        default: true,
        active: false
      },
      {
        id: '3d2591d2fe9af9c2e126168865719e22',
        name: 'Another bitrix integration',
        type: 'BITRIX',
        default: false,
        active: true
      },
      {
        id: 'ff8b3189fea5aab92ecb6fad14b2ed0d',
        name: 'Bitrix integrations',
        type: 'BITRIX',
        default: true,
        active: false
      }
    ];
    const integrationSiteServices = response;

    this.integrationSiteServicesCRM = integrationSiteServices.filter((item: Integration) => {
        return this.sitesService.isIntegrationCRM(item.type);
      });
    this.integrationSiteServicesMailing = integrationSiteServices.filter((item: Integration) => {
        return this.sitesService.isIntegrationMailing(item.type);
      });
    this.integrationSiteServicesNotifications = integrationSiteServices.filter((item: Integration) => {
        return this.sitesService.isIntegrationNotification(item.type);
      });
    this.integrationSiteServicesOthers = integrationSiteServices.filter((item: Integration) => {
        return this.sitesService.isIntegrationOthers(item.type);
      });
    this.integrationSitesLoading = false;
    /*});*/
  }

  public changeCurrentIntegrationSiteService(service) {
    this.currentIntegrationSiteService = service;
  }

  public changeCurrentFunnelId(funnelId: string, funnelName: string) {
    if (this.amoParams.funnelId) {
      this.amoParams.funnelId = funnelId;
      this.amoParams.funnelName = funnelName;
    } else {
      this.editableIntegration.params.funnelId = funnelId;
      this.editableIntegration.params.funnelName = funnelName;
    }

    this.leadStates = this.pipelines
      .filter((pipeline: AmoFunnel) => pipeline.id.toString() === funnelId)[0]?._embedded?.statuses;
  }

  public changeCurrentFunnelLeadStateId(leadStateId: string, leadStateName: string) {
    if (this.amoParams.leadStateId) {
      this.amoParams.leadStateId = leadStateId;
      this.amoParams.leadStateName = leadStateName;
    } else {
      this.editableIntegration.params.leadStateId = leadStateId;
      this.editableIntegration.params.leadStateName = leadStateName;
    }
  }

  public changeCurrentFunnelCheckDuplicates(checkDuplicate: string) {
    if (this.amoParams.checkDuplicate) {
      this.amoParams.checkDuplicate = checkDuplicate as FunnelCheckDuplicate;
    } else {
      this.editableIntegration.params.checkDuplicate = checkDuplicate as FunnelCheckDuplicate;
    }
  }

  public returnZero() {
    return 0;
  }

  public closeModal(result?): void {
    this.activeModal.close(result);
  }

  public activateIntegration(grantType: AmoGrantTypes) {
    let subdomain = '';
    let clientId = '';
    let clientSecret = '';
    let code = '';
    let refreshToken = '';

    if (this.tab === 'EDIT') {
      subdomain = this.editableIntegration.params.subdomain;
      clientId = this.editableIntegration.params.clientId;
      clientSecret = this.editableIntegration.params.clientSecret;
      code = this.editableIntegration.params.code;
      refreshToken = this.editableIntegration.params.refreshToken;
    } else {
      subdomain = this.amoParams.subdomain;
      clientId = this.amoParams.clientId;
      clientSecret = this.amoParams.clientSecret;
      code = this.amoParams.code;
    }

    const credentials = grantType === AmoGrantTypes.AuthCode ? code : refreshToken;

    this.sitesService
      .getAmoTokens(subdomain, clientId, clientSecret, grantType, credentials)
      .pipe(
        switchMap((amoTokens: AmoAuthResponse) => {
          if (this.tab === 'EDIT') {
            this.editableIntegration.params.accessToken = amoTokens.access_token;
            this.editableIntegration.params.refreshToken = amoTokens.refresh_token;
          } else {
            this.amoParams.accessToken = amoTokens.access_token;
            this.amoParams.refreshToken = amoTokens.refresh_token;
          }
          const authHeader = `Bearer ${amoTokens.access_token}`;
          return this.sitesService.getAmoFunnels(subdomain, authHeader);
        })
      )
      .subscribe((funnel: AmoFunnelResponse) => {
        this.pipelines = funnel._embedded.pipelines;
        this.leadStates = this.pipelines[0]._embedded.statuses;

        if (this.tab !== 'EDIT') {
          this.amoParams = {
            ...this.amoParams,
            funnelId: this.pipelines[0].id.toString(),
            funnelName: this.pipelines[0].name,
            leadStateId: this.pipelines[0]._embedded.statuses[0].id.toString(),
            leadStateName: this.pipelines[0]._embedded.statuses[0].name
          };
        } else {
          const existedFunnel = this.pipelines.filter(
            (amoFunnel: AmoFunnel) => amoFunnel.id === this.editableIntegration.params.funnelId)[0];
          const existedLeadState = existedFunnel._embedded.statuses.filter(
            (amoLeadState: AmoStatus) => amoLeadState.id === this.editableIntegration.params.leadStateId)[0];

          this.editableIntegration.params = {
            ...this.editableIntegration.params,
            funnelId: existedFunnel.id ? existedFunnel.id : this.pipelines[0].id.toString(),
            funnelName: existedFunnel.id ? existedFunnel.name : this.pipelines[0].name,
            leadStateId: existedLeadState.id ? existedLeadState.id : this.pipelines[0]._embedded.statuses[0].id.toString(),
            leadStateName: existedLeadState.id ? existedLeadState.name : this.pipelines[0]._embedded.statuses[0].name
          };
        }

        this.isAmoActivated = true;
    });
  }

  public loadIntegration() {
    let accessToken = '';
    let subdomain = '';

    if (this.tab === 'EDIT') {
      accessToken = this.editableIntegration.params.accessToken;
      subdomain = this.editableIntegration.params.subdomain;
    } else {
      accessToken = this.amoParams.accessToken;
      subdomain = this.amoParams.subdomain;
    }

    const authHeader = `Bearer ${accessToken}`;

    this.sitesService.getAmoFunnels(subdomain, authHeader)
      .subscribe((funnel: AmoFunnelResponse) => {
        this.pipelines = funnel._embedded.pipelines;
        this.leadStates = this.pipelines
          .filter((pipeline: AmoFunnel) => pipeline.id.toString() === this.amoParams.funnelId)[0]._embedded.statuses;
        this.leadStates = this.pipelines[0]._embedded.statuses;
    });
  }

  public createIntegration() {
    this.integrationIsOnProgress = true;

    if (this.tab === 'COPY') {
      this.sitesService.cloneSiteIntegration(
        this.siteId, this.currentIntegrationSiteService.id,
        this.currentIntegrationSiteServiceClone.name,
        this.currentIntegrationSite.id,
        this.currentIntegrationSiteService.default
      ).subscribe((response: IntegrationItem) => {
        if (response) {
          this.toastr.success(this.translate.instant('settings.site.newIntegration.create.created'), this.translate.instant('global.done'));
          this.finishResponseProcess(true, response);
        } else {
          this.toastr.error(this.translate.instant('settings.site.newIntegration.create.error'), this.translate.instant('global.error'));
          this.finishResponseProcess(false);
        }
      });
    } else if (this.tab === 'NEW') {
      const integration: CreateIntegrationRequest = {
        name: this.newCurrentIntegration.name,
        type: this.currentIntegrationService.type,
        default: this.newCurrentIntegration.default,
        params: {},
        customFieldsMapping: {}
      };
      switch (this.currentIntegrationService.type) {
        case IntegrationTypes.GETRESPONSE:
          integration.params = {
            code: this.getResponseParams.code,
            campaignId: this.getResponseParams.campaignId
          };
          break;
        case IntegrationTypes.MAILCHIMP:
        case IntegrationTypes.UNISENDER:
          integration.params = {
            code: this.mailchimpUniParams.code,
            listId: this.mailchimpUniParams.listId
          };
          break;
        case IntegrationTypes.SENDPULSE:
        case IntegrationTypes.SENDBOX:
          integration.params = {
            id: this.sendPBParams.id,
            secret: this.sendPBParams.secret,
            book: this.sendPBParams.book
          };
          break;
        case IntegrationTypes.BITRIX:
          if (this.bitrixConnectionType === BitrixConnectionTypes.Api) {
            integration.params = {
              host: this.bitrixApiParams.host,
              login: this.bitrixApiParams.login,
              password: this.bitrixApiParams.password
            };
          } else {
            integration.params = {
              url: this.bitrixWebhookParams.url,
              hash: this.bitrixWebhookParams.hash
            };

            integration.customFieldsMapping = this.integrationFieldsIds.reduce(
              (obj, item) =>
                item.leadGenicId !== '' && item.crmId !== '' ? (obj[item.leadGenicId] = item.crmId, obj) : obj, {});
          }
          break;
        case IntegrationTypes.AMOCRM:
          integration.params = {
            subdomain: this.amoParams.subdomain,
            clientId: this.amoParams.clientId,
            clientSecret: this.amoParams.clientSecret,
            accessToken: this.amoParams.accessToken,
            refreshToken: this.amoParams.refreshToken,
            funnelId: this.amoParams.funnelId,
            leadStateId: this.amoParams.leadStateId,
            checkDuplicate: this.amoParams.checkDuplicate
          };

          integration.customFieldsMapping = this.integrationFieldsIds.reduce(
            (obj, item) =>
              item.leadGenicId !== '' && item.crmId !== '' ? (obj[item.leadGenicId] = item.crmId, obj) : obj, {});
          break;
        case IntegrationTypes.EMAIL:
          integration.params = {
            email: this.emailParams.email
          };
          break;
        case IntegrationTypes.ROISTAT:
        case IntegrationTypes.WEBHOOK:
          integration.params = {
            url: this.roistatParams.url
          };
      }

      this.sitesService.createSiteIntegration(this.siteId, integration).subscribe((response: IntegrationItem) => {
        if (response) {
          this.toastr.success(this.translate.instant('settings.site.newIntegration.create.created'), this.translate.instant('global.done'));
          this.finishResponseProcess(true, response);
        } else {
          this.toastr.error(this.translate.instant('settings.site.newIntegration.create.error'), this.translate.instant('global.error'));
          this.finishResponseProcess(false);
        }
      });
    }
  }

  public disableCreation() {
    if (this.tab === 'NEW') {
      if (!this.newCurrentIntegration.name || !this.currentIntegrationService.type || this.integrationIsOnProgress) {
        return true;
      }

      switch (this.currentIntegrationService.type) {
        case IntegrationTypes.GETRESPONSE:
          return !this.getResponseParams.code || !this.getResponseParams.campaignId;
        case IntegrationTypes.MAILCHIMP:
        case IntegrationTypes.UNISENDER:
          return !this.mailchimpUniParams.code || !this.mailchimpUniParams.listId;
        case IntegrationTypes.SENDPULSE:
        case IntegrationTypes.SENDBOX:
          return !this.sendPBParams.id || !this.sendPBParams.secret || !this.sendPBParams.book;
        case IntegrationTypes.BITRIX:
          if (this.bitrixConnectionType === BitrixConnectionTypes.Api) {
            return !this.bitrixApiParams.host || !this.bitrixApiParams.login || !this.bitrixApiParams.password;
          } else {
            return !this.bitrixWebhookParams.url || !this.bitrixWebhookParams.hash;
          }
        case IntegrationTypes.AMOCRM:
          return !this.amoParams.subdomain || !this.amoParams.clientId || !this.amoParams.clientSecret
            || !this.amoParams.accessToken || !this.amoParams.refreshToken || !this.amoParams.funnelId
            || !this.amoParams.leadStateId || !this.amoParams.checkDuplicate;
        case IntegrationTypes.EMAIL:
          return !this.emailParams.email;
        case IntegrationTypes.ROISTAT:
        case IntegrationTypes.WEBHOOK:
          return !this.roistatParams.url;
      }
    } else if (this.tab === 'COPY') {
      return !this.currentIntegrationSiteServiceClone.name ||
        !this.currentIntegrationSiteService.id ||
        !this.currentIntegrationSite.id ||
        this.integrationIsOnProgress;
    }
  }

  public disableActivation() {
    return !this.amoParams.subdomain || !this.amoParams.clientId || !this.amoParams.clientSecret || !this.amoParams.code;
  }

  public disableEditingActivation() {
    return !this.editableIntegration.params.subdomain || !this.editableIntegration.params.clientId
      || !this.editableIntegration.params.clientSecret || !this.editableIntegration.params.code;
  }

  public updateIntegration() {
    this.integrationIsOnProgress = true;

    this.editableIntegration.customFieldsMapping = this.integrationFieldsIds.reduce(
      (obj, item) =>
        item.leadGenicId !== '' && item.crmId !== '' ? (obj[item.leadGenicId] = item.crmId, obj) : obj, {});

    this.sitesService.updateSiteIntegration(
      this.siteId, this.editableIntegration.id, this.editableIntegration
    ).subscribe((response: boolean) => {
      if (response) {
        this.toastr.success(this.translate.instant('settings.site.newIntegration.updated'), this.translate.instant('global.done'));
        this.finishResponseProcess(true);
      } else {
        this.toastr.error(this.translate.instant('settings.site.newIntegration.create.error'), this.translate.instant('global.error'));
        this.finishResponseProcess(false);
      }
    });
  }

  public disableUpdation() {
    if (!this.editableIntegration.name) {
      return true;
    }

    switch (this.editableIntegration.type) {
      case IntegrationTypes.GETRESPONSE:
        return !this.editableIntegration.params.code || !this.editableIntegration.params.campaignId;
      case IntegrationTypes.MAILCHIMP:
      case IntegrationTypes.UNISENDER:
        return !this.editableIntegration.params.code || !this.editableIntegration.params.listId;
      case IntegrationTypes.SENDPULSE:
      case IntegrationTypes.SENDBOX:
        return !this.editableIntegration.params.id || !this.editableIntegration.params.secret
          || !this.editableIntegration.params.book;
      case IntegrationTypes.BITRIX:
        if (this.bitrixConnectionType === BitrixConnectionTypes.Api) {
          return !this.editableIntegration.params.host || !this.editableIntegration.params.login
            || !this.editableIntegration.params.password;
        } else {
          return !this.editableIntegration.params.url || !this.editableIntegration.params.hash;
        }
      case IntegrationTypes.AMOCRM:
        return !this.editableIntegration.params.subdomain || !this.editableIntegration.params.clientId
          || !this.editableIntegration.params.clientSecret || !this.editableIntegration.params.accessToken
          || !this.editableIntegration.params.refreshToken || !this.editableIntegration.params.funnelId
          || !this.editableIntegration.params.leadStateId || !this.editableIntegration.params.checkDuplicate;
      case IntegrationTypes.EMAIL:
        return !this.editableIntegration.params.email;
      case IntegrationTypes.ROISTAT:
      case IntegrationTypes.WEBHOOK:
        return !this.editableIntegration.params.url;
    }
  }

  public addIntegrationField() {
    this.integrationFieldsIds.push({ leadGenicId: '', crmId: '' });
  }

  public deleteIntegrationField(index: number) {
    if (this.integrationFieldsIds.length > 1) {
      this.integrationFieldsIds.splice(index, 1);
    }
  }

  private finishResponseProcess(isNeedClose: boolean, response?) {
    this.integrationIsOnProgress = false;
    if (!isNeedClose) {
      return false;
    }

    setTimeout(() => {
      this.closeModal(response);
    }, 500);
  }

}
