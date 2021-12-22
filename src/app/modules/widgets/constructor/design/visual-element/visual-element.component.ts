import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { IMAGE_DEF } from '../../../../../configs/urls';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-visual-element',
  templateUrl: './visual-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './visual-element.component.scss']
})
export class VisualElementComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public widgwidthBtn: string[];
  @Input() public vertOrientDh: string[];
  @Input() public bgPositionTypesList: string[];
  @Input() public tilesList: string[];
  @Input() public maskTypeList: string[];
  @Input() public placeImg: string[];
  @Input() public imageItemsType: string[];
  @Input() public imageItemsAlign: string[];

  @Output() private getVideo = new EventEmitter<Record<string, string>>();
  @Output() private listFileItem = new EventEmitter<string>();

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };

  public optionsThickness: Options = {
    floor: 0.00,
    ceil: 10.00,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

  public optionsSharpness: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

  constructor() { }

  ngOnInit(): void {
    this.widget.guiprops.bg.borderRadiusEnable = true;
  }

  public getVideoId(item) {
    this.getVideo.emit(item);
  }

  public listFile(place) {
    this.listFileItem.emit(place);
  }

  public setBorderRadius(value: boolean) {
    if (!value) {
      this.widget.guiprops.bg.borderRadius = 0;
    }
  }

  public isDefault(url: string): boolean {
    return url === IMAGE_DEF;
  }

  public removeImage(isBg: boolean): void {
    if (isBg) {
      this.widget.guiprops.bg.url = IMAGE_DEF;
    } else {
      this.widget.guiprops.image.url = IMAGE_DEF;
    }
  }

}
