import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FullWidget } from '../../../../core/models/widgets';
import { WidgetConstructorService } from '../../services/widget-constructor.service';
import { CoreSitesService } from '../../../../core/services/core-sites.service';
import { TariffsService } from '../../../../core/services/tariffs.service';

@Component({
  selector: 'app-elements-add',
  templateUrl: './elements-add.component.html',
  styleUrls: ['./elements-add.component.scss']
})
export class ElementsAddComponent implements OnInit {
  @Input() public isContainerized: boolean;
  @Input() private widget: FullWidget;
  @Input() private sid: string;
  @Input() private addElemFromWidget: boolean;
  @Input() private controls: Record<string, any>;
  @Input() private systemFonts: object[];
  @Input() private typeClass: string[];
  @Input() private widthHrType: string[];
  @Input() private widgwidthBtn: string[];
  @Input() private floatBtn: string[];
  @Input() private isPayment: boolean;
  @Input() private globalCouponObject: object;

  @Output() private addElement = new EventEmitter<void>();

  constructor(
    private translate: TranslateService,
    private coreSitesService: CoreSitesService,
    private tariffsService: TariffsService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngOnInit(): void {
  }

  public addFormExtButtonElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    const formElementToAdd = {
      name: 'form-ext-element'
    };


    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(formElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, formElementToAdd);
    }
    this.widget.guiprops.formExt.enable = true;

    this.addElementModalHide();
  }

  public addElementModalHide() {
    this.addElement.emit();
    (this.controls.newElementModal as any).modal('hide');
    $('body').removeClass('modal-open-h100');
  }

  public addFormButtonElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    const formElementToAdd = {
      name: 'form-element'
    };

    this.widget.guiprops.form.enable = true;

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(formElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, formElementToAdd);
    }

    this.addElementModalHide();
  }

  public addCloseLinkElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    const closeLinkElementToAdd = {
      name: 'closelink-element'
    };
    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(closeLinkElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, closeLinkElementToAdd);
    }

    this.addElementModalHide();
  }

  public disElementOrNotBtn() {
    return this.widget.guiprops?.form?.enable || this.widget.guiprops?.button?.enable || this.widget.guiprops?.formExt?.enable;
  }

  public disElementOrNotBtnCloseLink() {
    if (!this.widget.guiprops) {
      return;
    }

    for (const item of this.widget.guiprops.elementsList) {
      if (item.name === 'closelink-element' ||
        (this.widget.guiprops.formExt && this.widget.guiprops.formExt.enable &&
          this.widgetConstructorService.isFormHasCurrentTypeButtons(this.widget.guiprops.formExt.model.list, 2))) {
        return true;
      }
    }
    return false;
  }

  public addButtonElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    const buttonElementToAdd = {
      name: 'button-element'
    };
    this.widget.guiprops.button.enable = true;

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(buttonElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, buttonElementToAdd);
    }

    this.addElementModalHide();
  }

  public addTextElement() {
    const textElementToAdd = {
      name: 'title-element',
      textSummer: '<p>Вы можете редактировать этот текст. Если вы хотите<br>изменить цвет, позиционирование или стиль текста,<br>то выделите фрагмент для появления окна редактора.<br>Размер и шрифт изменяются слева в блоке настроек элемента.</p>',
      font: this.systemFonts[0],
      fontType: 'systemFont',
      fontName: '',
      fontSize: 12,
      counter: 0,
      textShadow: {
        enable: false,
        color: '#000000',
        opacity: '1',
        rgbaColor: (this.widgetConstructorService.hexToRgb('#FFFFFF', 1)).toString(),
        horiz: 0,
        vertical: 0,
        blur: 0
      }
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(textElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, textElementToAdd);
    }

    this.addElementModalHide();
  }

  public addSocialElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    const socialElementToAdd = {
      name: 'social-element'
    };
    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(socialElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, socialElementToAdd);
    }

    this.addElementModalHide();
  }

  public disElementOrNotBtnSocial() {
    if (!this.widget.guiprops) {
      return;
    }

    for (const item of this.widget.guiprops.elementsList) {
      if (item.name === 'social-element') {
        return true;
      }
    }
    return false;
  }

  public addSplitElement() {
    const splitElementToAdd = {
      name: 'split-element',
      type: this.typeClass[0],
      color: '#000000',
      width_type: this.widthHrType[0],
      widthpx: 200,
      counter: 0,
      position: this.floatBtn[0]
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(splitElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, splitElementToAdd);
    }

    this.addElementModalHide();
  }

  public addVideoElement() {
    const videoElementToAdd = {
      name: 'video-element',
      videoUrl: 'https://',
      videoId: '',
      videoType: 'youtube',
      type: this.typeClass[0],
      width_type: this.widthHrType[0],
      widthpx: 100,
      counter: 0,
      position: this.floatBtn[0]
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(videoElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, videoElementToAdd);
    }

    this.addElementModalHide();
  }

  public addImageElement() {
    const imageElementToAdd = {
      name: 'image-element',
      imageUrl: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg',
      type: this.typeClass[0],
      width_type: this.widthHrType[1],
      widthpx: 100,
      counter: 0,
      position: this.floatBtn[1]
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(imageElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, imageElementToAdd);
    }

    this.addElementModalHide();
  }

  public addPaddingElement() {
    const paddingElementToAdd = {
      name: 'padding-element',
      counter: 0,
      padding: 20
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(paddingElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, paddingElementToAdd);
    }

    this.addElementModalHide();
  }

  public addIframeElement() {
    const iframeElementToAdd = {
      name: 'iframe-element',
      type: this.typeClass[0],
      width_type: this.widthHrType[0],
      widthpx: 100,
      height_type: this.widgwidthBtn[0],
      heightpx: 100,
      counter: 0,
      position: this.floatBtn[0],
      html_value: '',
      css_value: '',
      real_height: 100
    };

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push(iframeElementToAdd);
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, iframeElementToAdd);
    }

    this.addElementModalHide();
  }

  public addCouponElement() {
    if (!this.isPayment) {
      this.showPaymentDialog(this.sid, this.translate.instant('widgetsList.payment.features'));
      return;
    }

    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push({ ...this.globalCouponObject });
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, { ...this.globalCouponObject });
    }

    this.addElementModalHide();
  }

  public addTimerElement() {
    const timerModel = this.widgetConstructorService.getDefaultTimerSettings();
    if (this.addElemFromWidget === false) {
      this.widget.guiprops.elementsList.push({ ...timerModel });
    } else {
      this.widget.guiprops.elementsList.splice(+this.addElemFromWidget + 1, 0, { ...timerModel });
    }

    this.addElementModalHide();
  }

  private showPaymentDialog(siteId, description) {
    this.tariffsService.checkTariffPlans(siteId,
      this.translate.instant('sitelist.tariff.improve'),
      description, this.coreSitesService.getSiteById(siteId).name
    );
  }

}
