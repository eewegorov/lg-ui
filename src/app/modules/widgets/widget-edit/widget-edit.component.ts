import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlowDirective } from '@flowjs/ngx-flow';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;

  private autoUploadSubscription: SubscriptionLike;

  constructor() { }

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
