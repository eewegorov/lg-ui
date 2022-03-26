import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-button-element',
  templateUrl: './button-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './button-element.component.scss']
})
export class ButtonElementComponent implements OnInit, AfterViewInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public visualInputForm: string[];
  @Input() public widthBtn: string[];
  @Input() public floatBtn: string[];
  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false,
    showSelectionBar: true
  };
  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };
  @Output() private setBtn = new EventEmitter<{ type: string, item: Record<string, string | number> }>();

  constructor(private widgetConstructorService: WidgetConstructorService) {
  }

  ngAfterViewInit(): void {
    this.initPicker();
  }

  ngOnInit(): void {
  }

  public setBtnStyle(type: string, item: Record<string, string | number>): void {
    this.setBtn.emit({ type, item });
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.target.value, this.widget.guiprops.button.font);
      });

      $('#font-picker' + this.index).trigger('setFont', this.widget.guiprops.button.font.name);
    }, 500);
  }

  private setNewFont(value, data) {
    let font = value.replace(/\+/g, ' ');

    // Split font into family and weight
    font = font.split(':');
    const fontFamily = font[0];

    data.name = fontFamily;
    data.fontFamily = '\'' + fontFamily + '\'';
  }
}
