import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-timer-element',
  templateUrl: './timer-element.component.html',
  styleUrls: ['../../../../shared/shared.scss', './timer-element.component.scss']
})
export class TimerElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: any;
  @Input() public widget: FullWidget;

  @Output() private removeElement = new EventEmitter<number>();

  public alignValues = [];
  public timerTypes = [];
  public expTypes = [];

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.alignValues = this.widgetConstructorService.getTimerAlignTypes();
    this.timerTypes = this.widgetConstructorService.getTimerCountdownTypes();
    this.expTypes = this.widgetConstructorService.getTimerExpTypes();
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public setNullData(key) {
    this.item.design.nullData[key] = Boolean(this.item.design.nullData[key]);
  }

}
