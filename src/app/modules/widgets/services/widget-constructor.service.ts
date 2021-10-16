import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ApiResponse } from '../../../core/models/api';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { UtilsService } from '../../../core/services/utils.service';
import { WidgetApiService } from './widget-api.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetConstructorService {
  public arrayOfUsedItems = [];
  public formExtIdFieldFocusOut = new Subject();
  public changeArrayOfFormExtTypes = new Subject();
  public changeItemFormType = new Subject<{type: string; index: number}>();
  public updateWidget = new Subject();

  constructor(
    private translate: TranslateService,
    private errorHandlerService: ErrorHandlerService,
    private utilsService: UtilsService,
    private widgetApiService: WidgetApiService
  ) {
  }

  public listFileToUrl(listUrl) {
    return this.widgetApiService.listFileToUrl(listUrl).pipe(
      map((response: any) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteFileToUrl(deleteFileUrl, name): Observable<boolean> {
    return this.widgetApiService.deleteFileToUrl(deleteFileUrl, name).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public setArrayOfUsedItems(items) {
    this.arrayOfUsedItems = items;

    setTimeout(() => {
      this.changeArrayOfFormExtTypes.next();
    }, 500);
  }

  public isThatElementUnclonable(type) {
    return !this.getAvailableTypes().some((_) => {
      return _.type === type;
    });
  }

  public getAvailableTypes() {
    return this.getItemFormTypes().filter((_) => {
      return ((_.type !== 'email') &&
        (_.type !== 'name') &&
        (_.type !== 'phone') &&
        (_.type !== 'message') &&
        (_.type !== 'term')) ||
        (_.type === 'email' && !this.isFormExtListAlreadyHas(_.type)) ||
        (_.type === 'name' && !this.isFormExtListAlreadyHas(_.type)) ||
        (_.type === 'phone' && !this.isFormExtListAlreadyHas(_.type)) ||
        (_.type === 'message' && !this.isFormExtListAlreadyHas(_.type)) ||
        (_.type === 'term' && !this.isFormExtListAlreadyHas(_.type));
    });
  }

  public getExtFormWidthTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.widthField2')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.widthField3')
      }
    ];
  }

  public getItemFormByType(newType) {
    return this.getItemFormTypes().find((item) => {
      return item.type === newType;
    });
  }

  public getDefaultFormExtMainSettings() {
    return {
      colorTitleInputForm: '#000000',
      bgInputForm: '#EFEFEF',
      opacityBgInputForm: '1',
      borderRadiusInputForm: '0',
      rgbaInputForm: '',
      orientation: this.getExtFormMainFieldsOrientationType()[0],
      visual: this.getExtFormVisualTypeOfField()[0],
      border: {
        enable: false,
        color: '#000000'
      },
      colorPod: {
        enable: false,
        color: '#000000',
        opacityColorPod: '1',
        rgbaColorPod: ''
      },
      form_width_type: this.getExtFormMainWidthTypes()[0],
      form_width_orientation_type: this.getExtFormMainWidthOrientationType()[0],
      form_widthpx: 200
    };
  }

  public removeFromArray(array, index) {
    const newArray = [];
    let j = 0;
    for (let i = 0; i < array.length; i++) {
      if (i !== index) {
        newArray[j] = array[i];
        j++;
      }
    }
    return newArray;
  }

  public isItemMultiAndHasId(type) {
    return type !== 'email' && type !== 'name' && type !== 'phone' && type !== 'message' && type !== 'term' && type !== 'title' && type !== 'button';
  }

  public isFormHasInputs(item) {
    return item.type === 'email' ||
      item.type === 'name' ||
      item.type === 'message' ||
      item.type === 'phone' ||
      item.type === 'text' ||
      item.type === 'date' ||
      item.type === 'rating' ||
      item.type === 'dd' ||
      item.type === 'variants';
  }

  public wvBdLeft(dhVisual) {
    let className = '';

    if (dhVisual.place === 'Левый нижний угол') {
      className = 'wv-bd-left';
    }

    if (dhVisual.place === 'Правый нижний угол') {
      className = 'wv-bd-right';
    }

    return className;
  }

  public getDefaultTimerSettings() {
    return {
      enable: false,
      name: 'timer-element',
      counter: 0,
      type: this.getTimerCountdownTypes()[1],
      type1Model: {
        d: 10,
        h: 10,
        m: 10,
        s: 10
      },
      loop: {
        enable: false,
        model: {
          d: 10,
          h: 10,
          m: 10,
          s: 10
        }
      },
      id: 'timer_' + this.utilsService.generateShortID(),
      ids: 'timer_' + this.utilsService.generateShortID(),
      date: (moment(new Date()) as any)._d,
      timezoneType: 'local',
      expType: this.getTimerExpTypes()[0],
      expUrl: '',
      design: {
        font: {
          name: 'PT Sans',
          fontFamily: '\'PT Sans\''
        },
        fontType: 'systemFont',
        fontName: '',
        fontNumberSize: 35,
        fontLabelSize: 18,
        fontLabel: {
          name: 'PT Sans',
          fontFamily: '\'PT Sans\''
        },
        fontLabelType: 'systemFont',
        fontLabelName: '',
        bgWidth: 35,
        bgHeight: 42,
        opacity: 1,
        radius: 6,
        colorText: '#FFFFFF',
        colorBG: '#000000',
        colorDivider: '#000000',
        colorIntervalName: '#4E4E4E',
        nullData: {
          d: true,
          h: true,
          m: true
        },
        align: this.getTimerAlignTypes()[1],
        tempInterval: {
          enable: true,
          dText: this.translate.instant('widgets.timerDirective.label.days'),
          hText: this.translate.instant('widgets.timerDirective.label.hours'),
          mText: this.translate.instant('widgets.timerDirective.label.mins'),
          sText: this.translate.instant('widgets.timerDirective.label.secs')
        }
      }
    };
  }

  public ruleLeftOrRightUnderContent(formExtModel, formBasicVisual, imagePlace) {
    if (formExtModel?.enable) {
      return formExtModel.model.mainSettings.visual.type === 0 && this.ruleImageLeftOrRight(imagePlace);
    } else {
      return formBasicVisual === 'Под контентом' && this.ruleImageLeftOrRight(imagePlace);
    }
  }

  public ruleLeftOrRightWholeWidth(formExtModel, formBasicVisual, imagePlace) {
    if (formExtModel?.enable) {
      return formExtModel.model.mainSettings.visual.type === 1 && this.ruleImageLeftOrRight(imagePlace);
    } else {
      return formBasicVisual === 'На всю ширину' && this.ruleImageLeftOrRight(imagePlace);
    }
  }

  public isFormHasCurrentTypeButtons(list, currentType) {
    return list.some((_) => {
      return _.type === 'button' && _.redirect.type.type === currentType;
    });
  }

  public isFormHasCurrentTypeOfActions(list, currentType) {
    return list.some((_) => {
      return (_.type === 'button' && _.redirect.type.type === currentType) || this.isItemSendFormIfAction(_);
    });
  }

  private isItemSendFormIfAction(item) {
    return (item.type === 'dd' || item.type === 'variants' || item.type === 'rating') && item.sendFormIfAction;
  }

  public getExtFormBtnRedirectTypesForContainerized() {
    return this.getExtFormBtnRedirectTypes().filter((item) => item.type !== 2);
  }

  public getExtFormDateTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.date.type2'),
        value: 'dd/mm/yyyy'
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.date.type3'),
        value: 'yyyy/mm/dd'
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.date.type4'),
        value: 'mm/dd/yyyy'
      }
    ];
  }

  public getExtFormButtonBType() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.button.bType1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.button.bType2')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.button.bType3')
      }
    ];
  }

  public getExtFormButtonWidthType() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.width1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.width2')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.width3')
      }
    ];
  }

  public getExtFormBtnRedirectTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.redirect.action1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.redirect.action2')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.redirect.action3')
      },
      {
        type: 3,
        label: this.translate.instant('widgets.formExt.mainSettings.buttonSettings.redirect.action4')
      }
    ];
  }

  public getExtFormHiddenFieldType() {
    return [
      {
        type: 'utm_source',
        label: this.translate.instant('widgets.formExt.hidden.fieldType1')
      },
      {
        type: 'utm_medium',
        label: this.translate.instant('widgets.formExt.hidden.fieldType2')
      },
      {
        type: 'utm_campaign',
        label: this.translate.instant('widgets.formExt.hidden.fieldType3')
      },
      {
        type: 'utm_term',
        label: this.translate.instant('widgets.formExt.hidden.fieldType4')
      },
      {
        type: 'utm_content',
        label: this.translate.instant('widgets.formExt.hidden.fieldType5')
      },
      {
        type: 'referrer',
        label: this.translate.instant('widgets.formExt.hidden.fieldType6')
      },
      {
        type: 'page_url',
        label: this.translate.instant('widgets.formExt.hidden.fieldType7')
      },
      {
        type: 'custom_parameter',
        label: this.translate.instant('widgets.formExt.hidden.fieldType8')
      },
      {
        type: 'browser_language',
        label: this.translate.instant('widgets.formExt.hidden.fieldType9')
      },
      {
        type: 'device_type',
        label: this.translate.instant('widgets.formExt.hidden.fieldType10')
      },
      {
        type: 'device_os',
        label: this.translate.instant('widgets.formExt.hidden.fieldType11')
      },
      {
        type: 'timezone',
        label: this.translate.instant('widgets.formExt.hidden.fieldType12')
      },
      {
        type: 'coupon',
        label: this.translate.instant('widgets.formExt.hidden.fieldType13')
      },
      {
        type: 'session_number',
        label: this.translate.instant('widgets.formExt.hidden.fieldType14')
      },
      {
        type: 'pageviews',
        label: this.translate.instant('widgets.formExt.hidden.fieldType15')
      },
      {
        type: 'cookie',
        label: this.translate.instant('widgets.formExt.hidden.fieldType16')
      },
      {
        type: 'user_value',
        label: this.translate.instant('widgets.formExt.hidden.fieldType17')
      }
    ];
  }

  public getGoogleFontListPicker() {
    return [
      'Arimo',
      'Bad+Script',
      'Comfortaa',
      'Cormorant+Infant',
      'Cuprum',
      'El+Messiri',
      'Exo+2',
      'Fira+Mono',
      'Fira+Sans',
      'Forum',
      'Jura',
      'Kelly+Slab',
      'Kurale',
      'Lobster',
      'Lora',
      'Marck+Script',
      'Marmelad',
      'Merriweather',
      'Neucha',
      'Noto+Sans',
      'Noto+Serif',
      'Open+Sans',
      'Open+Sans+Condensed:300,700',
      'Pattaya',
      'Philosopher',
      'Play',
      'Playfair+Display',
      'Poiret+One',
      'Press+Start+2P',
      'Prosto+One',
      'PT+Mono',
      'PT+Sans',
      'PT+Sans+Caption',
      'PT+Sans+Narrow',
      'PT+Serif',
      'Roboto',
      'Roboto+Condensed',
      'Roboto+Slab',
      'Rubik',
      'Ruslan+Display',
      'Rubik+Mono+One',
      'Russo+One',
      'Seymour+One',
      'Stalinist+One',
      'Tenor+Sans',
      'Ubuntu',
      'Ubuntu+Condensed',
      'Ubuntu+Mono',
      'Underdog'
    ];
  }

  public getSystemFontListPicker() {
    return [
      'Arial',
      'Comic+Sans+MS',
      'Courier+New',
      'Georgia',
      'Impact',
      'Times+New+Roman',
      'Trebuchet+MS',
      'Verdana'
    ];
  }

  public getSystemFontList() {
    return [
      {
        name: 'Arial',
        fontFamily: 'Arial, sans-serif'
      },
      {
        name: 'Comic Sans MS',
        fontFamily: '\'Comic Sans MS\', cursive'
      },
      {
        name: 'Courier New',
        fontFamily: '\'Courier New\', monospace'
      },
      {
        name: 'Georgia',
        fontFamily: 'Georgia, serif'
      },
      {
        name: 'Impact',
        fontFamily: 'Impact, sans-serif'
      },
      {
        name: 'Times New Roman',
        fontFamily: '\'Times New Roman\', serif'
      },
      {
        name: 'Trebuchet MS',
        fontFamily: '\'Trebuchet MS\', sans-serif'
      },
      {
        name: 'Verdana',
        fontFamily: 'Verdana, sans-serif'
      }];
  }

  public classNameImg(imageSettings, formSettings, formExtSettings) {
    let className = '';

    if (imageSettings.place === 'Слева') {
      className = 'widget-image-left';
    }

    if (imageSettings.place === 'Справа') {
      className = 'widget-image-right';
    }

    if (imageSettings.place === 'Снизу') {
      className = 'widget-image-bottom';
    }

    if (imageSettings.place === 'Сверху') {
      className = 'widget-image-top';
    }

    if ((formSettings.visual === 'На всю ширину' || formExtSettings?.visual?.type === 1) && imageSettings.place === 'Слева') {
      className = 'widget-image-left-all';
    }

    if ((formSettings.visual === 'На всю ширину' || formExtSettings?.visual?.type === 1) && imageSettings.place === 'Справа') {
      className = 'widget-image-right-all';
    }

    if (imageSettings.img_item_type === 'Растянуть по ширине и высоте блока') {
      className += ' widget-image-has-full-wh';
    }

    if (imageSettings.img_item_type === 'Установить произвольные габариты') {
      if (imageSettings.img_item_align === 'По центру') {
        className += ' widget-image-has-center-orient';
      }

      if (imageSettings.img_item_align === 'По верхнему краю') {
        className += ' widget-image-has-top-orient';
      }

      if (imageSettings.img_item_align === 'По нижнему краю') {
        className += ' widget-image-has-bottom-orient';
      }
    }

    return className;
  }

  public classNameImgMain(imageSettings) {
    let className = '';

    if (imageSettings.enable) {
      if (imageSettings.place === 'Слева') {
        className = 'widget-main-img-left';
      }

      if (imageSettings.place === 'Справа') {
        className = 'widget-main-img-right';
      }

      if (imageSettings.place === 'Снизу') {
        className = 'widget-main-img-bottom';
      }

      if (imageSettings.place === 'Сверху') {
        className = 'widget-main-img-top';
      }
    }

    return className;
  }

  public classNameVerticalOrient(dhVisual) {
    let className = '';

    if (dhVisual.widget_content_height === 'Собственная') {
      if (dhVisual.widget_content_height_orient === 'От нижней границы') {
        className = 'widget-main-ul-bottom';
      }

      if (dhVisual.widget_content_height_orient === 'По центру виджета') {
        className = 'widget-main-ul-center';
      }
    }

    return className;
  }

  public getRGBAColor(item) {
    return (this.hexToRgb(item.color, item.opacity)).toString();
  }

  public hexToRgb(r, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
    const a = function() {
      return void 0 === this.alpha
        ? 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')'
        : (this.alpha > 1
          ? this.alpha = 1
          : this.alpha < 0 && (this.alpha = 0), 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.alpha + ')');
    };
    return void 0 === t ? n ? {
      r: parseInt(n[1], 16),
      g: parseInt(n[2], 16),
      b: parseInt(n[3], 16),
      toString: a
    } : null : (t > 1 ? t = 1 : 0 > t && (t = 0), n ? {
      r: parseInt(n[1], 16),
      g: parseInt(n[2], 16),
      b: parseInt(n[3], 16),
      alpha: t,
      toString: a
    } : null);
  }

  private ruleImageLeftOrRight(imagePlace) {
    return imagePlace === 'Слева' || imagePlace === 'Справа';
  }

  public getExtFormMainFieldsOrientationType() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.formField.orientation1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.formField.orientation2')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.mainSettings.formField.orientation3')
      }
    ];
  }

  public getExtFormVisualTypeOfField() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.visualField1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.visualField2')
      }
    ];
  }

  public getExtFormMainWidthTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.widthForm1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.widthForm2')
      }
    ];
  }

  public getExtFormMainWidthOrientationType() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.formExt.mainSettings.widthForm.orientation1')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.formExt.mainSettings.widthForm.orientation2')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.formExt.mainSettings.widthForm.orientation3')
      }
    ];
  }

  public getTimerCountdownTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.timerDirective.countdown.type0')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.timerDirective.countdown.type1')
      }
    ];
  }

  public getTimerExpTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.timerDirective.countdown.action.type0')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.timerDirective.countdown.action.type1')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.timerDirective.countdown.action.type2')
      }
    ];
  }

  public getTimerAlignTypes() {
    return [
      {
        type: 0,
        label: this.translate.instant('widgets.timerDirective.design.align.type0')
      },
      {
        type: 1,
        label: this.translate.instant('widgets.timerDirective.design.align.type1')
      },
      {
        type: 2,
        label: this.translate.instant('widgets.timerDirective.design.align.type2')
      }
    ];
  }

  private getItemFormTypes() {
    return [
      {
        type: 'email',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeEmail'),
        placeholder: this.translate.instant('widgets.formExt.email.placeholder2'),
        service: this.translate.instant('widgets.formExt.email.service2'),
        idField: 'email',
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false
      },
      {
        type: 'name',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeName'),
        placeholder: this.translate.instant('widgets.formExt.name.placeholder2'),
        service: this.translate.instant('widgets.formExt.name.service2'),
        idField: 'name',
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false
      },
      {
        type: 'message',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeMessage'),
        placeholder: this.translate.instant('widgets.formExt.message.placeholder2'),
        service: this.translate.instant('widgets.formExt.message.service2'),
        idField: 'message',
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false
      },
      {
        type: 'phone',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typePhone'),
        placeholder: this.translate.instant('widgets.formExt.phone.placeholder2'),
        service: this.translate.instant('widgets.formExt.phone.service2'),
        idField: 'phone',
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        mask: {
          enable: false,
          value: '+7 (***) ***-**-**'
        }
      },
      {
        type: 'text',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeText'),
        placeholder: this.translate.instant('widgets.formExt.text.placeholder2'),
        service: this.translate.instant('widgets.formExt.text.service2'),
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        multiLine: false
      },
      {
        type: 'rating',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeRating'),
        service: this.translate.instant('widgets.formExt.rating.service2'),
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        sendFormIfAction: false,
        numberOfStars: 5,
        colorInactive: '#ccc',
        colorActive: '#ff0000',
        serviceData: {
          starClicked: false,
          cacheWidth: '0%'
        }
      },
      {
        type: 'variants',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeVariants'),
        service: this.translate.instant('widgets.formExt.variants.service2'),
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        everyNewLine: false,
        multiEnable: false,
        sendFormIfAction: false,
        variants: ['Variant 1', 'Variant 2'],
        font: this.getSystemFontList()[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 17,
        colorText: '#000000'
      },
      {
        type: 'dd',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeDropdown'),
        placeholder: this.translate.instant('widgets.formExt.dropdown.placeholder2'),
        service: this.translate.instant('widgets.formExt.dropdown.placeholder2'),
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        sendFormIfAction: false,
        serviceData: {
          isOpen: false,
          extraLabel: null
        },
        variants: ['Variant 1', 'Variant 2']
      },
      {
        type: 'date',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeDate'),
        placeholder: this.translate.instant('widgets.formExt.date.placeholder2'),
        service: this.translate.instant('widgets.formExt.date.service2'),
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        useOutsideCRM: true,
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        required: false,
        newLine: false,
        dateType: this.getExtFormDateTypes()[1]
      },
      {
        type: 'title',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeTitle'),
        placeholder: this.translate.instant('widgets.formExt.title.placeholder2'),
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        newLine: false,
        textSummer: '<p>Текст или заголовок (нажмите, чтобы изменить)</p>',
        font: this.getSystemFontList()[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 12,
        textShadow: {
          enable: false,
          color: '#262626',
          opacity: '1',
          rgbaColor: (this.hexToRgb('#262626', 1)).toString(),
          horiz: 0,
          vertical: 0,
          blur: 0
        }
      },
      {
        type: 'term',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeTerm'),
        placeholder: this.translate.instant('widgets.formExt.term.placeholder2'),
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        newLine: false,
        required: false,
        checked: false,
        textSummer: '<p>Я согласен с условиями</p>',
        font: this.getSystemFontList()[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 18,
        textShadow: {
          enable: false,
          color: '#262626',
          opacity: '1',
          rgbaColor: (this.hexToRgb('#262626', 1)).toString(),
          horiz: 0,
          vertical: 0,
          blur: 0
        }
      },
      {
        type: 'button',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeButton'),
        bType: this.getExtFormButtonBType()[0],
        btnWidthType: this.getExtFormButtonWidthType()[0],
        widthValue: 50,
        widthType: this.getExtFormWidthTypes()[0],
        newLine: false,
        textSummer: '<span>Отправить</span>',
        font: this.getSystemFontList()[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 20,
        colorBtn: '#000000',
        colorTextBtn: '#FFFFFF',
        borderRadiusBtn: 0,
        styleType: 'Default',
        redirect: {
          type: this.getExtFormBtnRedirectTypes()[0],
          url: '',
          blank: false
        },
        icon: {
          enable: false,
          color: '#FFFFFF',
          selectedIcon: 'fa fa-fw fa-heart'
        },
        targetAction: false
      },
      {
        type: 'hidden',
        isTabOpened: true,
        label: this.translate.instant('widgets.formExt.typeHidden'),
        placeholder: this.translate.instant('widgets.formExt.text.placeholder2'),
        utmRefPage: {
          currentPage: true
        },
        service: this.getExtFormHiddenFieldType()[0].label,
        idField: 'field_id_',
        id: this.utilsService.generateShortID(),
        fieldType: this.getExtFormHiddenFieldType()[0],
        customParamValue: '',
        cookieValue: '',
        customUserValue: ''
      }
    ];
  }

  private isFormExtListAlreadyHas(type) {
    return this.arrayOfUsedItems.some((item) => {
      return item.type === type;
    });
  }
}
