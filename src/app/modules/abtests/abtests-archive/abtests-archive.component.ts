import { Component, OnInit } from '@angular/core';
import { AbtestsService } from '../services/abtests.service';
import { Abtest } from '../../../core/models/abtests';

@Component({
  selector: 'app-abtests-archive',
  templateUrl: './abtests-archive.component.html',
  styleUrls: ['../shared/shared.scss', './abtests-archive.component.scss']
})
export class AbtestsArchiveComponent implements OnInit {
  public abTests = [];
  public sites =  [{ id: 'allsitesid', name: 'Все сайты' }];
  public showWhat = 'ALL';
  public allABTests = [];
  public isLoad = false;

  public currSite;

  constructor(private abTestsService: AbtestsService) { }

  ngOnInit(): void {
  }

  public setCurrSite(site) {
    this.currSite = site.id;
    this.getTestsById();
  }

  public deleteArchTest(id, index) {
    this.abTestsService.deleteArchTest(id).subscribe((response: boolean) => {
      if (response) {
        this.abTests.splice(index, 1);
        this.abTestsService.getArchTests().subscribe((getTestsResponse: Abtest[]) => {
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

    return item.betterTo + '%';
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

  public getSiteName(site) {

  }

  public getCroppedString(siteName, count, end) {

  }

}
