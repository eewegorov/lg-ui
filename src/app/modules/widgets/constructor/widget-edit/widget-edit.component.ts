import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FlowDirective } from '@flowjs/ngx-flow';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;

  public weekDays = [];
  private autoUploadSubscription: SubscriptionLike;

  constructor(private translate: TranslateService) {
    this.weekDays = [
      { id: 0, name: this.translate.instant('global.week.monday') },
      { id: 1, name: this.translate.instant('global.week.tuesday') },
      { id: 2, name: this.translate.instant('global.week.wednesday') },
      { id: 3, name: this.translate.instant('global.week.thursday') },
      { id: 4, name: this.translate.instant('global.week.friday') },
      { id: 5, name: this.translate.instant('global.week.saturday') },
      { id: 6, name: this.translate.instant('global.week.sunday') }
    ];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.uploadAdded();
        this.flow.upload();
      }
    });
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}
