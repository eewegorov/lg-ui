import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Options } from '@angular-slider/ngx-slider';
import { FlowDirective } from '@flowjs/ngx-flow';
import { Coupon } from '../../../../core/models/coupons';
import { FullWidget } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import { WidgetConstructorDesignService } from '../../services/widget-constructor-design.service';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;
  @Input() public sid: string;
  @Input() public wid: string;
  @Input() public isPayment: boolean;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public isDesigner: boolean;
  @Input() public isMockup: boolean;
  @Input() public isContainerized: boolean;
  @Input() private currentActiveTab: string;

  public isLoading = false;
  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };
  public placePopup = [
    'По центру окна браузера',
    'Верхний левый угол',
    'Верхний правый угол',
    'Сверху по центру',
    'Нижний левый угол',
    'Нижний правый угол',
    'Снизу по центру',
    'Справа по центру',
    'Слева по центру'
  ];
  public visualInputForm = ['Под контентом', 'На всю ширину'];
  public floatBtn = ['Слева', 'По центру', 'Справа'];
  public widthBtn = ['Авто', 'От края до края', 'Собственная'];

  private SP_widget: any;
  private validators = [];
  private couponsId = [];
  private customFields = [];
  private formExtIdsCached = [];
  private couponsErrorFlag = false;
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;
  private addElemFromWidget = false;
  private systemFonts = [];
  private controls = {
    newModal: $('#addNewWidgetListModal'),
    newElementModal: $('#addNewElementListModal')
  };
  private typeClass = ['1', '2', '3', '4', '5', '6'];
  private widthHrType = ['От края до края', 'Собственная'];
  private widgwidthBtn = ['Авто', 'Собственная'];
  private orientInputForm = ['Вертикальная', 'Горизонтальная'];
  private typeImg = ['От края до края', 'От другого края'];
  private placeImg = ['Слева', 'Сверху', 'Справа', 'Снизу'];
  private imageItemsType = ['Растянуть по ширине и высоте блока', 'Установить произвольные габариты'];
  private imageItemsAlign = ['По центру', 'По верхнему краю', 'По нижнему краю'];
  private maskTypeList = ['Вся площадь виджета', 'Только под контентом'];
  private tilesList = ['Замостить по X', 'Замостить по Y', 'Замостить по X+Y'];
  private bgPositionTypesList = ['Растянуть', 'Замостить'];
  private placeDh = ['Левый нижний угол', 'Правый нижний угол'];
  private vertOrientDh = ['От верхней границы', 'По центру виджета', 'От нижней границы'];
  private staticWidgetAlign = ['По центру', 'По левому краю', 'По правому краю'];
  private sizeSocBtn = ['Большой', 'Средний', 'Маленький'];
  private placeLabel = ['Нижний левый угол', 'Нижний правый угол', 'Правая сторона браузера', 'Левая сторона браузера'];
  private globalCouponObject;
  private imageCustom = null;
  private linkImage = '';

  private autoUploadSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService,
    private widgetConstructorDesignService: WidgetConstructorDesignService
  ) {
    this.systemFonts = this.widgetConstructorDesignService.getSystemFontList();
  }

  ngOnInit(): void {
    this.widgetService.addOnWidgetLoadListener(this.loadListener);
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.flow.upload();
      }
    });
  }

  private loadListener() {
    /**
     * Def Objects
     */
    if (typeof this.widget.guiprops === 'undefined') {
      this.widget.guiprops = {};
    }

    if (typeof this.widget.guiprops.elementsList === 'undefined') {
      this.widget.guiprops.elementsList = [];
    }

    this.widget.guiprops.selected = null;


    if (this.widget.name === '') {

      this.widget.name = 'Точка захвата';
    }


    if (typeof this.widget.guiprops.title === 'undefined') {
      this.widget.guiprops.title = {
        enable: false,
        textSummer: '<p>Заголовок (выделите для редактирования)</p>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 22,
      };
    }

    if (typeof this.widget.guiprops.exit === 'undefined') {
      this.widget.guiprops.exit = {
        enable: false,
        textSummer: '<span>Закрыть окно (выделите, что бы редактировать)</span>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        position: 'Слева',
        fontSize: 14,
        button: {
          enable: false,
          textSummer: '<span>Закрыть окно</span>',
          font: this.systemFonts[0],
          fontType: 'systemFont',
          fontName: '',
          fontSize: 20,
          colorBtn: '#000000',
          colorTextBtn: '#FFFFFF',
          borderRadiusBtn: 0,
          btn_width: this.widthBtn[0],
          btn_widthpx: 200,
          position: this.floatBtn[0],
          styleType: 'Default'
        },
        couponCallback: {
          enable: false,
          elementType: 'closeBtn',
          coupon: { ...this.globalCouponObject }
        }
      };
    }


    if (typeof this.widget.guiprops.thank === 'undefined') {
      this.widget.guiprops.thank = {
        enable: false,
        textSummer: '<p>Спасибо!</p>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 20
      };
    }

    if (typeof this.widget.guiprops.thank2 === 'undefined') {
      this.widget.guiprops.thank2 = {
        textSummer: '<p>Форма успешно отправлена.</p>'
      };
    }


    if (typeof this.widget.guiprops.desc === 'undefined') {
      this.widget.guiprops.desc = {
        enable: false,
        textSummer: '<p>Описание (выделите для редактирования)</p>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 18
      };
    }


    if (typeof this.widget.guiprops.form === 'undefined') {
      this.widget.guiprops.form = {
        enable: false,
        colorTitleInputForm: '#000000',
        bgInputForm: '#FFFFFF',
        opacityBgInputForm: '1',
        borderRadiusInputForm: '0',
        rgbaInputForm: '',
        orient: this.orientInputForm[0],
        visual: this.visualInputForm[0],
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
        width_type: this.widthHrType[0],
        position: this.floatBtn[0],
        form_width_type: this.widthHrType[0],
        form_position: this.floatBtn[0],
        form_widthpx: 200,
        widthpx: 100,
        couponCallback: {
          enable: false,
          elementType: 'form',
          coupon: { ...this.globalCouponObject }
        }
      };
    }


    if (typeof this.widget.guiprops.button === 'undefined') {
      this.widget.guiprops.button = {
        enable: false,
        textSummer: '<span>Отправить</span>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 20,
        colorBtn: '#000000',
        colorTextBtn: '#FFFFFF',
        borderRadiusBtn: 0,
        btn_width: this.widthBtn[0],
        btn_widthpx: 200,
        position: this.floatBtn[0],
        styleType: 'Default'
      };
    }


    if (typeof this.widget.guiprops.image === 'undefined') {
      this.widget.guiprops.image = {
        enable: false,
        type: this.typeImg[0],
        place: this.placeImg[0],
        img_width: this.widgwidthBtn[0],
        img_widthpx: 100,
        img_height: this.widgwidthBtn[0],
        img_heightpx: 100,
        width: 0,
        height: 0,
        url: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg',
        typeBl: 'imageBl',
        img_item_widthpx: 100,
        img_item_heightpx: 100,
        img_item_type: this.imageItemsType[0],
        img_item_align: this.imageItemsAlign[0],
        videoUrl: 'https://',
        videoId: '',
        videoType: 'youtube',
        autoplay: false
      };
    }

    if (typeof this.widget.guiprops.image.typeBl === 'undefined') {
      this.widget.guiprops.image.typeBl = 'imageBl';
    }
    if (typeof this.widget.guiprops.image.img_item_widthpx === 'undefined') {
      this.widget.guiprops.image.img_item_widthpx = 100;
    }
    if (typeof this.widget.guiprops.image.img_item_heightpx === 'undefined') {
      this.widget.guiprops.image.img_item_heightpx = 100;
    }
    if (typeof this.widget.guiprops.image.img_item_type === 'undefined') {
      this.widget.guiprops.image.img_item_type = this.imageItemsType[0];
    }
    if (typeof this.widget.guiprops.image.img_item_align === 'undefined') {
      this.widget.guiprops.image.img_item_align = this.imageItemsAlign[0];
    }
    if (typeof this.widget.guiprops.image.videoUrl === 'undefined') {
      this.widget.guiprops.image.videoUrl = 'https://';
    }
    if (typeof this.widget.guiprops.image.videoId === 'undefined') {
      this.widget.guiprops.image.videoId = '';
    }
    if (typeof this.widget.guiprops.image.videoType === 'undefined') {
      this.widget.guiprops.image.videoType = 'youtube';
    }
    if (typeof this.widget.guiprops.exit.position === 'undefined') {
      this.widget.guiprops.exit.position = 'Слева';
    }
    if (typeof this.widget.guiprops.form.form_width_type === 'undefined') {
      this.widget.guiprops.form.form_width_type = this.widthHrType[0];
    }
    if (typeof this.widget.guiprops.form.form_position === 'undefined') {
      this.widget.guiprops.form.form_position = this.floatBtn[0];
    }
    if (typeof this.widget.guiprops.form.form_widthpx === 'undefined') {
      this.widget.guiprops.form.form_widthpx = 200;
    }

    if (typeof this.widget.guiprops.form.couponCallback === 'undefined') {
      this.widget.guiprops.form.couponCallback = {
        enable: false,
        elementType: 'form',
        coupon: { ...this.globalCouponObject }
      };
    }
    if (typeof this.widget.guiprops.exit.couponCallback === 'undefined') {
      this.widget.guiprops.exit.couponCallback = {
        enable: false,
        elementType: 'closeBtn',
        coupon: { ...this.globalCouponObject }
      };
    }

    if (typeof this.widget.guiprops.button.styleType === 'undefined') {
      this.widget.guiprops.button.styleType = 'Default';
    }

    if (typeof this.widget.guiprops.bg === 'undefined') {
      this.widget.guiprops.bg = {
        fillorImg: 'fill',
        colorBg: '#FFFFFF',
        bgStyle: '#FFFFFF',
        fillorContentImg: 'fill',
        colorContentBg: '#FFFFFF',
        borderRadius: '',
        border: {
          enable: false,
          style: '0px solid transparent',
          color: '#000000',
          thickness: '1'
        },
        shadow: {
          enable: true,
          style: '0px 1px 5px 0px rgba(0,0,0,0.25)',
          color: '#000000',
          opacity: '0.3',
          rgbaColor: (this.hexToRgb('#000000', 0.3)).toString(),
          horiz: 0,
          vertical: 1,
          blur: 5
        },
        mask: {
          enable: false,
          area: this.maskTypeList[0],
          color: '#000000',
          rgbaColor: (this.hexToRgb('#000000', 1)).toString(),
          opacity: '1'
        },
        positionType: this.bgPositionTypesList[0],
        tiles: this.tilesList[0],
        url: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg',
        opacity: '1'
      };
    }

    if (typeof this.widget.guiprops.bg.shadow === 'undefined') {
      this.widget.guiprops.bg.shadow = {
        enable: true,
        style: '0px 1px 5px 0px rgba(0,0,0,0.25)',
        color: '#000000',
        opacity: '0.3',
        rgbaColor: (this.hexToRgb('#000000', 0.3)).toString(),
        horiz: 0,
        vertical: 1,
        blur: 5
      };
    }
    if (typeof this.widget.guiprops.bg.border === 'undefined') {
      this.widget.guiprops.bg.border = {
        enable: false,
        style: '0px solid transparent',
        color: '#000000',
        thickness: '1'
      };
    }
    if (typeof this.widget.guiprops.bg.positionType === 'undefined') {
      this.widget.guiprops.bg.positionType = this.bgPositionTypesList[0];
    }
    if (typeof this.widget.guiprops.bg.tiles === 'undefined') {
      this.widget.guiprops.bg.tiles = this.tilesList[0];
    }
    if (typeof this.widget.guiprops.bg.opacity === 'undefined') {
      this.widget.guiprops.bg.opacity = '1';
    }
    if (typeof this.widget.guiprops.bg.mask === 'undefined') {
      this.widget.guiprops.bg.mask = {
        enable: false,
        area: this.maskTypeList[0],
        color: '#000000',
        rgbaColor: (this.hexToRgb('#000000', 1)).toString(),
        opacity: '1'
      };
    }

    if (typeof this.widget.guiprops.exit.button === 'undefined') {
      this.widget.guiprops.exit.button = {
        enable: false,
        textSummer: '<span>Закрыть окно</span>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 20,
        colorBtn: '#000000',
        colorTextBtn: '#FFFFFF',
        borderRadiusBtn: 0,
        btn_width: this.widthBtn[0],
        btn_widthpx: 200,
        position: this.floatBtn[0],
        styleType: 'Default'
      };
    }

    if (typeof this.widget.guiprops.bg.video === 'undefined') {
      this.widget.guiprops.bg.video = {
        videoUrl: 'https://',
        videoId: '',
        videoType: 'youtube',
        isVideoBG: true
      };
    }


    if (typeof this.widget.guiprops.formSet === 'undefined') {
      this.widget.guiprops.formSet = {
        items: [{
          state: 0,
          type: 'email',
          required: false,
          placeholder: 'Введите Ваш email'
        }],
        phoneMask: {
          enable: false,
          maskValue: '+7 (***) ***-**-**'
        },
        redirect: {
          enable: false,
          url: '',
          blank: false
        }
      };
    }

    if (typeof this.widget.guiprops.formSet.phoneMask === 'undefined') {
      this.widget.guiprops.formSet.phoneMask = { enable: false, maskValue: '+7 (***) ***-**-**' };
    }


    if (typeof this.widget.guiprops.dhVisual === 'undefined') {
      this.widget.guiprops.dhVisual = {
        enable: false,
        enableBlink: false,
        title: 'Узнайте о акции!',
        colorMain: '#FFFFFF',
        place: this.placeDh[0],
        colorBg: '#000000',
        rgbaShadowForm1: '',
        rgbaShadowForm2: '',
        widget_width: this.widgwidthBtn[1],
        widget_widthpx: 400,
        widget_heightpx: 300,
        widget_content_width: this.widgwidthBtn[1],
        widget_content_widthpx: 400,
        widget_content_height: this.widgwidthBtn[0],
        widget_content_heightpx: 300,
        widget_content_height_orient: this.vertOrientDh[0],
        selectedIcon: 'fas fa-circle',
        iconOrImage: 'useIcon',
        url: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg',
        widget_width_all: 'auto',
        widget_height_all: 'auto',
        widget_plash_width: 'auto',
        widget_width_nopx: 500,
        widget_height_nopx: 100,
        widget_ul_width_nopx: 400,
        CP_width: 500,
        CP_offset_top: 100,
        showAddButtonOnWidget: true
      };
    }

    if (typeof this.widget.guiprops.popupMain === 'undefined') {
      this.widget.guiprops.popupMain = {
        place: this.placePopup[0],
        shadow: {
          enable: false,
          color: '#000000',
          opacityColor: '0.5',
          rgbaColor: ''
        }
      };
    }

    if (typeof this.widget.guiprops.staticMain === 'undefined') {
      this.widget.guiprops.staticMain = {
        position: this.staticWidgetAlign[0]
      };
    }


    if (typeof this.widget.guiprops.social === 'undefined') {
      this.widget.guiprops.social = {
        vkontakte: 'vkontakte',
        facebook: false,
        googleplus: false,
        digg: false,
        twitter: false,
        pinterest: false,
        buffer: false,
        pocket: false,
        odnoklassniki: false,
        stumbleupon: false,
        reddit: false,
        linkedid: false,
        items: [{
          name: 'vkontakte'
        }],
        position: this.floatBtn[0],
        sizeBtn: this.sizeSocBtn[0],
        type: 'style-2',
        linkForShare: 'site',
        couponCallback: {
          enable: false,
          elementType: 'social',
          coupon: { ...this.globalCouponObject }
        }
      };
    }

    if (typeof this.widget.guiprops.social.couponCallback === 'undefined') {
      this.widget.guiprops.social.couponCallback = {
        enable: false,
        elementType: 'social',
        coupon: { ...this.globalCouponObject }
      };
    }

    if (typeof this.widget.guiprops.labelMain === 'undefined') {
      this.widget.guiprops.labelMain = {
        place: this.placeLabel[0],
        width: 100,
        height: 30,
        text: 'Подпишитесь на нашу рассылку!',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 16,
        colorLabel: '#000000',
        colorText: '#FFFFFF',
        opacityBgLabel: '1',
        borderRadiusLabel: '0',
        rgbaLabel: '',
        icon: {
          enable: false,
          color: '#FFFFFF',
          selectedIcon: 'fas fa-circle'
        },
        iconOrImage: 'useIcon',
        url: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg'
      };
    }

    if (typeof this.widget.guiprops.dhVisual.iconOrImage === 'undefined') {
      this.widget.guiprops.dhVisual.iconOrImage = 'useIcon';
    }
    if (typeof this.widget.guiprops.dhVisual.url === 'undefined') {
      this.widget.guiprops.dhVisual.url = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';
    }
    if (typeof this.widget.guiprops.labelMain.iconOrImage === 'undefined' && this.widget.guiprops.labelMain.icon.enable) {
      this.widget.guiprops.labelMain.iconOrImage = 'useIcon';
    }
    if (typeof this.widget.guiprops.labelMain.url === 'undefined') {
      this.widget.guiprops.labelMain.url = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';
    }

    if (this.widget.guiprops.elementsList.length) {
      this.widget.guiprops.elementsList.forEach((el) => {
        if (el.name && el.name === 'coupon-element') {
          if (typeof el.closeAfter === 'undefined') {
            el.closeAfter = false;
          }
          if (typeof el.isCopyAction === 'undefined') {
            el.isCopyAction = false;
          }
        }
      });
    }
    if (typeof this.widget.guiprops.form.couponCallback.coupon.closeAfter === 'undefined') {
      this.widget.guiprops.form.couponCallback.coupon.closeAfter = false;
    }
    if (typeof this.widget.guiprops.form.couponCallback.coupon.isCopyAction === 'undefined') {
      this.widget.guiprops.form.couponCallback.coupon.isCopyAction = false;
    }
    if (typeof this.widget.guiprops.social.couponCallback.coupon.closeAfter === 'undefined') {
      this.widget.guiprops.social.couponCallback.coupon.closeAfter = false;
    }
    if (typeof this.widget.guiprops.social.couponCallback.coupon.isCopyAction === 'undefined') {
      this.widget.guiprops.social.couponCallback.coupon.isCopyAction = false;
    }
    if (typeof this.widget.guiprops.exit.couponCallback.coupon.closeAfter === 'undefined') {
      this.widget.guiprops.exit.couponCallback.coupon.closeAfter = false;
    }
    if (typeof this.widget.guiprops.exit.couponCallback.coupon.isCopyAction === 'undefined') {
      this.widget.guiprops.exit.couponCallback.coupon.isCopyAction = false;
    }

    if (typeof this.widget.guiprops.formExt === 'undefined') {
      this.widget.guiprops.formExt = {
        enable: false,
        model: {
          list: [],
          mainSettings: this.widgetConstructorDesignService.getDefaultFormExtMainSettings()
        },
        couponCallback: {
          enable: false,
          elementType: 'form',
          coupon: { ...this.globalCouponObject }
        }
      };
      setTimeout(() => {
        this.widget.guiprops.formExt.model.mainSettings = this.widgetConstructorDesignService.getDefaultFormExtMainSettings();
      }, 50);
    }
  }

  public trackById(index, item) {
    return item.id;
  }

  public goToTest(widget) {
    this.router.navigate([`/abtests/active?testIdNum-${widget.abtestInfo.id}`]).then();
  }

  public saveAsMockup() {
    let errorsList = this.runValidators();
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
    } else {
      ($('#saveAsMockupModal') as any).modal('show');
    }
  }

  public startWidget(widget) {
    if (!widget.active) {
      this.switchWidget(widget, true);
    }
  }

  public stopWidget(widget) {
    if (widget.active) {
      this.switchWidget(widget, false);
    }
  }

  public saveWidget() {
    if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
    }
  }

  public addNewElementToContent(item?) {
    if (typeof item !== 'undefined') {
      this.addElemFromWidget = item;
    } else {
      this.addElemFromWidget = false;
    }

    (this.controls.newElementModal as any).modal('show');
    $('body').addClass('modal-open-h100');
  }

  private switchWidget(widget, newValue) {
    $('[role="tooltip"]').remove();
    if (widget.active === newValue) { return false; }
    if (this.isContainerized) {
      this.containerizedWidgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    } else {
      this.widgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    }
  }

  private saveMockupItem() {
    let errorsList = this.runValidators();
    this.isLoading = true;

    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else {
      const savedInstance = {
        name: this.widget.name,
        guiprops:  this.widget.guiprops,
        autoinvite:  this.widget.autoinvite,
        restrictions:  this.widget.restrictions,
        autoresponder:  this.widget.autoresponder,
        rules:  this.widget.rules
      } as FullWidget;

      this.widgetService.updateMockup(this.wid, savedInstance).subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translate.instant('widgetsList.editor.save.done.desc', this.translate.instant('widgetsList.editor.save.done.title')));
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        },
        () => {
          this.toastr.error(this.translate.instant('widgetsList.editor.save.error.desc'), this.translate.instant('widgetsList.editor.save.error.title'));
          this.isLoading = false;
          Swal.fire(
            this.translate.instant('widgetsList.editor.save.error.title'),
            this.translate.instant('widgetsList.editor.save.error.desc'),
            'error'
          ).then();
        }
      );
    }
  }

  public changeModel() {
    const mainBlockW = $('.widget-image');
    const mainBl     = $('#mainBlockWidget');
    const mainBlWr   = $('#widgetMainWr');
    const maskTop = $('#widgetMaskTop');
    const gap18  = '-18px';
    const gap3   = '-3px';

    let widthImageStyle = '';
    let heightImageStyle = '';

    mainBlockW.addClass('hide-image-bl-for-rebuild');
    setTimeout(() => {
      mainBlockW.removeClass('hide-image-bl-for-rebuild');
    }, 300);

    if (this.widget.guiprops.image.enable && this.widget.guiprops.image.typeBl && (this.widget.guiprops.image.typeBl === 'videoBl')) {
      $('#idImageVideoFrame').attr('src', this.widget.guiprops.image.videoUrl);
    }

    if (((this.widget.guiprops.image.place === 'Слева') || (this.widget.guiprops.image.place === 'Справа'))) {
      if (this.widget.guiprops.image.img_width === 'Собственная') {
        const newWidth = (this.widget.guiprops.image.img_widthpx * 1).toString();
        widthImageStyle = newWidth + 'px';
      }
      else {
        widthImageStyle = '33%';
      }
    }

    if (((this.widget.guiprops.image.place === 'Сверху') || (this.widget.guiprops.image.place === 'Снизу'))) {
      if (this.widget.guiprops.image.img_height === 'Собственная') {
        const newHeight = (this.widget.guiprops.image.img_heightpx * 1).toString();
        heightImageStyle = newHeight + 'px';
      }
      else {
        heightImageStyle = '150px';
      }
    }

    if (this.currentActiveTab === 'design') {
      setTimeout(() => {
        if (!$('#thankWidget').hasClass('active')) {
          if (this.widget.guiprops.image.enable) {
            // Под контентом Слева или Справа
            if (this.widgetConstructorDesignService.ruleLeftOrRightUnderContent(
              this.widget.guiprops.formExt,
              this.widget.guiprops.form.visual,
              this.widget.guiprops.image.place
            )) {
              $('#colorFormPod').css({'z-index': '0'});
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_width === 'Собственная') {
                let imageWidgetWidthPod;
                setTimeout(() => {
                  $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
                  mainBlockW.css({width: widthImageStyle, height: '100%'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({'margin-left': mainBlockW.innerWidth() - 15 + 'px', 'margin-right': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px', left: 'auto', right: '0'});
                    maskTop.css({left: gap3, right: gap18});
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    imageWidgetWidthPod = (mainBlockW.innerWidth() - 10);
                    $('.widget-main-img-right').css({'margin-right': mainBlockW.innerWidth() - 15 + 'px', 'margin-left': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px', left: '0'});
                    maskTop.css({left: gap18, right: gap3});
                  }, 200);
                }
              }
              //// Размер АВТО
              else {
                let imageWidgetWidthPod;
                setTimeout(() => {
                  imageWidgetWidthPod = (mainBlWr.innerWidth() + 60) / 2;
                  $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
                  mainBlockW.css({width: imageWidgetWidthPod + 'px'});
                  mainBlockW.css({height: '100%'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({'margin-left': mainBlockW.innerWidth() - 15 + 'px', 'margin-right': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px', left: 'auto', right: '0'});
                    maskTop.css({left: gap3, right: gap18});
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({'margin-right': mainBlockW.innerWidth() - 15 + 'px', 'margin-left': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px', left: '0', right: 'auto'});
                    maskTop.css({left: gap18, right: gap3});
                  }, 200);
                }
              }
            }

            // Картинка сверху или снизу
            if (((this.widget.guiprops.image.place === 'Сверху') || (this.widget.guiprops.image.place === 'Снизу'))) {
              $('#colorFormPod').css({'z-index': '0'});
              $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
              maskTop.css({left: gap18, right: gap18});
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_height === 'Собственная') {
                setTimeout(() => {
                  mainBlockW.css({height: heightImageStyle});
                  $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
                  mainBlockW.css({width: '100%'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Сверху') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({'margin-left': 0, 'margin-right': 0, 'margin-top': mainBlockW.innerHeight() + 'px', 'margin-bottom': 0});
                    $('.widget-main-img-bottom').css({'margin-left': 0, 'margin-right': 0});
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Снизу') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({'margin-left': 0, 'margin-right': 0});
                    $('.widget-main-img-bottom').css({'margin-left': 0, 'margin-right': 0, 'margin-bottom': mainBlockW.innerHeight() - 1 + 'px', 'margin-top': 0});
                  }, 200);
                }
              }
              //// Размер АВТО
              else {
                let imageHeightWidthPod;
                setTimeout(() => {
                  imageHeightWidthPod = mainBlWr.innerHeight() / 3;
                  $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
                  mainBlockW.css({height: imageHeightWidthPod, width: '100%'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Сверху') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({'margin-left': 0, 'margin-right': 0, 'margin-top': mainBlockW.innerHeight() + 'px', 'margin-bottom': 0});
                    $('.widget-main-img-bottom').css({'margin-left': 0, 'margin-right': 0});
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Снизу') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({'margin-left': 0, 'margin-right': 0});
                    $('.widget-main-img-bottom').css({'margin-left': 0, 'margin-right': 0, 'margin-bottom': mainBlockW.innerHeight() + 'px', 'margin-top': 0});
                  }, 200);
                }
              }
            }

            // На ВСЮ ШИРИНУ СЛЕВА или СПРАВА
            if (this.widgetConstructorDesignService.ruleLeftOrRightWholeWidth(
              this.widget.guiprops.formExt, this.widget.guiprops.form.visual, this.widget.guiprops.image.place
            )) {
              setTimeout(() => {
                $('#colorFormPod').css({'z-index': '2'});
                $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
              }, 220);
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_width === 'Собственная') {
                console.log('FULL WIDTH LR 2', $('.color-pod'));
                let mainBlHeight;
                setTimeout(() => {
                  mainBlockW.css({width: widthImageStyle});
                  mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                  if (this.widget.guiprops.bg.border.enable) {
                    mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                  }
                  mainBlockW.css({height: mainBlHeight + 'px'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('#colorFormPod').innerWidth();
                    $('.widget-main-img-left').css({'margin-left': mainBlockW.innerWidth() - 15 + 'px', 'margin-right': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
                    $('.extraClassFullWidth')
                      .css({'margin-left': - mainBlockW.innerWidth() + 'px', width: $('#colorFormPod').innerWidth() - 95 + 'px', 'margin-right': 0});

                    maskTop.css({left: gap3, right: gap18});
                  }, 200);
                  setTimeout(() => {
                    mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({height: mainBlHeight + 'px'});
                  }, 210);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({'margin-right': mainBlockW.innerWidth() - 15 + 'px', 'margin-left': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
                    $('.extraClassFullWidth')
                      .css({'margin-right': - mainBlockW.innerWidth() + 'px', width: $('#colorFormPod').innerWidth() - 95 + 'px', 'margin-left': 0});

                    maskTop.css({left: gap18, right: gap3});
                  }, 200);
                  setTimeout(() => {
                    mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({height: mainBlHeight + 'px'});
                  }, 210);
                }
              }
              //// Размер АВТО
              else {

                let imageWidgetWidthPod;
                let mainBlHeightAll;
                setTimeout(() => {
                  imageWidgetWidthPod = (mainBlWr.innerWidth() + 60) / 2;
                  mainBlockW.css({width: imageWidgetWidthPod + 'px'});
                  mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                  if (this.widget.guiprops.bg.border.enable) {
                    mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                  }
                  mainBlockW.css({height: mainBlHeightAll + 'px'});
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({'margin-left': mainBlockW.innerWidth() - 15 + 'px', 'margin-right': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
                    $('.extraClassFullWidth')
                      .css({'margin-left': - mainBlockW.innerWidth() + 'px', width: $('#colorFormPod').innerWidth() - 95 + 'px', 'margin-right': 0});

                    maskTop.css({left: gap3, right: gap18});
                  }, 200);
                  setTimeout(() => {
                    mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({height: mainBlHeightAll + 'px'});
                  }, 210);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({'margin-right': mainBlockW.innerWidth() - 15 + 'px', 'margin-left': 0});
                    $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
                    $('.extraClassFullWidth')
                      .css({'margin-right': - mainBlockW.innerWidth() + 'px', width: $('#colorFormPod').innerWidth() - 95 + 'px', 'margin-left': 0});

                    maskTop.css({left: gap18, right: gap3});
                  }, 200);
                  setTimeout(() => {
                    mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({height: mainBlHeightAll + 'px'});
                  }, 210);
                }
              }
            } else {
              $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
              $('.extraClassFullWidth').css({'margin-left': '0', 'margin-right': '0', width: '100%'});
            }

            if ((!this.widget.guiprops.button.enable && !this.widget.guiprops.form.enable && !this.widget.guiprops.formExt.enable)
              && (this.widget.guiprops.image.place === 'Справа' || this.widget.guiprops.image.place === 'Слева')) {

              setTimeout(() => {
                mainBlockW.css({height: '100%'});
              }, 220);
            }

          }
          else {
            $('#colorFormPod').css({width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto'});
            $('.color-pod').css({'margin-left': '0', 'margin-right': '0'});
            $('.extraClassFullWidth').css({'margin-left': '0', 'margin-right': '0', width: '100%'});
            maskTop.css({left: gap18, right: gap18});

            setTimeout(() => {
              $('#widgetMainWr').css({margin: 0});
            }, 200);
          }


          setTimeout(() => {
            $('span.img-size').text(mainBlockW.innerWidth() + 'x' + mainBlockW.innerHeight() + ' px');
            $('span.img-size-form').text((mainBl.innerWidth()) + 'x' + mainBl.innerHeight() + ' px');

            this.SP_widget.img_width = mainBlockW.innerWidth();
            this.SP_widget.img_height = mainBlockW.innerHeight();
            this.SP_widget.widget_width_all = mainBl.outerWidth() + 1 + 'px';
            this.SP_widget.widget_height_all = mainBl.outerHeight() + 'px';
            this.SP_widget.widget_width_nopx = mainBl.outerWidth() + 1;
            this.SP_widget.widget_height_nopx = mainBl.outerHeight();
            this.SP_widget.widget_CP_width = $('#colorFormPod').innerWidth();
            this.SP_widget.widget_CP_offset_top = $('#colorFormPod').css('top');
            this.SP_widget.widget_ul_width_nopx = $('#mainElListUl').innerWidth() + 1;
            this.SP_widget.widget_plash_width = $('.widget2-plashka').innerWidth() + 'px';
            this.SP_widget.widget_plash_width = $('.widget2-plashka').innerWidth() + 'px';

            $('#thankWidget').css({width: mainBl.outerWidth() + 'px', height: mainBl.outerHeight() + 'px'});
          }, 500);
        }
      }, 0);
    }

    $('#mainElListUl').removeClass('widget-flex-dis');
    setTimeout(() => {
      $('#mainElListUl').addClass('widget-flex-dis');
    }, 0);


    setTimeout(() => {
      $('.text-input-class .form-widget-cntrl').change(function() {
        if ($(this).val() !== '') {
          $(this).addClass('filled');
        } else {
          $(this).removeClass('filled');
        }
      });
    }, 200);
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

  private addElementModalHide() {
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
    return this.widget.guiprops.form.enable || this.widget.guiprops.button.enable || this.widget.guiprops.formExt.enable;
  }

  public disElementOrNotBtnCloseLink() {
    for (const item of this.widget.guiprops.elementsList) {
      if (item.name === 'closelink-element' ||
        (this.widget.guiprops.formExt && this.widget.guiprops.formExt.enable &&
          this.widgetConstructorDesignService.isFormHasCurrentTypeButtons(this.widget.guiprops.formExt.model.list, 2))) {
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
      name: 'text-element',
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
        rgbaColor: (this.hexToRgb('#FFFFFF', 1)).toString(),
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

  public closeModalImg() {
    $('body').removeClass('modal-open-h100');
  }

  public updateFile() {
    if (this.linkImage === '') {
      this.toastr.error('Пожалуйста, выберите изображение.', 'Ошибка!');
    } else {
      (this.controls.newModal as any).modal('hide');
      $('body').removeClass('modal-open-h100');

      if (this.imageCustom === 'imageSingle') {
        this.widget.guiprops.image.url = this.linkImage;
      } else if (this.imageCustom === 'dotIcon') {
        this.widget.guiprops.dhVisual.url = this.linkImage;
      } else if (this.imageCustom === 'labelIcon') {
        this.widget.guiprops.labelMain.url = this.linkImage;
      } else if (!this.imageCustom) {
        this.widget.guiprops.bg.url = this.linkImage;
      } else {
        this.imageCustom.imageUrl = this.linkImage;
      }
    }
  }

  private saveWidgetItem() {
    this.widget.guiprops.dhVisual.lastModifiedDate = new Date().toString();
    this.widget.guiprops.dhVisual.widget_width_all   = this.SP_widget.widget_width_all;
    this.widget.guiprops.dhVisual.widget_height_all  = this.SP_widget.widget_height_all;
    this.widget.guiprops.dhVisual.widget_width_nopx  = this.SP_widget.widget_width_nopx;
    this.widget.guiprops.dhVisual.widget_height_nopx = this.SP_widget.widget_height_nopx;
    this.widget.guiprops.dhVisual.widget_ul_width_nopx = this.SP_widget.widget_ul_width_nopx;
    this.widget.guiprops.dhVisual.CP_width = this.SP_widget.widget_CP_width;
    this.widget.guiprops.dhVisual.CP_offset_top = this.SP_widget.widget_CP_offset_top;
    this.widget.guiprops.image.width = this.SP_widget.img_width;
    this.widget.guiprops.image.height = this.SP_widget.img_height;

    this.addCouponsId();
    this.mapFormExtFieldId();

    let errorsList = this.runValidators();
    this.isLoading = true;
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.couponsErrorFlag) {
      this.toastr.error(this.translate.instant('widgets.constructor.coupon.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtIdsErrorFlag) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtNeedButton) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.actionButton.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtRedirectFieldEmpty) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.redirectError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.widget.useCustomIntegrationsList && !this.widget.integrations.length) {
      this.toastr.error(this.translate.instant('widgets.constructor.integration.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else {
      this.widget.jsInfo.onShowScript.script = this.widget.jsInfo.onShowScript.script || null;
      this.widget.jsInfo.onTargetScript.script = this.widget.jsInfo.onTargetScript.script || null;
      const widgetUpdatedData = {
        guiprops: this.widget.guiprops,
        autoinvite: this.widget.autoinvite,
        autoresponder: this.widget.autoresponder,
        restrictions: this.widget.restrictions,
        rules: this.widget.rules,
        audiencesEnabled: this.widget.audiencesEnabled,
        sendCrm: this.widget.sendCrm,
        coupons: this.couponsId,
        integrations: this.widget.integrations,
        useCustomIntegrationsList: this.widget.useCustomIntegrationsList,
        customFields: this.customFields,
        jsInfo: this.widget.jsInfo
      } as FullWidget;

      this.widgetService.updateWidget(this.sid, this.wid, widgetUpdatedData).subscribe((response: boolean) => {
        if (response) {
          this.toastr.success(this.translate.instant('widgetsList.editor.save.done.desc', this.translate.instant('widgetsList.editor.save.done.title')));
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      });
    }
  }

  private addCouponsId() {
    this.couponsErrorFlag = false;
    this.couponsId = [];
    if (this.isItExitCallbackCoupon(this.widget.guiprops.exit)) {
      if (this.widget.guiprops.exit.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.exit.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    if (this.isItSocialCallbackCoupon(this.widget.guiprops.social)) {
      if (this.widget.guiprops.social.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.social.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    if (this.isItFormCallbackCoupon(this.widget.guiprops.form)) {
      if (this.widget.guiprops.form.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.form.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    this.widget.guiprops.elementsList.forEach((item) => {
      if (item.name && item.name === 'coupon-element') {
        if (item.coupon.id) {
          this.couponsId.push(item.coupon.id);
        } else {
          this.couponsErrorFlag = true;
        }
      }
    });
  }

  private isItExitCallbackCoupon(_) {
    return (_.enable || (_.button && _.button.enable)) && _.couponCallback && _.couponCallback.enable;
  }

  private isItSocialCallbackCoupon(_) {
    return _.couponCallback && _.couponCallback.enable;
  }

  private isItFormCallbackCoupon(_) {
    return _.enable && _.couponCallback && _.couponCallback.enable;
  }

  private mapFormExtFieldId() {
    this.formExtIdsErrorFlag = false;
    this.formExtNeedButton = false;
    this.formExtRedirectFieldEmpty = false;
    this.formExtIdsCached = [];
    this.customFields = [];
    const listOfBodies = $('#collapseTwo').find('.form-ext-item');
    listOfBodies.each((index, item) => {
      $(item).removeClass('form-ext-item__alarm-class');
    });

    this.widget.guiprops.formExt.model.list.forEach((item, index) => {
      // Map identifier of elements in form
      if (this.widgetConstructorDesignService.isItemMultiAndHasId(item.type)) {
        if (this.isFieldIdUnique(item.idField)) {
          const formExtEnumType = {
            text: 'TEXT',
            date: 'DATE',
            rating: 'RATING',
            dd: 'LISTBOX',
            variants: 'COMBOBOX'
          };

          this.customFields.push({
            id: item.id,
            integrationTag: item.idField,
            name: item.service || item.label,
            type: formExtEnumType[item.type]
          });
        } else {
          $(listOfBodies[index]).addClass('form-ext-item__alarm-class');
          this.formExtIdsErrorFlag = true;
        }
        this.formExtIdsCached.push(item.idField);
      }
    });

    this.formExtRedirectFieldEmpty = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isButtonRedirectAndEmpty(item);
    });

    let isFormHasSendIfActionFLAG;
    const isFormHasInputsFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.widgetConstructorDesignService.isFormHasInputs(item);
    });

    const isFormHasSpecElementsFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isFormHasSpecElements(item);
    });

    if (isFormHasSpecElementsFLAG) {
      isFormHasSendIfActionFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
        return this.isFormHasSendIfAction(item);
      });
    }

    const isFormHasActionButtonFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isFormHasButtonWithAction(item);
    });

    const ifFormHasSpecWithoutActionORNot = (typeof isFormHasSendIfActionFLAG !== 'undefined' && !isFormHasSendIfActionFLAG)
      || typeof isFormHasSendIfActionFLAG === 'undefined';
    this.formExtNeedButton = isFormHasInputsFLAG && ifFormHasSpecWithoutActionORNot && !isFormHasActionButtonFLAG;
  }

  private isButtonRedirectAndEmpty(item) {
    return item.type === 'button' && (item.redirect.type.type === 1 || item.redirect.type.type === 3) && !item.redirect.url;
  }

  private isFormHasSpecElements(item) {
    return item.type === 'rating' || item.type === 'dd' || item.type === 'variants';
  }

  private isFormHasSendIfAction(item) {
    return (item.type === 'rating' && item.sendFormIfAction) ||
      (item.type === 'dd' && item.sendFormIfAction) ||
      (item.type === 'variants' && item.sendFormIfAction);
  }

  private isFormHasButtonWithAction(item) {
    return item.type === 'button' && (item.redirect.type.type === 0 || item.redirect.type.type === 1);
  }

  private isFieldIdUnique(id) {
    return id !== 'email' && id !== 'name' && id !== 'message' && id !== 'phone' && this.formExtIdsCached.indexOf(id) === -1;
  }


  private runValidators() {
    let errorsList = [];
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    return errorsList;
  }

  private hexToRgb(r, t) {
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

  public removeElementFromElementsList(index: number, elem?: Record<string, string>) {
    if (elem) {
      if (elem.name === 'form-element' || elem.name === 'button-element') {
        this.widget.guiprops.form.enable = false;
        this.widget.guiprops.button.enable = false;
      }
      if (elem.name === 'form-ext-element') {
        this.widget.guiprops.formExt.enable = false;
        this.widget.guiprops.formExt.model.list = [];
      }
    }
    this.widget.guiprops.elementsList = this.widget.guiprops.elementsList.filter((element, i) => i !== index);
  }

  public setBtnStyle(type: string, item: Record<string, string | number>): void {
    if (type === 'Default') {
      item.styleType = 'Default';
      item.borderRadiusBtn = 0;
    } else if (type === 'Material') {
      item.styleType = 'Material';
      item.borderRadiusBtn = 2;
    } else if (type === 'Flat') {
      item.styleType = 'Flat';
      item.borderRadiusBtn = 3;
    } else if (type === 'Border Style') {
      item.styleType = 'Border Style';
      item.borderRadiusBtn = 0;
    }
  }

  private showPaymentDialog(siteId, description) {
    /*window.siteTariffModal.find('h5.paymentSubscription').html(description);
    window.siteTariffModal.find('span.site-name').html($scope.siteName);
    window.siteTariffModal.attr('data-id', siteId);
    loadPlans();*/
  }


  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

