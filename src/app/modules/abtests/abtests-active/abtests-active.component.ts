import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AbtestsService } from '../services/abtests.service';
import { Abtest } from '../../../core/models/abtests';

@Component({
  selector: 'app-abtests-active',
  templateUrl: './abtests-active.component.html',
  styleUrls: ['./abtests-active.component.scss']
})
export class AbtestsActiveComponent implements OnInit {
  public currSite = '';
  public sites =  [{ id: 'allsitesid', name: 'Все сайты' }];
  public showWhat = 'ALL';
  public allABTests = [];
  public abTests = [];
  public isLoad = false;
  public showOnlyIfNoTestsForCurrentSite = false;
  public test = {
    id: 'dfsdfds12',
    name: 'dsfsfsf',
    description: 'dsfsfdsf'
  };
  public item = {
    name: 'dfdsfds',
    convInfo: {
      n: 2,
      s: 3,
      conversion: 23
    }
  };
  public type = {
    type: 'asddad',
    title: 'dsfdsfds'
  };
  public mckp = {
    preview: 'dfdsfsfs',
    name: 'dfdsfsf',
    description: 'dsfsffds'
  };
  public grp = {
    name: 'sdfsf'
  };
  public cat = {
    name: 'dsfsdf'
  };

  constructor(
    private translate: TranslateService,
    private abTestsService: AbtestsService
  ) { }

  ngOnInit(): void {
  }

  public getSiteName(site) {

  }

  public getCroppedString(siteName, count, end) {

  }

  public trackById(index, item) {
    return item.id;
  }

  public startTest(test) {
    if (test.state === 'PAUSED') {
      this.abTestsService.start(test.id).subscribe((response: number) => {
        if (response === 200) {
          test.state = 'ACTIVE';
        } else if(response === 402) {
          this.showPaymentDialog(
            test.siteId,
            this.translate.instant('widgetsList.payment.abtest', { 0: this.getSiteName(test.siteId)})
          );
        }
      });
    }
  }

  public pauseTest(test) {
    if(test.state === 'ACTIVE') {
      this.abTestsService.pause(test.id).subscribe((response: number) => {
        if(response === 200) {
          test.state = 'PAUSED';
        }
      });
    }
  }

  public deleteTest(id, index) {
    Swal.fire({
      title: "Вы уверены?",
      text: "A/B тест будет остановлен и перемещен в архив.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Да, уверен",
      cancelButtonText: "Отмена"
    }).then(
      (isConfirm) => {
        if (isConfirm) {
          setTimeout(() => {
            $('[role="tooltip"]').remove();
            this.abTestsService.deleteTest(id).subscribe((response: boolean) => {
              if (response) {
                this.abTests.splice(index, 1);
                this.abTestsService.getTests().subscribe((response: Abtest[]) => {
                  this.allABTests = response;
                });
              }
            });
          }, 0);
        }
      });
  };

  public updateTest(test) {
    const testForUpdate = {
      name: test.name,
      description: test.description
    };
    this.abTestsService.update(test.id, testForUpdate);
  }

  public setCurrSite(site) {
    this.currSite = site.id;
    this.getTestsById();
  }

  public getTestsByState(state) {
    this.getTestsById();
    this.showWhat = state;
    if (this.showWhat === 'ACTIVE') {
      this.abTests = this.abTests.filter((item) => {
        return item.state === 'ACTIVE';
      });
    } else if (this.showWhat === 'PAUSED') {
      this.abTests = this.abTests.filter((item) => {
        return item.state === 'PAUSED';
      });
    }
  }

  private getTestsById() {
    this.showWhat = 'ALL';
    this.showOnlyIfNoTestsForCurrentSite = false;
    if (this.currSite === 'allsitesid') {
      this.abTests = this.allABTests;
    } else {
      this.abTests = this.allABTests.filter((item) => {
        return item.siteId === this.currSite;
      });
      if (!this.abTests.length) {
        this.showOnlyIfNoTestsForCurrentSite = true;
      }
    }
  }

  private showPaymentDialog(siteId, description) {
    /*window.siteTariffModal.find("h5.paymentSubscription").html(description);
    window.siteTariffModal.find("span.site-name").html(this.getSiteName(siteId));
    window.siteTariffModal.attr("data-id", siteId);
    this.loadPlans();*/
  };

}
