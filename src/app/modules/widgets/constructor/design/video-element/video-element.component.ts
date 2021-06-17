import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './video-element.component.scss']
})
export class VideoElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;
  @Input() public widthHrType: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<number>();
  @Output() private getVideo = new EventEmitter<Record<string, string>>();
  @Output() private setVideoSize = new EventEmitter<Record<string, string>>();

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public getVideoId(item) {
    this.getVideo.emit(item);
  }

  public changeWidthTypeOfVideo(item, newValue) {
    item.width_type = newValue;
    this.newVideoSize(item);
  }

  public goToResize(item) {
    this.newVideoSize(item);
  }

  private newVideoSize(item) {
    this.setVideoSize.emit(item);
  }

}
