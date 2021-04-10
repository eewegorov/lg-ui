import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetConstructorDesignService {

  constructor(private translate: TranslateService) { }

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
