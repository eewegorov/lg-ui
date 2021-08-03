import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './content-element.component.scss']
})
export class ContentElementComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public bgStyle: string;
  @Input() public widthImageStyle: string;
  @Input() public heightImageStyle: string;
  @Input() public widthContentStyle: string;
  @Input() public heightContentStyle: string;

  @Output() private removeElement = new EventEmitter<{index: number, elem: Record<string, string>}>();
  @Output() private scrollToElement = new EventEmitter<{id: string, elementName: string}>();
  @Output() private addNewElement = new EventEmitter<number>();

  public showAddButtonOnWidget = true;
  public optionsSummernote = {
    airMode: true,
    dialogsInBody: true,
    popover: {
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        ['color', ['color']],
        ['font', ['bold', 'underline', 'italic', 'clear', 'fontsize', 'strikethrough']],
        ['para', ['paragraph', 'height']],
        ['insert', ['link']]
      ]
    }
  };

  public widthBtnStyle = '';
  public widthBtnFormStyle = '';
  public widthExitBtnStyle = '';

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    if (this.widget.guiprops?.button?.btn_width === 'Собственная') {
      this.widthBtnStyle = this.widget.guiprops.button.btn_widthpx + 'px';
      this.widthBtnFormStyle = this.widget.guiprops.button.btn_widthpx + 'px';
    }
    if (this.widget.guiprops?.button?.btn_width === 'От края до края') {
      this.widthBtnStyle = '100%';
      this.widthBtnFormStyle = '98%';
    }
    if (this.widget.guiprops?.button?.btn_width === 'Авто') {
      this.widthBtnStyle = 'auto';
      this.widthBtnFormStyle = 'auto';
    }
    if (this.widget.guiprops?.exit?.button?.btn_width === 'Собственная') {
      this.widthExitBtnStyle = this.widget.guiprops.exit.button.btn_widthpx + 'px';
    }
    if (this.widget.guiprops?.exit?.button?.btn_width === 'От края до края') {
      this.widthExitBtnStyle = '100%';
    }
    if (this.widget.guiprops?.exit?.button?.btn_width === 'Авто') {
      this.widthExitBtnStyle = 'auto';
    }
  }

  public trackById(index, item) {
    return item.id;
  }

  public trackByIndex(index) {
    return index;
  }

  public scrollToEl(id, elementName) {
    this.scrollToElement.emit({ id, elementName });
  }

  public removeElementFromElementsList(index: number, elem: Record<string, string>): void {
    this.removeElement.emit({index, elem});
  }

  public addNewElementToContent(item?: number) {
    this.addNewElement.emit(item);
  }

  public copyNewElementToContent(item, index) {
    const newItem = { ...item };

    if (newItem.counter) {
      newItem.counter = 0;
    }

    this.widget.guiprops.elementsList.splice(index + 1, 0, newItem);
  }

  public hiddenAddButtonOnWidget() {
    this.showAddButtonOnWidget = false;
    this.widget.guiprops.dhVisual.showAddButtonOnWidget = !this.widget.guiprops.dhVisual.showAddButtonOnWidget;
  }

  public addExtraClassForFullWidth(index) {
    if (!this.widget.guiprops.formExt) {
      return;
    }

    const indexValue = (100 - index);
    const indexValueForm = this.widget.guiprops.formExt.enable ? $('.margin-if-form-ext-element').css('z-index') : $('.margin-if-form-element').css('z-index');
    const indexValueButton = $('.margin-if-button-element').css('z-index');

    if ((indexValueForm && (indexValue <= +indexValueForm)) || (indexValueButton && (indexValue <= +indexValueButton))) {
      return 'extraClassFullWidth';
    } else {
      return 'extraClassDefWidth';
    }
  }

  public getItemClassData(item) {
    if (item.name === 'title-element' || item.name === 'image-element' || item.name === 'iframe-element' ||
      item.name === 'video-element' || item.name === 'padding-element' || item.name === 'split-element' || item.name === 'coupon-element') {
      return 'clonable-button';
    } else {
      return '';
    }
  }

  public hrPosSel(item) {
    let className = '';

    if (item.position === 'По центру') {
      className = 'widget1-hr-center';
    }

    if (item.position === 'Справа') {
      className = 'widget1-hr-right';
    }

    if (item.position === 'Слева') {
      className = 'widget1-hr-left';
    }

    if (item.width_type === 'От края до края') {
      className += ' widget1-hr-full-w';
    }

    if (item.width_type === 'Собственная') {
      className += ' widget1-hr-user-w';
    }

    return className;
  }

  public widthCouponStyle(item) {
    if (item.width_type === 'Собственная') {
      return item.widthpx + 'px';
    }
    if (item.width_type === 'От края до края') {
      return '100%';
    }
    if (item.width_type === 'Авто') {
      return 'auto';
    }
  }

  public heightIfrmPosSel(item) {
    let className = '';

    if (item.height_type === 'Авто') {
      className += ' widget1-hrh-full-w';
    }

    if (item.height_type === 'Собственная') {
      className += ' widget1-hrh-user-w';
    }

    return className;
  }

  public btnPosSel(item) {
    let className = '';

    if (item.position === 'По центру') {
      className = 'widget1-btn-bl-center';
    }

    if (item.position === 'Справа') {
      className = 'widget1-btn-bl-right';
    }

    if (this.widget.guiprops.dhVisual.place === 'Слева') {
      className = 'widget1-btn-bl';
    }

    return className;
  }

  public setBtnStyleClass(item) {
    let className = '';

    if (item.styleType === 'Border Style') {
      className += ' widget-btn-border-style-none-bg';
    }

    if (item.styleType === 'Material') {
      className += ' widget-btn-style__material widget-btn-border-style-none-border';
    }

    if (item.styleType === 'Flat') {
      className += ' widget-btn-style__flat widget-btn-border-style-none-border';
    }

    if (item.styleType === 'Default') {
      className += ' widget-btn-border-style-none-border';
    }

    return className;
  }

  public hrPosSelWholeForm(item) {
    let className = '';

    if (item.form_position === 'По центру') {
      className = 'widget1-w-hr-center';
    }

    if (item.form_position === 'Справа') {
      className = 'widget1-w-hr-right';
    }

    if (item.form_position === 'Слева') {
      className = 'widget1-w-hr-left';
    }

    if (item.form_width_type === 'От края до края') {
      className += ' widget1-w-hr-full-w';
    }

    if (item.form_width_type === 'Собственная') {
      className += ' widget1-w-hr-user-w';
    }

    return className;
  }

  public hrPosSelForm(item) {
    let className = '';

    if (item.width_type === 'От края до края') {
      className += ' widget1-hr-full-w';
    }

    if (item.width_type === 'Собственная') {
      className += ' widget1-hr-user-w';
    }

    return className;
  }

  public classNameInputItem(item) {
    let className = '';

    if (this.widget.guiprops.form.orient === 'Горизонтальная') {
      if (item.type === 'message') {
        className = 'widget-input-gorizontal-textar';
      }
      else {
        className = 'widget-input-gorizontal';
      }
    }
    else {
      if (item.type === 'message') {
        className = 'widget-input-vert-textar';
      }
    }

    return className;
  }

  public elementInputItem(item) {
    let elementName = '';

    if (item.type === 'message') {
      elementName = 'textarEl';
    }
    else {
      elementName = 'inputEl';
    }

    return elementName;
  }

  public classNameFormInput(itemType) {
    let className = '';

    if (this.widget.guiprops.form.border.enable) {
      className += ' widget-input-border';
    }

    if (itemType === 'phone' && this.widget.guiprops.formSet.phoneMask.enable) {
      className += ' masked';
    }

    return className;
  }

  public hrFlexedPosSel(type) {
    let className = '';

    if (type === 0) {
      className = 'align-flexed-pos-left';
    }

    if (type === 1) {
      className = 'align-flexed-pos-center';
    }

    if (type === 2) {
      className = 'align-flexed-pos-right';
    }

    return className;
  }

  public isTimerTypeShown(item, type) {
    return Boolean(item.design.nullData[type] || item.type1Model[type]);
  }

  public getInputFormPhoneMask() {
    return this.widget.guiprops.formSet.phoneMask.maskValue.replace(/\*/g, '_');
  }

  public getRGBAColor(item) {
    return this.widgetConstructorService.getRGBAColor(item);
  }

  public classNameImg() {
    return this.widgetConstructorService
      .classNameImg(this.widget.guiprops.image, this.widget.guiprops.form, this.widget.guiprops.formExt?.model?.mainSettings);
  }

  public classNameImgMain() {
    return this.widgetConstructorService.classNameImgMain(this.widget.guiprops.image);
  }

  public classNameVerticalOrient() {
    return this.widgetConstructorService.classNameVerticalOrient(this.widget.guiprops.dhVisual);
  }

  public getRGBAColorItems(color, opacity) {
    return (this.widgetConstructorService.hexToRgb(color, opacity)).toString();
  }

  public setVideoBGStyle() {
    if (($('.video-bg').width() !== 0) && ($('.video-bg').height() !== 0)) {
      if (($('.video-bg').width() / $('.video-bg').height()) >= (16 / 9)) {
        return 'wide-video-bg-ext';
      } else {
        return 'narrow-video-bg-ext';
      }
    }
    return '';
  }

  public colorPodStyles() {
    return {
      background: this.widget.guiprops?.formExt?.enable
        ? this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod
        : this.widget.guiprops.form.colorPod.rgbaColorPod,
      'border-bottom-left-radius': this.getColorPodBorderRadius(),
      'border-bottom-right-radius': this.getColorPodBorderRadius()
    };
  }

  public getTimerLabelItem(item, type, index) {
    if (item.type.type === 0) {
      return '1';
    }
    return this.prepareItemTime(item.type1Model[type])[index];
  }

  private prepareItemTime(data) {
    return ('0' + data).slice(-2);
  }

  private getColorPodBorderRadius() {
    if (this.widget.guiprops.formExt?.model?.mainSettings?.visual?.type === 1 ||
      this.widget.guiprops.form.visual === 'На всю ширину' || this.widget.guiprops.image.enable === false)
    {
      if ((this.widget.guiprops.image.place === 'Слева') || (this.widget.guiprops.image.place === 'Справа') ||
        (this.widget.guiprops.image.place === 'Сверху') || !this.widget.guiprops.image.enable)
      {
        return this.widget.guiprops.bg.borderRadius;
      }
      else {
        return '0';
      }
    }
    else {
      return '0';
    }
  }

}
