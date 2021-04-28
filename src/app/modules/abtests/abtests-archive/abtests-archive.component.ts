import { AfterViewChecked, Component, OnInit } from '@angular/core';
import {
  AbtestArchive,
  AbtestArchiveExtended,
  VariantArchiveExtended
} from '../../../core/models/abtests';
import { SiteShort } from '../../../core/models/sites';
import { BinsDataService } from '../services/bins-data.service';
import { CoreSitesService } from '../../../core/services/core-sites.service';
import { SitesService } from '../../sites/services/sites.service';
import { AbtestsService } from '../services/abtests.service';


@Component({
  selector: 'app-abtests-archive',
  templateUrl: './abtests-archive.component.html',
  styleUrls: ['../shared/shared.scss', './abtests-archive.component.scss']
})
export class AbtestsArchiveComponent implements OnInit, AfterViewChecked {
  public abTests: AbtestArchiveExtended[] = [];
  public sites =  [{ id: 'allsitesid', name: 'Все сайты' }];
  public showWhat = 'ALL';
  public allABTests = [];
  public isLoad = false;

  public currSite;

  constructor(
    private binsDataService: BinsDataService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private abTestsService: AbtestsService
  ) { }

  ngOnInit(): void {
    this.initSites();
    this.initTests();
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip();
  }

  private initSites() {
    this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {

    this.coreSitesService.sites = response;
    this.sites = this.sites.concat(response);
    this.currSite = this.sites[0].id;
    });
  }

  private initTests() {
    this.abTestsService.getArchTests().subscribe((response: AbtestArchive[]) => {
      this.allABTests = response;
      this.abTests = this.allABTests;
      this.isLoad = true;
      this.getConversions();
    });
  }

  private getConversions() {
    this.abTests.forEach((test: AbtestArchiveExtended) => {
      test.variants.forEach((variant: VariantArchiveExtended) => {
        variant.conversion = this.getConvItem(variant);
        variant.convNumber = this.getConvNumber(variant);

        if (variant.etalon) {
          test.etalonConversion = variant.convNumber;
        }
        if (typeof test.etalonConversion !== 'undefined') {
          variant.betterTo =
            test.etalonConversion !== 0 ? (((variant.convNumber - test.etalonConversion) / test.etalonConversion) * 100) : 0;
          variant.betterTo = Math.round(variant.betterTo * 100) / 100;
        }
      });
    });
  }

  private getConvItem(item) {
    const conv = this.binsDataService.distRound(item.target / item.shows);
    return item.shows !== 0 ? conv : '0%';
  }

  private getConvNumber(item) {
    if (item.shows !== 0) {
      return item.target / item.shows;
    } else {
      return 0;
    }
  }

  public setCurrSite(site) {
    this.currSite = site.id;
    this.getTestsById();
  }

  public deleteArchTest(id, index) {
    this.abTestsService.deleteArchTest(id).subscribe((response: boolean) => {
      if (response) {
        this.abTests.splice(index, 1);
        this.abTestsService.getArchTests().subscribe((getTestsResponse: AbtestArchive[]) => {
          this.allABTests = getTestsResponse;
        });
      }
    });
  }

  public getClassForBetterTo(item) {
    let className = '';

    if (!item.etalon && (item.shows !== 0)) {
      if (item.betterTo > 0) {
        className = 'set-positive-better-color';
      } else if (item.betterTo < 0) {
        className = 'set-negative-better-color';
      }
    }

    return className;
  }

  public showBetterToValue(item) {
    if (item.etalon) {
      return 'Эталон';
    }
    if (item.shows === 0) {
      return '-';
    }
    if (item.betterTo > 0) {
      return '+' + item.betterTo + '%';
    }
    if (item.betterTo < 0) {
      return item.betterTo + '%';
    }

    return '';
  }

  private getTestsById() {
    this.showWhat = 'ALL';
    if (this.currSite === 'allsitesid') {
      this.abTests = this.allABTests;
    } else {
      this.abTests = this.allABTests.filter((item) => {
        return item.siteId === this.currSite;
      });
    }
  }

  public getSiteName(siteId: string): string {
    const site = this.getSiteById(siteId);
    if (site != null) {
      return site.name;
    } else {
      return '';
    }
  }

  public getCroppedString(str: string, count: number, addedSymbol: string): string {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }
    return str;
  }

  private getSiteById(siteId) {
    for (const item of this.sites) {
      if (item.id === siteId) {
        return item;
      }
    }
    return null;
  }


}
