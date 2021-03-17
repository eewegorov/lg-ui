import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { FlowDirective } from '@flowjs/ngx-flow';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;

  private autoUploadSubscription: SubscriptionLike;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.uploadAdded(event.event);
        this.flow.upload();
      }
    });
  }

  private uploadAdded(file) {
    this.myFile = file.file;
    if (file.file.type === 'image/jpeg' || file.file.type === 'image/png' || file.file.type === 'image/gif') {
      setTimeout(() => {
        this.uploadFile();
      }, 500);
    } else {
      toastr["error"]('Формат изображения должен быть .png, .jpg  или .gif', 'Ошибка!');
    }
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

