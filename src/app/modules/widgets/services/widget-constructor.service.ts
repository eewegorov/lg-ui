import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WidgetApiService } from './widget-api.service';
import { catchError, map } from 'rxjs/operators';
import { WidgetsResponse } from '../../../core/models/widgets';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ApiResponse } from '../../../core/models/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetConstructorService {

  constructor(
    private translate: TranslateService,
    private errorHandlerService: ErrorHandlerService,
    private widgetApiService: WidgetApiService
  ) { }

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

  public ruleLeftOrRightUnderContent(formExtModel, formBasicVisual, imagePlace) {
    if (formExtModel.enable) {
      return formExtModel.model.mainSettings.visual.type === 0 && this.ruleImageLeftOrRight(imagePlace);
    } else {
      return formBasicVisual === 'Под контентом' && this.ruleImageLeftOrRight(imagePlace);
    }
  }

  public ruleLeftOrRightWholeWidth(formExtModel, formBasicVisual, imagePlace) {
    if (formExtModel.enable) {
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

    if ((formSettings.visual === 'На всю ширину' || formExtSettings.visual.type === 1) && imageSettings.place === 'Слева') {
      className = 'widget-image-left-all';
    }

    if ((formSettings.visual === 'На всю ширину' || formExtSettings.visual.type === 1) && imageSettings.place === 'Справа') {
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

  private getExtFormMainFieldsOrientationType() {
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

  private getExtFormVisualTypeOfField() {
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

  private getExtFormMainWidthTypes() {
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

  private getExtFormMainWidthOrientationType() {
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
}
