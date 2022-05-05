import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { FlowDirective } from '@flowjs/ngx-flow';
import { IMAGE_DEF } from '../../../../configs/urls';
import { Coupon } from '../../../../core/models/coupons';
import { FullWidget, Image, Images, WidgetType, WidgetTypeCode } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetConstructorService } from '../../services/widget-constructor.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['../../shared/shared.scss', './constructor-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('right', style({ transform: 'translateX(-50%)' })),
      state('left', style({ transform: 'translateX(0%)' })),
      transition('right => left', animate(300)),
      transition('left => right', animate(300))
    ])
  ]
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('flowBasic') public flow: FlowDirective;
  @Input() public sid: string;
  @Input() public wid: string;
  @Input() public isPayment: boolean;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public isContainerized: boolean;
  @Input() public showErrors: boolean;
  public isLoading = false;
  public extendedElement: Record<string, any> = null;
  public extendedIndex: number = null;
  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false,
    showSelectionBar: true
  };
  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };
  public placePopup = [
    'Верхний левый угол',
    'Сверху по центру',
    'Верхний правый угол',
    'Слева по центру',
    'По центру окна браузера',
    'Справа по центру',
    'Нижний левый угол',
    'Снизу по центру',
    'Нижний правый угол'
  ];
  public placeDh = ['', '', '', '', '', '', 'Левый нижний угол', '', 'Правый нижний угол'];
  public placeLabel = ['', '', '', 'Левая сторона браузера', '', 'Правая сторона браузера', 'Нижний левый угол', '', 'Нижний правый угол'];
  public staticWidgetAlign = ['', '', '', 'По левому краю', 'По центру', 'По правому краю', '', '', ''];
  public vertOrientDh = ['', 'От верхней границы', '', '', 'По центру виджета', '', '', 'От нижней границы', ''];
  public bgPositionTypesList = ['Растянуть', 'Замостить'];
  public tilesList = ['Замостить по X', 'Замостить по Y', 'Замостить по X+Y'];
  public maskTypeList = ['Вся площадь виджета', 'Только под контентом'];
  public placeImg = [null, 'Сверху', null, 'Слева', '', 'Справа', null, 'Снизу', null];
  public imageItemsType = ['Растянуть по ширине и высоте блока', 'Установить произвольные габариты'];
  public imageItemsAlign = ['По центру', 'По верхнему краю', 'По нижнему краю'];
  public orientInputForm = ['Вертикальная', 'Горизонтальная'];
  public visualInputForm = ['Под контентом', 'На всю ширину'];
  public widthHrType = ['От края до края', 'Собственная'];
  public floatBtn = ['Слева', 'По центру', 'Справа'];
  public widthBtn = ['Авто', 'От края до края', 'Собственная'];
  public widgwidthBtn = ['Авто', 'Собственная'];
  public typeClass = ['1', '2', '3', '4', '5', '6'];
  public widthContentStyle = '';
  public heightContentStyle = '';
  public bgStyle = '';
  public widthImageStyle = '';
  public heightImageStyle = '';
  public staticWidgetInstallCode = '';
  public currentElement = 'settings';
  public currentIndex = 0;
  public widgetType: WidgetTypeCode;
  public isThankShow = false;
  public addElemFromWidget = false;
  public systemFonts = [];
  public controls: Record<string, any>;
  public globalCouponObject: object;
  public currentPage = 'main';
  public currentDevice: 'desktop' | 'mobile' = 'desktop';
  @Input() private currentActiveTab: string;
  @Input() private SP_widget: any;
  @Input() private isTabHasErrorForFormExt: () => boolean;
  @Input() private validateFormExtElements: () => string;
  @Input() private mapFormExtFieldId: () => any;
  @Input() private isFieldIdUnique: (id: any) => boolean;
  @Input() private isButtonRedirectAndEmpty: (item: any) => boolean;
  @Input() private isFormHasSpecElements: (item: any) => boolean;
  @Input() private isFormHasSendIfAction: (item: any) => boolean;
  @Input() private isFormHasButtonWithAction: (item: any) => boolean;
  private typeImg = ['От края до края', 'От другого края'];
  private sizeSocBtn = ['Большой', 'Средний', 'Маленький'];
  private imageCustom = null;
  private linkImage = '';
  private nameImage = '';
  private blocks = [];
  private linkDetectArr = [];

  private autoUploadSub: SubscriptionLike;
  private imagesSub: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngAfterViewInit(): void {
    this.autoUploadSub = this.flow?.events$.subscribe(event => {
      if (event.type === 'filesSubmitted' && event?.event[0][0]) {
        if (event.event[0][0].file.size > 2000000) {
          this.toastr.error('Размер слишком большой', 'Ошибка!');
        } else {
          if (event.event[0][0].file.type !== 'image/jpeg' && event.event[0][0].file.type !== 'image/png' && event.event[0][0].file.type !== 'image/gif') {
            this.toastr.error('Допустимые форматы .png, .jpg и .gif', 'Ошибка!');
          } else {
            this.isLoading = true;
            this.widgetConstructorService.uploadImage(this.sid, event.event[0][0]).subscribe(() => {
              if (this.imagesSub) {
                this.imagesSub.unsubscribe();
              }
              this.getImages(this.sid);
            });
          }
        }
      }
    });

    this.initLabelMainPicker();

    $(this.controls.newModal as any).on('hidden.bs.modal', (e)=> e.currentTarget.remove());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.widget && !changes.widget.isFirstChange()) {
      ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });

      this.widgetType = this.widgetService.getCurrentWidgetsTypes().find((item: WidgetType) => item.id === this.widget.type).code;
      this.staticWidgetInstallCode =
        this.isContainerized ? this.containerizedWidgetService.getContainerInstallCode(this.widget.containerId) : '';
      this.isThankShow = this.isThankShouldShow();
      setTimeout(() => {
        this.changeModel();
        this.checkChanges();
        this.changeColorPodAndSRC();
        this.loadListener();
      }, 0);
    }
  }

  ngOnInit(): void {
    this.systemFonts = this.widgetConstructorService.getSystemFontList();

    setInterval(() => {
      this.widgetConstructorService.updateWidget.next();
    }, 200);

    this.widgetService.addValidator(this.validator);

    this.downUpInit();

    this.controls = {
      newModal: $('#addNewWidgetListModal'),
      newElementModal: $('#addNewElementListModal')
    };

    $(this.controls.newElementModal).on('hide.bs.modal', (e) => {
      $('body').removeClass('modal-open-h100');
    });

    $('.widget-style-menu .panel-group').scroll(() => {
      this.downUpInit();
    });

    $(window).resize(() => {
      this.downUpInit();
      this.downUpInitAir();
    });

    $(window).resize(this.getHeightBlock);
    this.getHeightBlock();

    // Init video BG
    if (this.widget.guiprops?.bg.video && (this.widget.guiprops?.bg.fillorImg === 'useVideo') && this.widget.guiprops?.bg.video.videoId) {
      this.newVideoSize(this.widget.guiprops.bg.video);
    }

    if (this.widget.guiprops.image.enable && this.widget.guiprops.image.typeBl && (this.widget.guiprops.image.typeBl === 'videoBl')) {
      this.newVideoSize(this.widget.guiprops.image.videoUrl);
    }

    $('[data-detect]').each((index) => {
      this.linkDetectArr[index] = $(this).data('detect');
    });

    $('#accordion').scroll(this.anchorsDetector);

    $('.nav-drop-men li').each(() => {
      const href = $(this).find('a').attr('href').replace('#', '').trim();

      if (href.length > 0) {
        const anchor = $('div#' + href);
        if ((anchor as any).size() > 0) {
          this.blocks[this.blocks.length] = anchor.eq(0);
        }
      }
    });

    $('#removeWidgetName').click(function(e) {
      e.preventDefault();
      $('#widgetNameInp').val('');
      $(this).addClass('hide');
    });

    $('#widgetNameInp').on('input', function() {
      const widgetInput = $(this).val();
      const widgetNameBtnDel = $('#removeWidgetName');
      if (widgetInput === '') {
        widgetNameBtnDel.addClass('hide');
      } else {
        widgetNameBtnDel.removeClass('hide');
      }
    });

    $('[data-widget]').click((e) => {
      e.preventDefault();
      const link = '#' + $(this).data('widget');
      $('.widget-select-mode span').removeClass('active');
      $(this).addClass('active');

      $('.block-widget-show.active').addClass('hide').removeClass('active');
      $(link).toggleClass('hide').addClass('active');
    });

    this.globalCouponObject = {
      name: 'coupon-element',
      coupon: this.coupons.length ? this.coupons[0] : { id: null, name: 'Какой купон хотите использовать?' },
      font: this.systemFonts[0],
      fontType: 'systemFont',
      fontName: '',
      fontSize: 18,
      colorText: '#262626',
      color: '#BEBECC',
      opacity: '1',
      borderRadius: 5,
      rgbaColor: (this.widgetConstructorService.hexToRgb('#BEBECC', 1)).toString(),
      hoverText: 'Скопировать',
      clickText: 'Скопировано',
      actionText: 'Кликните, чтобы скопировать ваш купон на скидку',
      manualText: 'Вы можете использовать данный купон при оформлении заказа',
      width_type: this.widthBtn[1],
      widthpx: 100,
      counter: 0,
      position: this.floatBtn[1],
      positionPopup: this.placePopup[0],
      closeAfter: false,
      isCopyAction: false,
      title: {
        enable: false,
        textSummer: '<p>Вы можете редактировать этот текст. Если вы хотите<br>изменить цвет, позиционирование или стиль текста,<br>то выделите фрагмент для появления окна редактора.<br>Размер и шрифт изменяются слева в блоке настроек элемента.</p>',
        font: this.systemFonts[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 12,
        textShadow: {
          enable: false,
          color: '#262626',
          opacity: '1',
          rgbaColor: (this.widgetConstructorService.hexToRgb('#262626', 1)).toString(),
          horiz: 0,
          vertical: 0,
          blur: 0
        }
      }
    };

    this.loadListener();
  }

  // TODO: leave selectIcon or selectedIcon, no need 2 props
  public onLabelIconPickerSelect(newIcon) {
    this.widget.guiprops.labelMain.icon.selectIcon = newIcon;
    this.widget.guiprops.labelMain.icon.selectedIcon = newIcon;
  }

  public onDotIconPickerSelect(newIcon) {
    this.widget.guiprops.dhVisual.selectIcon = newIcon;
    this.widget.guiprops.dhVisual.selectedIcon = newIcon;
  }

  public removeElementFromFormExtList(event, index) {
    event.stopPropagation();
    this.widget.guiprops.formExt.model.list = this.widgetConstructorService.removeFromArray(this.widget.guiprops.formExt.model.list, index);
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
    this.backToRegularElement();
  }

  public setExtended(event: { element: Record<string, any>, index: number }): void {
    this.extendedElement = event.element;
    this.extendedIndex = event.index;
  }

  public isElementHasError(elementName: string, elementCounter: number) {
    this.mapFormExtFieldId();
    const errors = this.validator();
    for (const item of errors) {
      if ((typeof item !== 'undefined') &&
        (((item.element === elementName) && (item.counter === elementCounter)) || (!item.counter && item.element === elementName))
      ) {
        return true;
      }
    }

    return false;
  }

  public addNewElementToContent(item?) {
    if (typeof item !== 'undefined') {
      this.addElemFromWidget = item;
    } else {
      this.addElemFromWidget = false;
    }

    (this.controls.newElementModal as any).appendTo('body').modal('show');
    $('body').addClass('modal-open-h100');
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

  public listFile(place, item?) {
    this.linkImage = '';
    if (place === 'image') {
      this.imageCustom = item;
    } else if (place === 'imageSingle') {
      this.imageCustom = 'imageSingle';
    } else if (place === 'dotIcon') {
      this.imageCustom = 'dotIcon';
    } else if (place === 'labelIcon') {
      this.imageCustom = 'labelIcon';
    } else {
      this.imageCustom = false;
    }

    this.getImages(this.sid);

    (this.controls.newModal as any).appendTo('body').modal('show');
    $('body').addClass('modal-open-h100');
  }

  public isDefault(url: string): boolean {
    return url === IMAGE_DEF;
  }

  public removeImage(isDot: boolean): void {
    if (isDot) {
      this.widget.guiprops.dhVisual.url = IMAGE_DEF;
    } else {
      this.widget.guiprops.labelMain.url = IMAGE_DEF;
    }
  }

  public isThankShouldShow() {
    if (!this.widget.guiprops) {
      return;
    }

    return (this.widget.guiprops.form?.enable && !this.widget.guiprops.formSet?.redirect.enable) ||
      (this.widget.guiprops?.formExt?.enable &&
        this.widgetConstructorService.isFormHasCurrentTypeOfActions(this.widget.guiprops.formExt.model.list, 0));
  }

  public scrollToEl(id: string, elementName: string, elementCounter?: number) {
    if (this.currentElement === 'form-ext-element' && elementName === 'form-ext-element') {
      return;
    }

    this.backToRegularElement();

    if ([
      'button-element',
      'closelink-element',
      'coupon-element',
      'form-element',
      'iframe-element',
      'image-element',
      'padding-element',
      'social-element',
      'split-element',
      'title-element',
      'video-element',
      'timer-element',
      'form-ext-element',
    ].includes(elementName)) {
      this.currentElement = elementName + (elementCounter ? ('#' + elementCounter) : '');
    } else {
      this.currentElement = 'settings';
      const accordion = $('#accordion');
      const accordionIn = $('#accordionIn');
      const target = $('#elemScrN' + id);

      const scrollTo = (target.offset().top) - (accordionIn.offset().top) - 40;
      if (((target.offset().top - accordion.offset().top - 42) <= 10) && ((target.offset().top - accordion.offset().top - 42) >= -10)) {
        return;
      }

      accordion.animate({ scrollTop: scrollTo }, 500, 'swing', () => {
      });
      target.addClass('border-active-element');
      setTimeout(() => {
        target.removeClass('border-active-element');
      }, 1500);
    }

    if (elementName === 'title-element' || elementName === 'form-element' || elementName === 'button-element' || elementName === 'closelink-element') {
      this.downUpInitAir();
    }
  }

  public wvBdLeft() {
    return this.widgetConstructorService.wvBdLeft(this.widget.guiprops.dhVisual);
  }

  public wvLabelPos() {
    return this.widgetConstructorService.wvLabelPos(this.widget.guiprops.labelMain);
  }

  public removeCurrentElement(element: string, index: number): void {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');

    if (element) {
      if (element === 'form-element' || element === 'button-element') {
        this.widget.guiprops.form.enable = false;
        this.widget.guiprops.button.enable = false;
      }
      if (element === 'form-ext-element') {
        this.widget.guiprops.formExt.enable = false;
        this.widget.guiprops.formExt.model.list = [];
      }
    }
    this.widget.guiprops.elementsList = this.widget.guiprops.elementsList.filter((_, i) => i !== index);

    if (index <= this.currentIndex) {
      this.currentElement = 'settings';
      this.currentIndex = 0;
    }
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

  public buildIframeElement(item, index: number, rebuild: boolean): void {
    setTimeout(() => {
      const elementToRemove = document.getElementById('idFrame' + item.counter);
      const oldIndex = elementToRemove.getAttribute('index');

      const iframeBlock = document.getElementById('elementIframeBlock' + item.counter);

      if (!iframeBlock || (+oldIndex === index && !rebuild)) {
        return;
      }

      const ifrm = document.createElement('iframe');
      ifrm.setAttribute('src', 'about:blank');
      ifrm.setAttribute('frameBorder', '0');
      ifrm.setAttribute('id', 'idFrame' + item.counter);
      ifrm.setAttribute('style', 'position:relative!important;width:100%!important;height:100%!important;border:none!important');
      ifrm.setAttribute('index', index.toString());

      iframeBlock.replaceChild(ifrm, elementToRemove);

      const doc = ifrm.contentWindow.document;
      doc.open().write('<body>' + '<style>body{margin:0!important;}' + item.css_value + '</style>' + item.html_value + '</body>');
      doc.close();
    }, 0);
  }

  public getVideoId(item) {
    console.log(item);
    if (!item.videoUrl) {
      item.videoUrl = 'https://';
    }

    let result = '';
    if (item.videoType === 'youtube') {
      const regYExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      const match = item.videoUrl.match(regYExp);
      result = match ? match[7] : false;
      if (result) {
        item.videoPreview = 'https://img.youtube.com/vi/' + result + '/hqdefault.jpg';
        result = result +
          '?controls=0&iv_load_policy=3&showinfo=0&rel=0&autoplay=1&loop=1&mute=1&modestbranding=1&disablekb=1&playlist=' + result;
        item.videoUrl = 'https://www.youtube.com/embed/' + result;
      } else {
        item.videoUrl = 'https://www.youtube.com/embed/FFu-JFifX28';
      }
    } else {
      const regVExp = /^.+vimeo.com\/(.*\/)?([^#\?]*)/;
      const parseUrl = item.videoUrl.match(regVExp);
      result = (parseUrl && parseUrl[2].length === 9) ? parseUrl[2] : '207763253';
      result += '';

      if (!result) {
        result = '207763253';
      }
      if (result) {
        if (item.isVideoBG) {
          item.videoPreview = 'https://i.vimeocdn.com/video/' + result + '.png';
          result = result + '?background=1';
        }
        item.videoUrl = 'https://player.vimeo.com/video/' + result;
      }
    }

    item.videoId = result;
    this.newVideoSize(item);
  }

  public newVideoSize(item, rebuild?: boolean) {
    setTimeout(() => {
      if (item.typeBl) {
        $('#idImageVideoFrame').attr('src', item.videoUrl);
      } else if (item.counter) {
        const videoBlock = document.getElementById('idVideoFrame' + item.counter);
        if (!videoBlock || (videoBlock.getAttribute('src') && !rebuild)) {
          return;
        }
        videoBlock.setAttribute('src', item.videoUrl);
      } else if (item.isVideoBG) {
        $('#idBgVideoFrame').attr('src', item.videoUrl);
        $('#idBgVideoFrameThank').attr('src', item.videoUrl);
      }

      if (item.width_type) {
        if (item.width_type === 'От края до края') {
          $('#idVideoFrame' + item.counter).css({ width: '100%' });
        } else {
          $('#idVideoFrame' + item.counter).css({ width: (item.widthpx + 'px') });
        }
        $('#idVideoFrame' + item.counter).css({ height: ($('#idVideoFrame' + item.counter).innerWidth() / 1.666) + 'px' });
      }
    }, 0);
  }

  public changePosition(position: string): void {
    if (this.widgetType === 'popup') {
      this.widget.guiprops.popupMain.place = position;
    } else if (this.widgetType === 'optindot') {
      this.widget.guiprops.dhVisual.place = position;
    } else if (this.widgetType === 'label_widget') {
      this.widget.guiprops.labelMain.place = position;
    } else {
      this.widget.guiprops.staticMain.position = position;
    }
  }

  public getElementByName(name: string): string {
    switch (name) {
      case 'button-element':
        return 'Кнопка';
      case 'closelink-element':
        return 'Кнопка закрытия';
      case 'coupon-element':
        return 'Купон';
      case 'form-element':
        return 'Форма и кнопки';
      case 'iframe-element':
        return 'HTML / JS / Iframe';
      case 'image-element':
        return 'Картинка';
      case 'padding-element':
        return 'Отступ';
      case 'social-element':
        return 'Соц. кнопки';
      case 'split-element':
        return 'Разделитель';
      case 'title-element':
        return 'Текст';
      case 'video-element':
        return 'Видео';
      case 'timer-element':
        return 'Обратный отсчёт';
      case 'form-ext-element':
        return 'Форма и кнопки';
    }
  }

  public addElementModalHide() {
    (this.controls.newElementModal as any).modal('hide');
    $('body').removeClass('modal-open-h100');
  }

  public disElementOrNotBtnCloseLink() {
    if (!this.widget.guiprops) {
      return;
    }

    if (this.widgetType === WidgetTypeCode.Optindot) {
      return true;
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

  public showLastElement(): void {
    this.checkChanges();
    const currentElement = this.widget.guiprops.elementsList[this.widget.guiprops.elementsList.length - 1];
    this.currentElement = currentElement.name + (currentElement.counter ? ('#' + currentElement.counter) : '');
    this.currentIndex = this.widget.guiprops.elementsList.length - 1;
  }

  public setCurrentElement(elementName: string): void {
    $('.widget-style-menu .panel-group')[0].scrollTop = 0;
    this.backToRegularElement();
    this.currentElement = elementName;
  }

  public updateIndex(index: number): void {
    this.currentIndex = index;
  }

  public backToRegularElement(): void {
    this.extendedElement = null;
    this.extendedIndex = null;
  }

  private initLabelMainPicker() {
    setTimeout(() => {
      ($('#fontPickerLabelMain') as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.target.value, this.widget.guiprops.labelMain.font);
      });

      $('#fontPickerLabelMain').trigger('setFont', this.widget.guiprops.labelMain.font.name);
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

  private anchorsDetector() {
    this.blocks.forEach(item => {
      if (item.position().top <= 0) {
        const id = item.attr('id');
        $('#menu-select').text(this.linkDetectArr[id]);
      }
    });
  }

  private getHeightBlock() {
    const mainBlock = document.getElementById('widgetStyle');
    if (!mainBlock) {
      return;
    }

    mainBlock.style.height = $(window).height() - 70 + 'px';
  }

  private validator() {
    const errors = [];
    const TAB_ID = 'design';

    if (typeof this.widget.guiprops === 'undefined') {
      return;
    }

    this.widget.guiprops.elementsList.forEach(el => {
      if (el.name === 'coupon-element' && !el.coupon.id) {
        errors.push({
          id: TAB_ID,
          element: el.name,
          counter: el.counter,
          message: 'No coupon'
        });
      }

      if (el.name === 'form-ext-element' && this.isTabHasErrorForFormExt()) {
        errors.push({
          id: TAB_ID,
          element: el.name,
          counter: el.counter,
          message: 'No action for form-ext'
        });
      }

      if (this.widget.guiprops.formSet.redirect.enable && !this.widget.guiprops.formSet.redirect.url.trim()) {
        errors.push({
          id: TAB_ID,
          element: 'settings',
          message: 'Укажите URL страницы перенаправления'
        });
      }

      const formExtValidation = this.validateFormExtElements();

      if (el.name === 'form-ext-element' && formExtValidation) {
        errors.push({
          id: TAB_ID,
          element: el.name,
          message: formExtValidation
        });
      }
    });

    return errors;
  }

  private loadListener() {
    /**
     * Def Objects
     */
    if (!this.widget) {
      this.widget = {} as FullWidget;
    }

    if (typeof this.widget?.guiprops === 'undefined') {
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
        font: this.systemFonts?.[0],
        fontType: 'systemFont',
        fontName: '',
        fontSize: 22,
      };
    }

    if (typeof this.widget.guiprops.exit === 'undefined') {
      this.widget.guiprops.exit = {
        enable: false,
        textSummer: '<span>Закрыть окно (выделите, что бы редактировать)</span>',
        font: this.systemFonts?.[0],
        fontType: 'systemFont',
        fontName: '',
        position: 'Слева',
        fontSize: 14,
        button: {
          enable: false,
          textSummer: '<span>Закрыть окно</span>',
          font: this.systemFonts?.[0],
          fontType: 'systemFont',
          fontName: '',
          fontSize: 20,
          colorBtn: '#000000',
          colorTextBtn: '#FFFFFF',
          borderRadiusBtn: 0,
          btn_width: this.widthBtn?.[0],
          btn_widthpx: 200,
          position: this.floatBtn?.[0],
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
        font: this.systemFonts?.[0],
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
        font: this.systemFonts?.[0],
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
        font: this.systemFonts?.[0],
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
      this.widget.guiprops.exit.position = this.floatBtn[1];
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
          rgbaColor: (this.widgetConstructorService.hexToRgb('#000000', 0.3)).toString(),
          horiz: 0,
          vertical: 1,
          blur: 5
        },
        mask: {
          enable: false,
          area: this.maskTypeList[0],
          color: '#000000',
          rgbaColor: (this.widgetConstructorService.hexToRgb('#000000', 1)).toString(),
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
        rgbaColor: (this.widgetConstructorService.hexToRgb('#000000', 0.3)).toString(),
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
        rgbaColor: (this.widgetConstructorService.hexToRgb('#000000', 1)).toString(),
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

    if (typeof this.widget.guiprops.social.type === 'undefined') {
      this.widget.guiprops.social.type = 'style-2';
    }

    if (typeof this.widget.guiprops.social.linkForShare === 'undefined') {
      this.widget.guiprops.social.linkForShare = 'site';
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
          mainSettings: this.widgetConstructorService.getDefaultFormExtMainSettings()
        },
        couponCallback: {
          enable: false,
          elementType: 'form',
          coupon: { ...this.globalCouponObject }
        }
      };
      setTimeout(() => {
        if (!this.widget.guiprops.formExt) {
          return;
        }

        this.widget.guiprops.formExt.model.mainSettings = this.widgetConstructorService.getDefaultFormExtMainSettings();
      }, 50);
    }
  }

  private changeModel() {
    const mainBlockW = $('.widget-image');
    const mainBl = $('#mainBlockWidget');
    const mainBlWr = $('#widgetMainWr');
    const maskTop = $('#widgetMaskTop');
    const gap18 = '-18px';
    const gap3 = '-3px';

    // another rebuild has already implemented
    /*mainBlockW.addClass('hide-image-bl-for-rebuild');
    setTimeout(() => {
      mainBlockW.removeClass('hide-image-bl-for-rebuild');
    }, 300);*/



    if (((this.widget.guiprops.image.place === 'Слева') || (this.widget.guiprops.image.place === 'Справа'))) {
      if (this.widget.guiprops.image.img_width === 'Собственная') {
        const newWidth = (+this.widget.guiprops.image.img_widthpx).toString();
        this.widthImageStyle = newWidth + 'px';
      } else {
        this.widthImageStyle = '33%';
      }
    }

    if (((this.widget.guiprops.image.place === 'Сверху') || (this.widget.guiprops.image.place === 'Снизу'))) {
      if (this.widget.guiprops.image.img_height === 'Собственная') {
        const newHeight = (+this.widget.guiprops.image.img_heightpx).toString();
        this.heightImageStyle = newHeight + 'px';
      } else {
        this.heightImageStyle = '150px';
      }
    }

    if (this.currentActiveTab === 'design') {
      setTimeout(() => {
        if (!$('#thankWidget').hasClass('active')) {
          if (this.widget.guiprops.image.enable) {
            // Под контентом Слева или Справа
            if (this.widgetConstructorService.ruleLeftOrRightUnderContent(
              this.widget.guiprops.formExt,
              this.widget.guiprops.form.visual,
              this.widget.guiprops.image.place
            )) {
              $('#colorFormPod').css({ 'z-index': '0' });
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_width === 'Собственная') {
                let imageWidgetWidthPod;
                setTimeout(() => {
                  $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
                  mainBlockW.css({ width: this.widthImageStyle, height: '100%' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({
                      'margin-left': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-right': 0
                    });
                    $('#colorFormPod').css({
                      width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px',
                      left: 'auto',
                      right: '0'
                    });
                    maskTop.css({ left: gap3, right: gap18 });
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    imageWidgetWidthPod = (mainBlockW.innerWidth() - 10);
                    $('.widget-main-img-right').css({
                      'margin-right': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-left': 0
                    });
                    $('#colorFormPod').css({
                      width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px',
                      left: '0'
                    });
                    maskTop.css({ left: gap18, right: gap3 });
                  }, 200);
                }
              }
              //// Размер АВТО
              else {
                let imageWidgetWidthPod;
                setTimeout(() => {
                  imageWidgetWidthPod = (mainBlWr.innerWidth() + 60) / 2;
                  $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
                  mainBlockW.css({ width: imageWidgetWidthPod + 'px' });
                  mainBlockW.css({ height: '100%' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({
                      'margin-left': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-right': 0
                    });
                    $('#colorFormPod').css({
                      width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px',
                      left: 'auto',
                      right: '0'
                    });
                    maskTop.css({ left: gap3, right: gap18 });
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({
                      'margin-right': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-left': 0
                    });
                    $('#colorFormPod').css({
                      width: (mainBl.innerWidth() - mainBlockW.innerWidth()) + 'px',
                      left: '0',
                      right: 'auto'
                    });
                    maskTop.css({ left: gap18, right: gap3 });
                  }, 200);
                }
              }
            }

            // Картинка сверху или снизу
            if (((this.widget.guiprops.image.place === 'Сверху') || (this.widget.guiprops.image.place === 'Снизу'))) {
              $('#colorFormPod').css({ 'z-index': '0' });
              $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
              maskTop.css({ left: gap18, right: gap18 });
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_height === 'Собственная') {
                setTimeout(() => {
                  mainBlockW.css({ height: this.heightImageStyle });
                  $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
                  mainBlockW.css({ width: '100%' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Сверху') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({
                      'margin-left': 0,
                      'margin-right': 0,
                      'margin-top': mainBlockW.innerHeight() + 'px',
                      'margin-bottom': 0
                    });
                    $('.widget-main-img-bottom').css({ 'margin-left': 0, 'margin-right': 0 });
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Снизу') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({ 'margin-left': 0, 'margin-right': 0 });
                    $('.widget-main-img-bottom').css({
                      'margin-left': 0,
                      'margin-right': 0,
                      'margin-bottom': mainBlockW.innerHeight() - 1 + 'px',
                      'margin-top': 0
                    });
                  }, 200);
                }
              }
              //// Размер АВТО
              else {
                let imageHeightWidthPod;
                setTimeout(() => {
                  imageHeightWidthPod = mainBlWr.innerHeight() / 3;
                  $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
                  mainBlockW.css({ height: imageHeightWidthPod, width: '100%' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Сверху') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({
                      'margin-left': 0,
                      'margin-right': 0,
                      'margin-top': mainBlockW.innerHeight() + 'px',
                      'margin-bottom': 0
                    });
                    $('.widget-main-img-bottom').css({ 'margin-left': 0, 'margin-right': 0 });
                  }, 200);
                }

                if (this.widget.guiprops.image.place === 'Снизу') {
                  setTimeout(() => {
                    $('.widget-main-img-top').css({ 'margin-left': 0, 'margin-right': 0 });
                    $('.widget-main-img-bottom').css({
                      'margin-left': 0,
                      'margin-right': 0,
                      'margin-bottom': mainBlockW.innerHeight() + 'px',
                      'margin-top': 0
                    });
                  }, 200);
                }
              }
            }

            // На ВСЮ ШИРИНУ СЛЕВА или СПРАВА
            if (this.widgetConstructorService.ruleLeftOrRightWholeWidth(
              this.widget.guiprops.formExt, this.widget.guiprops.form.visual, this.widget.guiprops.image.place
            )) {
              setTimeout(() => {
                $('#colorFormPod').css({ 'z-index': '2' });
                $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
              }, 220);
              // Размер ЗАДАН
              if (this.widget.guiprops.image.img_width === 'Собственная') {
                let mainBlHeight;
                setTimeout(() => {
                  mainBlockW.css({ width: this.widthImageStyle });
                  mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                  if (this.widget.guiprops.bg.border.enable) {
                    mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                  }
                  mainBlockW.css({ height: mainBlHeight + 'px' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('#colorFormPod').innerWidth();
                    $('.widget-main-img-left').css({
                      'margin-left': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-right': 0
                    });
                    $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
                    $('.extraClassFullWidth')
                      .css({
                        'margin-left': -mainBlockW.innerWidth() + 'px',
                        width: $('#colorFormPod').innerWidth() - 95 + 'px',
                        'margin-right': 0
                      });

                    maskTop.css({ left: gap3, right: gap18 });
                  }, 200);
                  setTimeout(() => {
                    mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({ height: mainBlHeight + 'px' });
                  }, 210);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({
                      'margin-right': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-left': 0
                    });
                    $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
                    $('.extraClassFullWidth')
                      .css({
                        'margin-right': -mainBlockW.innerWidth() + 'px',
                        width: $('#colorFormPod').innerWidth() - 95 + 'px',
                        'margin-left': 0
                      });

                    maskTop.css({ left: gap18, right: gap3 });
                  }, 200);
                  setTimeout(() => {
                    mainBlHeight = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeight = mainBlHeight - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({ height: mainBlHeight + 'px' });
                  }, 210);
                }
              }
              //// Размер АВТО
              else {

                let imageWidgetWidthPod;
                let mainBlHeightAll;
                setTimeout(() => {
                  imageWidgetWidthPod = (mainBlWr.innerWidth() + 60) / 2;
                  mainBlockW.css({ width: imageWidgetWidthPod + 'px' });
                  mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                  if (this.widget.guiprops.bg.border.enable) {
                    mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                  }
                  mainBlockW.css({ height: mainBlHeightAll + 'px' });
                }, 100);

                if (this.widget.guiprops.image.place === 'Слева') {
                  setTimeout(() => {
                    $('.widget-main-img-left').css({
                      'margin-left': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-right': 0
                    });
                    $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
                    $('.extraClassFullWidth')
                      .css({
                        'margin-left': -mainBlockW.innerWidth() + 'px',
                        width: $('#colorFormPod').innerWidth() - 95 + 'px',
                        'margin-right': 0
                      });

                    maskTop.css({ left: gap3, right: gap18 });
                  }, 200);
                  setTimeout(() => {
                    mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({ height: mainBlHeightAll + 'px' });
                  }, 210);
                }

                if (this.widget.guiprops.image.place === 'Справа') {
                  setTimeout(() => {
                    $('.widget-main-img-right').css({
                      'margin-right': mainBlockW.innerWidth() - 15 + 'px',
                      'margin-left': 0
                    });
                    $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
                    $('.extraClassFullWidth')
                      .css({
                        'margin-right': -mainBlockW.innerWidth() + 'px',
                        width: $('#colorFormPod').innerWidth() - 95 + 'px',
                        'margin-left': 0
                      });

                    maskTop.css({ left: gap18, right: gap3 });
                  }, 200);
                  setTimeout(() => {
                    mainBlHeightAll = $('#colorFormPod').offset().top - mainBl.offset().top;
                    if (this.widget.guiprops.bg.border.enable) {
                      mainBlHeightAll = mainBlHeightAll - this.widget.guiprops.bg.border.thickness;
                    }
                    mainBlockW.css({ height: mainBlHeightAll + 'px' });
                  }, 210);
                }
              }
            } else {
              $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
              $('.extraClassFullWidth').css({ 'margin-left': '0', 'margin-right': '0', width: '100%' });
            }

            if ((!this.widget.guiprops.button?.enable && !this.widget.guiprops.form?.enable && !this.widget.guiprops.formExt?.enable)
              && (this.widget.guiprops.image?.place === 'Справа' || this.widget.guiprops.image?.place === 'Слева')) {

              setTimeout(() => {
                mainBlockW.css({ height: '100%' });
              }, 220);
            }

          } else {
            $('#colorFormPod').css({ width: (mainBl.innerWidth() + 60) + 'px', left: '-30px', right: 'auto' });
            $('.color-pod').css({ 'margin-left': '0', 'margin-right': '0' });
            $('.extraClassFullWidth').css({ 'margin-left': '0', 'margin-right': '0', width: '100%' });
            maskTop.css({ left: gap18, right: gap18 });

            setTimeout(() => {
              $('#widgetMainWr').css({ margin: 0 });
            }, 200);
          }


          setTimeout(() => {
            $('span.img-size').text(mainBlockW.innerWidth() + 'x' + mainBlockW.innerHeight() + ' px');
            $('span.img-size-form').text((mainBl.innerWidth()) + 'x' + mainBl.innerHeight() + ' px');

            if (this.SP_widget) {
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
            }

            if (mainBl.outerWidth()) {
              $('#thankWidget').css({ width: mainBl.outerWidth() + 'px', height: mainBl.outerHeight() + 'px' });
            }
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

    if (this.currentPage === 'thank') {
      $('#disabledFuncAct').removeClass('hide');
      $('.panel-group').addClass('non-scroll');
    } else {
      $('#disabledFuncAct').addClass('hide');
      $('.panel-group').removeClass('non-scroll');
    }
  }

  private checkChanges(): void {
    if (!this.widget.guiprops) {
      return;
    }

    if (this.widget.guiprops.formExt) {
      if (this.widget.guiprops.formExt.model.mainSettings.colorPod.enable) {
        this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod =
          (this.widgetConstructorService.hexToRgb(
            this.widget.guiprops.formExt.model.mainSettings.colorPod.color,
            this.widget.guiprops.formExt.model.mainSettings.colorPod.opacityColorPod
          )).toString();
      } else {
        this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod = 'transparent';
      }
    }

    if (this.widget.guiprops.form.colorPod.enable) {
      this.widget.guiprops.form.colorPod.rgbaColorPod =
        (this.widgetConstructorService.hexToRgb(
          this.widget.guiprops.form.colorPod.color,
          this.widget.guiprops.form.colorPod.opacityColorPod
        )).toString();
    } else {
      this.widget.guiprops.form.colorPod.rgbaColorPod = 'transparent';
    }

    if (this.widget.guiprops.form.bgInputForm && this.widget.guiprops.form.opacityBgInputForm) {
      this.widget.guiprops.form.rgbaInputForm = (this.widgetConstructorService
        .hexToRgb(this.widget.guiprops.form.bgInputForm, this.widget.guiprops.form.opacityBgInputForm)).toString();
    }

    if (this.widget.guiprops.form.enable === true) {
      this.widget.guiprops.button.enable = true;
      if (this.widget.guiprops.button.enable === true) {
        this.widget.guiprops.button.enable = true;
      }
    }

    if (this.widget.guiprops.popupMain.shadow.enable) {
      this.widget.guiprops.popupMain.shadow.rgbaColor = (this.widgetConstructorService
        .hexToRgb(this.widget.guiprops.popupMain.shadow.color, this.widget.guiprops.popupMain.shadow.opacityColor)).toString();
    } else {
      this.widget.guiprops.popupMain.shadow.rgbaColor = 'transparent';
    }

    if (this.widget.guiprops.labelMain.colorLabel != null) {
      this.widget.guiprops.labelMain.rgbaLabel = (this.widgetConstructorService
        .hexToRgb(this.widget.guiprops.labelMain.colorLabel, this.widget.guiprops.labelMain.opacityBgLabel)).toString();
    }

    if (this.widget.guiprops.dhVisual.colorBg) {
      this.widget.guiprops.dhVisual.rgbaShadowForm1 = (this.widgetConstructorService
        .hexToRgb(this.widget.guiprops.dhVisual.colorBg, 0.6)).toString();
      this.widget.guiprops.dhVisual.rgbaShadowForm2 = (this.widgetConstructorService
        .hexToRgb(this.widget.guiprops.dhVisual.colorBg, 0.8)).toString();
    }

    if (this.widget.guiprops.dhVisual.widget_content_width === 'Собственная') {
      let newWidth: string;

      if (this.widget.guiprops.image.enable && ((this.widget.guiprops.image.place === 'Слева') || (this.widget.guiprops.image.place === 'Справа'))) {
        newWidth = (+this.widget.guiprops.dhVisual.widget_content_widthpx - 45).toString();
      } else {
        newWidth = (+this.widget.guiprops.dhVisual.widget_content_widthpx - 60).toString();
      }
      this.widthContentStyle = newWidth + 'px';
    } else {
      this.widthContentStyle = 'auto';
    }

    if (this.widget.guiprops.dhVisual.widget_content_height === 'Собственная') {
      const newHeight = (+this.widget.guiprops.dhVisual.widget_content_heightpx - 60).toString();
      this.heightContentStyle = newHeight + 'px';
    } else {
      this.heightContentStyle = 'auto';
    }

    if (this.widget.guiprops.bg.fillorImg === 'useImg') {
      if (this.widget.guiprops.bg.positionType === 'Растянуть') {
        this.bgStyle = 'url(' + this.widget.guiprops.bg.url + ') center center / cover no-repeat';
      } else {
        if (this.widget.guiprops.bg.tiles === 'Замостить по X') {
          this.bgStyle = 'url(' + this.widget.guiprops.bg.url + ') center center / auto repeat-x';
        } else if (this.widget.guiprops.bg.tiles === 'Замостить по Y') {
          this.bgStyle = 'url(' + this.widget.guiprops.bg.url + ') center center / auto repeat-y';
        } else {
          this.bgStyle = 'url(' + this.widget.guiprops.bg.url + ') center center / auto repeat';
        }
      }
      this.widget.guiprops.bg.bgStyle = this.bgStyle;
    } else if (this.widget.guiprops.bg.fillorImg === 'fill') {
      this.bgStyle = this.widget.guiprops.bg.colorBg;
      this.widget.guiprops.bg.bgStyle = this.bgStyle;
    }

    if (this.widget.guiprops.bg.border) {
      if (!this.widget.guiprops.bg.border.enable) {
        this.widget.guiprops.bg.border.style = '0px solid transparent';
      } else {
        this.widget.guiprops.bg.border.style =
          this.widget.guiprops.bg.border.thickness + 'px solid ' + this.widget.guiprops.bg.border.color;
      }
    }

    if (this.widget.guiprops.bg.shadow) {
      if (!this.widget.guiprops.bg.shadow.enable) {
        this.widget.guiprops.bg.shadow.style = '0px 0px 0px 0px rgba(0,0,0,0.25)';
      } else {
        this.widget.guiprops.bg.shadow.style =
          this.widget.guiprops.bg.shadow.horiz + 'px ' + this.widget.guiprops.bg.shadow.vertical + 'px ' +
          this.widget.guiprops.bg.shadow.blur + 'px ' + this.widgetConstructorService.getRGBAColor(this.widget.guiprops.bg.shadow);
      }
    }

    if (this.widget.guiprops.bg.mask.enable) {
      this.widget.guiprops.bg.mask.rgbaColor =
        (this.widgetConstructorService.hexToRgb(this.widget.guiprops.bg.mask.color, this.widget.guiprops.bg.mask.opacity)).toString();
    } else {
      this.widget.guiprops.bg.mask.rgbaColor = 'transparent';
    }

    if (this.widget.guiprops.form.enable) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.widget.guiprops.formSet.items.length; i++) {
        if (this.widget.guiprops.formSet.items[i].type === 'message' || this.widget.guiprops.formSet.items[i].type === 'phone') {
          this.widget.sendCrm = true;
          if (this.widget.sendCrm === true) {
            this.widget.sendCrm = true;
          }
        }
        if (!this.widget.sendCrm) {
          this.widget.sendCrm = false;
          if (this.widget.sendCrm === false) {
            this.widget.sendCrm = false;
          }
        }
      }
    }

    if (this.widget.guiprops.formExt) {
      if (this.widget.guiprops.formExt.enable) {
        this.widget.guiprops.formExt.model.list.forEach((item) => {
          if (this.widgetConstructorService.isFormHasInputs(item)) {
            this.widget.sendCrm = true;
            if (this.widget.sendCrm === true) {
              this.widget.sendCrm = true;
            }
          }
          if (!this.widget.sendCrm) {
            this.widget.sendCrm = false;
            if (this.widget.sendCrm === false) {
              this.widget.sendCrm = false;
            }
          }
        });
      }
    }

    const labelContent = $('.lab-content');
    const labelElementWithText = $('.label-text-with-add');

    if (this.widget.guiprops.labelMain.iconOrImage === 'useImg') {
      let imageSize;
      let margTopValue;

      if (labelElementWithText.height() >= 24) {
        imageSize = labelElementWithText.height() + 2;
        margTopValue = (imageSize / 2) + 1;
      } else {
        imageSize = 25;
        margTopValue = 14;
      }

      $('.lgiconfontImg').css({
        width: imageSize + 'px',
        height: imageSize + 'px',
        'margin-top': -margTopValue + 'px'
      });
      labelContent.css({ 'padding-left': (imageSize + 10) + 'px' });

      this.widget.guiprops.labelMain.imgWidth = imageSize;
      this.widget.guiprops.labelMain.imgMargTop = margTopValue;
    } else {
      labelContent.css({ 'padding-left': '' });
    }

    let counterNewText = 0;
    let counterNewImage = 0;
    let counterNewVideo = 0;
    let counterNewPadding = 0;
    let counterNewSplit = 0;
    let counterNewIframe = 0;
    let counterNewCoupon = 0;
    let counterNewTimer = 0;

    this.widget.guiprops.elementsList.forEach((item, index) => {
      if (item.name) {
        if (item.name === 'title-element') {
          counterNewText++;
          item.counter = counterNewText;
        }

        if (item.name === 'image-element') {
          counterNewImage++;
          item.counter = counterNewImage;
        }

        if (item.name === 'iframe-element') {
          counterNewIframe++;
          item.counter = counterNewIframe;
        }

        if (item.name === 'video-element') {
          counterNewVideo++;
          item.counter = counterNewVideo;
        }

        if (item.name === 'padding-element') {
          counterNewPadding++;
          item.counter = counterNewPadding;
        }

        if (item.name === 'split-element') {
          counterNewSplit++;
          item.counter = counterNewSplit;
        }

        if (item.name === 'coupon-element') {
          counterNewCoupon++;
          item.counter = counterNewCoupon;
        }

        if (item.name === 'timer-element') {
          counterNewTimer++;
          item.counter = counterNewTimer;
        }

        if (item.name === 'iframe-element') {
          this.buildIframeElement(item, index, false);
        }

        if (item.name === 'video-element') {
          this.newVideoSize(item, false);
        }
      }
    });
  }

  private getImages(sid: string): void {
    this.imagesSub = this.widgetConstructorService.getImages(sid).subscribe((data: Images) => {
      this.fillListImage(data.images);
    });
  }

  private fillListImage(images: Image[]) {
    if (images.length === 0) {
      $('#addNewWidgetListModal .modal-body').find('h4').html('У вас еще нет загруженных изображений');
    } else {
      $('#addNewWidgetListModal .modal-body').find('h4').html('Загруженные изображения');
    }

    $('#listImagesBlock').html('');
    for (const item of images) {
      const link = item.link.replace('imaginarium', 'imaginarium');
      const name = item.filename;
      $('#listImagesBlock').append('<div class="imageGlItem" data-link="' + link + '" data-id="' + name + '"><div class="imageGlItemIn"><div class="imageItem" style="background: url(' + link + ') center no-repeat; background-size:cover"></div></div><div class="delete-cur-img-btn" data-del="' + name + '"><span></span></div></div>');
    }

    this.isLoading = false;

    const scope = this;

    $('.imageGlItemIn').on('click', function() {
      $('.imageGlItemIn').each(function() {
        $(this).removeClass('active');
      });
      scope.nameImage = $(this).parent('.imageGlItem').data('id');
      scope.linkImage = $(this).parent('.imageGlItem').data('link');
      $(this).addClass('active');
    });

    $('.imageGlItem').on('dblclick', () => {
      this.updateFileDB();
    });

    $('.delete-cur-img-btn').on('click', function() {
      const delUrl = $(this).parent('.imageGlItem').data('link');
      scope.nameImage = $(this).data('del');

      if (delUrl === scope.widget.guiprops.image.url) {
        if (scope.widget.guiprops.image.enable === true) {
          scope.toastr.error('Это изображение установлено в виджете. Выберите другое.', 'Ошибка!');
          return false;
        } else {
          scope.widget.guiprops.image.url = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';
          scope.deleteImage(scope.sid, scope.nameImage);
          return false;
        }
      } else if (delUrl === scope.widget.guiprops.dhVisual.url) {
        if (scope.widget.guiprops.dhVisual.iconOrImage === 'useImg') {
          scope.toastr.error('Это изображение установлено в виджете. Выберите другое.', 'Ошибка!');
          return false;
        } else {
          scope.widget.guiprops.dhVisual.url = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';
          scope.deleteImage(scope.sid, scope.nameImage);
          return false;
        }
      } else if (delUrl === scope.widget.guiprops.labelMain.url) {
        if (scope.widget.guiprops.labelMain.iconOrImage === 'useImg') {
          scope.toastr.error('Это изображение установлено в виджете. Выберите другое.', 'Ошибка!');
          return false;
        } else {
          scope.widget.guiprops.labelMain.url = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';
          scope.deleteImage(scope.sid, scope.nameImage);
          return false;
        }
      } else if (delUrl === scope.widget.guiprops.bg.url) {
        if (scope.widget.guiprops.bg.fillorImg === 'useImg') {
          scope.toastr.error('Это изображение установлено в виджете. Выберите другое.', 'Ошибка!');
          return false;
        } else {
          scope.widget.guiprops.bg.url = 'https://static.leadgenic.com/lg_widgets_l11/img/land.jpg';
          scope.deleteImage(scope.sid, scope.nameImage);
          return false;
        }
      } else {
        scope.deleteImage(scope.sid, scope.nameImage);
      }
    });
  }

  private deleteImage(siteId: string, filename: string): void {
    this.widgetConstructorService.deleteImage(siteId, filename).subscribe(() => {
      this.getImages(siteId);
    });
  }

  private updateFileDB() {
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

    $('#btnCloseImgM').click();
  }

  private changeColorPodAndSRC() {
    setTimeout(() => {
      // PODLOZHKA settings
      if (this.widget.guiprops?.formExt?.enable || this.widget.guiprops?.form?.enable || this.widget.guiprops?.button?.enable) {
        const colorFormPod = $('#colorFormPod');
        const widgetFormBlM = $('#widgetFormBlockM');
        const widgetFormExtBlM = $('#widgetFormBlockMExt');
        const widgetButtonBlM = $('#widgetButtonBlockM');
        const mainBl = $('#mainBlockWidget');
        const offsetPadding = 6;

        setTimeout(() => {
          this.setTopForColorPod(mainBl, colorFormPod, widgetFormBlM, widgetButtonBlM, widgetFormExtBlM, offsetPadding);
        }, 100);
        setTimeout(() => {
          this.setTopForColorPod(mainBl, colorFormPod, widgetFormBlM, widgetButtonBlM, widgetFormExtBlM, offsetPadding,);
        }, 200);
      }
    }, 0);
  }

  private setTopForColorPod(mainBl, colorFormPod, widgetFormBlM, widgetButtonBlM, widgetFormExtBlM, offsetPadding) {
    let topOfColorPod: number;

    if (this.widget.guiprops.form?.enable) {
      if (this.widget.guiprops.form.orient === 'Вертикальная') {
        offsetPadding = -8;
      }
      topOfColorPod = widgetFormBlM.offset().top - mainBl.offset().top + offsetPadding;
    } else if (this.widget.guiprops.button?.enable) {
      offsetPadding = 8;
      if (widgetButtonBlM) {
        topOfColorPod = widgetButtonBlM.offset().top - mainBl.offset().top - offsetPadding;
      }
    } else if (this.widget.guiprops.formExt?.enable) {
      topOfColorPod = widgetFormExtBlM.offset().top - mainBl.offset().top + offsetPadding;
    }
    if (this.widget.guiprops.bg?.border?.enable) {
      topOfColorPod = topOfColorPod - this.widget.guiprops.bg.border.thickness;
    }

    colorFormPod.css({ top: topOfColorPod + 'px' });
  }

  private downUpInitAir() {
    const globalAir = $('.note-air-popover');
    const topH = $(window).height();

    globalAir
      .find('.note-btn-group').each(function() {
      const topInner = $(this).offset().top;
      if (topInner >= (topH - 250)) {
        $(this).addClass('dropup');
      } else {
        $(this).removeClass('dropup');
      }
    });
  }

  private downUpInit() {
    const globalBl = $('.widgets-settings-container');
    const topH = $(window).height();

    globalBl
      .find('.dropdown').each(function() {
      const topInner = $(this).offset().top;
      if (topInner >= (topH - 250)) {
        $(this).addClass('dropup');
      } else {
        $(this).removeClass('dropup');
      }
    });

    globalBl
      .find('.font-select').each(function() {
      const topInner = $(this).offset().top;
      if (topInner >= (topH - 250)) {
        $(this).addClass('dropup');
      } else {
        $(this).removeClass('dropup');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.autoUploadSub) {
      this.autoUploadSub.unsubscribe();
    }

    if (this.imagesSub) {
      this.imagesSub.unsubscribe();
    }
  }

}
