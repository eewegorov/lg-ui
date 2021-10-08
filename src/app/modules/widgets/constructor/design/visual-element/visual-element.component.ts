import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
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
    animate: false
  };

  public optionsThickness: Options = {
    floor: 0.00,
    ceil: 10.00,
    step: 1,
    animate: false
  };

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false
  };

  constructor() { }

  ngOnInit(): void {
  }

  public getVideoId(item) {
    this.getVideo.emit(item);
  }

  public listFile(place) {
    this.listFileItem.emit(place);
  }

}
