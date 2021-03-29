import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetConstructorDesignService {

  constructor() { }

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
}
