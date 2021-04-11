import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorDesignService } from '../../../services/widget-constructor-design.service';

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
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

  constructor(private widgetConstructorDesignService: WidgetConstructorDesignService) { }

  ngOnInit(): void {
  }

  public trackById(index, item) {
    return item.id;
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

  public getRGBAColor(item) {
    return this.widgetConstructorDesignService.getRGBAColor(item);
  }

  public classNameImg() {
    return this.widgetConstructorDesignService
      .classNameImg(this.widget.guiprops.image, this.widget.guiprops.form, this.widget.guiprops.formExt.model.mainSettings);
  }

  public classNameImgMain() {
    return this.widgetConstructorDesignService.classNameImgMain(this.widget.guiprops.image);
  }

  public classNameVerticalOrient() {
    return this.widgetConstructorDesignService.classNameVerticalOrient(this.widget.guiprops.dhVisual);
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
      background: this.widget.guiprops.formExt.enable
        ? this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod
        : this.widget.guiprops.form.colorPod.rgbaColorPod,
      'border-bottom-left-radius': this.getColorPodBorderRadius(),
      'border-bottom-right-radius': this.getColorPodBorderRadius()
    };
  }

  private getColorPodBorderRadius() {
    if (this.widget.guiprops.formExt.model.mainSettings.visual.type === 1 ||
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
