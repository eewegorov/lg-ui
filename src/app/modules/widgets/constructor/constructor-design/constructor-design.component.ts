import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { FlowDirective } from '@flowjs/ngx-flow';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;

  private autoUploadSubscription: SubscriptionLike;

  constructor(private toastr: ToastrService) {
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
      this.toastr.error('Формат изображения должен быть .png, .jpg  или .gif', 'Ошибка!');
    }
  }

  private uploadFile(){
    ladLoad.start();
    var file = $scope.myFile;
    if (typeof file === "undefined") {
      toastr["error"]('Пожалуйста, выберите изображение на своем компьютере и попробуйте еще раз.', 'Ошибка!');
      ladLoad.stop();
    } else {
      if (file.size <= 2000000) {
        var uploadUrl = openapi.getUrl("imagestore/"+$scope.sid);
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope);
      } else {
        toastr["error"]('Размер изображения превышает максимально допустимый. Пожалуйста, уменьшите размер изображения и попробуйте еще раз.', 'Ошибка!');
        ladLoad.stop();
      }
    }
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

