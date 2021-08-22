import { AfterViewInit, Component, DoCheck, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-extended-button',
  templateUrl: './extended-button.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-button.component.scss']
})
export class ExtendedButtonComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() public index: number;
  @Input() public containerId: string;
  @Input() public item: Record<string, any>;

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  public availItemTypes = [];
  public bTypes = [];
  public availWidthTypes = [];
  public redirectAvail = [];

  private changeExtTypesSub: SubscriptionLike;

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngAfterViewInit(): void {
    this.initPicker();
  }

  ngOnInit(): void {
    this.changeExtTypesSub = this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });

    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
    this.bTypes = this.widgetConstructorService.getExtFormButtonBType();
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
    this.redirectAvail = this.containerId ? this.widgetConstructorService.getExtFormBtnRedirectTypesForContainerized() :
      this.widgetConstructorService.getExtFormBtnRedirectTypes();
  }

  ngDoCheck(): void {
    if (this.item.font.name) {
      $('#font-picker-ext-form' + this.index).trigger('setFont', this.item.font.name);
    }

    if (this.item.redirect.types) {
      if (this.item.redirect.type.type === 0 || this.item.redirect.type.type === 1) {
        this.item.targetAction = false;
      }
    }
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

  public setBtnStyle(type, item) {
    item.styleType = type;
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker-ext-form' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.item.font.name);
      });

      $('#font-picker-ext-form' + this.index).trigger('setFont', this.item.font.name);
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

  public onLabelIconPickerSelect(newIcon: string) {
    this.item.icon.selectedIcon = newIcon;
  }
}
