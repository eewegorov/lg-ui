import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';
import { Coupon } from '../../../../../core/models/coupons';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.scss']
})
export class FormElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public placePopup: string[];
  @Input() public orientInputForm: string[];
  @Input() public visualInputForm: string[];
  @Input() public widthHrType: string[];
  @Input() public widthBtn: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<{index: number, elem: Record<string, string>}>();
  @Output() private setBtn = new EventEmitter<{type: string, item: Record<string, string | number>}>();

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

  public itemVariable = [{
    type: 'email',
    value: 'email',
    inpPlace: 'Введите Ваш email'
  }, {
    type: 'name',
    value: 'имя',
    inpPlace: 'Введите Вашe имя'
  }, {
    type: 'phone',
    value: 'телефон',
    inpPlace: 'Введите Ваш телефон'
  }, {
    type: 'message',
    value: 'сообщение',
    inpPlace: 'Введите Ваше сообщение'
  }];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
  }

  public trackById(index, item) {
    return item.id;
  }

  public removeElementFromElementsList(index: number, elem: Record<string, string>): void {
    this.removeElement.emit({index, elem});
  }

  public setBtnStyle(type: string, item: Record<string, string | number>): void {
    this.setBtn.emit({type, item});
  }

  public getItemT(item, itemType) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.widget.guiprops.formSet.items.length; i++) {
      if (item.type !== itemType.type && this.widget.guiprops.formSet.items[i].type === itemType.type) {
        return false;
      }
    }
    return true;
  }

  public getPlaceholderFrom(item, index) {
    this.itemVariable.forEach(item1 => {
      if (item.type === item1.type) {
        this.widget.guiprops.formSet.items[index].placeholder = item1.inpPlace;
      }
    });
  }

  public addFirstInput(item, index) {
    this.widget.guiprops.formSet.items.splice(index, 1);
    this.widget.guiprops.formSet.items.unshift({
      placeholder: 'Введите Ваше сообщение',
      required: false,
      state: 0,
      type: 'message'
    });
  }

  public blockedUnusedChars() {
    const value = this.widget.guiprops.formSet.phoneMask.maskValue;
    const re = /[\\\/\|\[\]\{\}\.,`~@#$%^&?!;_="<>:'a-zA-Zа-яА-Я]/g;

    this.widget.guiprops.formSet.phoneMask.maskValue = value.replace(re, '');
  }

  public removePageInputItem(index) {
    this.widget.guiprops.formSet.items = this.widgetConstructorService.removeFromArray(this.widget.guiprops.formSet.items, index);
  }

  public addPageInputItem() {
    const helpArr = [...this.itemVariable];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.widget.guiprops.formSet.items.length; i++) {
      for (let j = 0; j < helpArr.length; j++) {
        if ((this.widget.guiprops.formSet.items[i].type === helpArr[j].type)) {
          helpArr.splice(j, 1);
        }
      }
    }

    if (helpArr[0].type === 'message') {
      this.widget.guiprops.formSet.items.unshift({
        placeholder: 'Введите Ваше сообщение',
        required: false,
        state: 0,
        type: 'message'
      });
    } else {
      this.widget.guiprops.formSet.items.push({
        placeholder: helpArr[0].inpPlace,
        required: false,
        state: 0,
        type: helpArr[0].type
      });
    }
  }

}
