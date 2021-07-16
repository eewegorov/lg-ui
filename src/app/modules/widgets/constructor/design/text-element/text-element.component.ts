import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './text-element.component.scss']
})
export class TextElementComponent implements OnInit, AfterViewInit {
  @Input() public index: number;
  @Input() public item: any;
  @Input() public widget: FullWidget;

  @Output() private removeElement = new EventEmitter<number>();

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngAfterViewInit(): void {
        setTimeout(() => {
          this.initPicker();
        }, 1000)
    }

  ngOnInit(): void {

  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker' + this.index) as any).fontselect({
        style: 'font-select',
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker(),
        searchable: true
      }).on('change', (change) => {
        console.log(change)
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
