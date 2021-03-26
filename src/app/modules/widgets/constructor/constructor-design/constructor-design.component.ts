import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowDirective } from '@flowjs/ngx-flow';
import { FullWidget } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import Swal from 'sweetalert2';
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
  @Input() public widget: FullWidget;
  @Input() public isDesigner: boolean;
  @Input() public isMockup: boolean;
  @Input() public isContainerized: boolean;
  @Input() private currentActiveTab: string;

  public isLoading = false;

  private SP_widget: any;
  private validators = [];
  private couponsId = [];
  private customFields = [];
  private formExtIdsCached = [];
  private couponsErrorFlag = false;
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;

  private autoUploadSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService,
    private widgetConstructorDesignService: WidgetConstructorDesignService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.flow.upload();
      }
    });
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
        if ($(this).val() != '') {
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

    var formElementToAdd = {
      name: "form-ext-element"
    };


    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(formElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, formElementToAdd);
    }
    $scope.widget.guiprops.formExt.enable = true;

    addElementModalHide();
  }

  public addFormButtonElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    var formElementToAdd = {
      name: "form-element"
    };

    $scope.widget.guiprops.form.enable = true;

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(formElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, formElementToAdd);
    }

    addElementModalHide();
  }

  public addCloseLinkElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    var closeLinkElementToAdd = {
      name: "closelink-element"
    };
    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(closeLinkElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, closeLinkElementToAdd);
    }

    addElementModalHide();
  }

  public disElementOrNotBtn() {
    return this.widget.guiprops.form.enable || this.widget.guiprops.button.enable || this.widget.guiprops.formExt.enable;
  }

  public disElementOrNotBtnCloseLink() {
    for (var i = 0; i < $scope.widget.guiprops.elementsList.length; i++) {
      if ($scope.widget.guiprops.elementsList[i].name === "closelink-element" ||
        ($scope.widget.guiprops.formExt && $scope.widget.guiprops.formExt.enable &&
          this.widgetConstructorDesignService.isFormHasCurrentTypeButtons($scope.widget.guiprops.formExt.model.list, 2))) {
        return true;
      }
    }
    return false;
  }

  public addButtonElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    var buttonElementToAdd = {
      name: "button-element"
    };
    $scope.widget.guiprops.button.enable = true;

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(buttonElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, buttonElementToAdd);
    }

    addElementModalHide();
  }

  public addTitleElement() {
    var textElementToAdd = {
      name: "title-element",
      textSummer:"<p>Вы можете редактировать этот текст. Если вы хотите<br>изменить цвет, позиционирование или стиль текста,<br>то выделите фрагмент для появления окна редактора.<br>Размер и шрифт изменяются слева в блоке настроек элемента.</p>",
      font: $scope.systemFonts[0],
      fontType:'systemFont',
      fontName:'',
      fontSize:12,
      counter: 0,
      textShadow: {
        enable: false,
        color: "#000000",
        opacity: "1",
        rgbaColor: (hexToRgb("#FFFFFF", 1)).toString(),
        horiz: 0,
        vertical: 0,
        blur: 0
      }
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(textElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, textElementToAdd);
    }

    addElementModalHide();
  }

  public addSocialElement(disOrNot) {
    if (disOrNot) {
      return false;
    }

    var socialElementToAdd = {
      name: "social-element"
    };
    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(socialElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, socialElementToAdd);
    }

    addElementModalHide();
  }

  public disElementOrNotBtnSocial() {
    for (var i = 0; i < $scope.widget.guiprops.elementsList.length; i++) {
      if ($scope.widget.guiprops.elementsList[i].name === "social-element") {
        return true;
      }
    }
    return false;
  }

  public addSplitElement() {
    var splitElementToAdd = {
      name: "split-element",
      type: $scope.typeClass[0],
      color: "#000000",
      width_type: $scope.widthHrType[0],
      widthpx: 200,
      counter: 0,
      position: $scope.floatBtn[0]
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(splitElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, splitElementToAdd);
    }

    addElementModalHide();
  }

  public addVideoElement() {
    var videoElementToAdd = {
      name: "video-element",
      videoUrl: 'https://',
      videoId: '',
      videoType:'youtube',
      type: $scope.typeClass[0],
      width_type: $scope.widthHrType[0],
      widthpx: 100,
      counter: 0,
      position: $scope.floatBtn[0]
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(videoElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, videoElementToAdd);
    }

    addElementModalHide();
  }

  public addImageElement() {
    // if (!$scope.isPayment) {
    //     $scope.showPaymentDialog($scope.sid, $scope.localization.paymentFeature);
    //     return;
    // }

    var imageElementToAdd = {
      name: "image-element",
      imageUrl: 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg',
      type: $scope.typeClass[0],
      width_type: $scope.widthHrType[1],
      widthpx: 100,
      counter: 0,
      position: $scope.floatBtn[1]
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(imageElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, imageElementToAdd);
    }

    addElementModalHide();
  }

  public addPaddingElement() {
    var paddingElementToAdd = {
      name: "padding-element",
      counter: 0,
      padding: 20
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(paddingElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, paddingElementToAdd);
    }

    addElementModalHide();
  }

  public addIframeElement() {
    var iframeElementToAdd = {
      name: "iframe-element",
      type: $scope.typeClass[0],
      width_type: $scope.widthHrType[0],
      widthpx: 100,
      height_type: $scope.widgwidthBtn[0],
      heightpx: 100,
      counter: 0,
      position: $scope.floatBtn[0],
      html_value: "",
      css_value: "",
      real_height: 100
    };

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(iframeElementToAdd);
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, iframeElementToAdd);
    }

    addElementModalHide();
  }

  public addCouponElement() {
    if (!$scope.isPayment) {
      $scope.showPaymentDialog($scope.sid, $scope.localization.paymentFeature);
      return;
    }

    if (addElemFromWidget === false) {
      $scope.widget.guiprops.elementsList.push(angular.copy(globalCouponObject));
    } else {
      $scope.widget.guiprops.elementsList.splice(addElemFromWidget + 1, 0, angular.copy(globalCouponObject));
    }

    addElementModalHide();
  }

  public closeModalImg() {
    $('body').removeClass('modal-open-h100');
  }

  public updateFile() {
    if ($scope.linkImage == '') {
      toastr["error"]('Пожалуйста, выберите изображение.', 'Ошибка!');
    } else {
      $scope.controls.newModal.modal('hide');
      $('body').removeClass('modal-open-h100');

      if (imageCustom === 'imageSingle') {
        $scope.widget.guiprops.image.url = $scope.linkImage;
      } else if (imageCustom === 'dotIcon') {
        $scope.widget.guiprops.dhVisual.url = $scope.linkImage;
      } else if (imageCustom === 'labelIcon') {
        $scope.widget.guiprops.labelMain.url = $scope.linkImage;
      } else if (!imageCustom) {
        $scope.widget.guiprops.bg.url = $scope.linkImage;
      } else {
        imageCustom.imageUrl = $scope.linkImage;
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

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

