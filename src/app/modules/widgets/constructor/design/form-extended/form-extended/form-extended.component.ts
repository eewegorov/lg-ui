import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../../core/models/widgets';
import { Coupon } from '../../../../../../core/models/coupons';
import { UtilsService } from '../../../../../../core/services/utils.service';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-form-extended',
  templateUrl: './form-extended.component.html',
  styleUrls: ['../../../../shared/shared.scss', './form-extended.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormExtendedComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public placePopup: string[];

  @Output() private setExtended = new EventEmitter<{element: Record<string, any>, index: number}>();

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

  public onDrDr = {
    group: 'ng',
    animated: 100,
    filter: '.ignore-elements',
    handle: '.grab-form-ext-item',
    onStart: this.onStarting.bind(this),
    onEnd: this.onEnding.bind(this)
  };

  public orientationTypesOfField = [];
  public visualTypesOfField = [];
  public availMainWidthTypes = [];
  public availMainWidthOrientationTypes = [];

  private isCurrentDraggedWasClosed = false;

  private changeItemSub: SubscriptionLike;

  constructor(
    private utilsService: UtilsService,
    private widgetConstructorService: WidgetConstructorService
  ) { }

  ngOnInit(): void {
    this.changeItemSub = this.widgetConstructorService.changeItemFormType.subscribe(({type, index}) => {
      const item = this.widgetConstructorService.getItemFormByType(type);
      if (this.widgetConstructorService.isItemMultiAndHasId(item.type)) {
        item.idField = item.idField + this.getIdField(item, index);
      }

      item.widthValue = this.widget.guiprops.formExt.model.list[index].widthValue;
      item.widthType = this.widget.guiprops.formExt.model.list[index].widthType;

      this.widget.guiprops.formExt.model.list[index] = item;
      this.toggleElement(index);
    });

    this.visualTypesOfField = this.widgetConstructorService.getExtFormVisualTypeOfField();
    this.orientationTypesOfField = this.widgetConstructorService.getExtFormMainFieldsOrientationType();
    this.availMainWidthTypes = this.widgetConstructorService.getExtFormMainWidthTypes();
    this.availMainWidthOrientationTypes = this.widgetConstructorService.getExtFormMainWidthOrientationType();

    if (!this.widget.guiprops.formExt.model.list.length) {
      const item1 = this.widgetConstructorService.getItemFormByType('text');
      const item2 = this.widgetConstructorService.getItemFormByType('button');
      if (this.widgetConstructorService.isItemMultiAndHasId(item1.type)) {
        item1.idField = item1.idField + this.widget.guiprops.formExt.model.list.length;
      }
      this.widget.guiprops.formExt.model.list = [item1, item2];
    }

    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);

    this.widget.guiprops.formExt.model.mainSettings.borderRadiusInputFormEnable = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.widget.guiprops.formExt.model.mainSettings.bgInputForm && this.widget.guiprops.formExt.model.mainSettings.opacityBgInputForm) {
      this.widget.guiprops.formExt.model.mainSettings.rgbaInputForm =
        (this.widgetConstructorService.hexToRgb(
          this.widget.guiprops.formExt.model.mainSettings.bgInputForm,
          this.widget.guiprops.formExt.model.mainSettings.opacityBgInputForm
        )).toString();
    }

    if (this.widget.guiprops.formExt.model.mainSettings.colorPod.color &&
      this.widget.guiprops.formExt.model.mainSettings.colorPod.opacityColorPod &&
      this.widget.guiprops.formExt.model.mainSettings.colorPod.enable &&
      this.widget.guiprops.formExt.enable &&
      this.widget.guiprops.formExt.model.mainSettings.button.enable
    ) {
      if (this.widget.guiprops.formExt.model.mainSettings.colorPod.enable) {
        this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod =
          (this.widgetConstructorService.hexToRgb(
            this.widget.guiprops.formExt.model.mainSettings.colorPod.color,
            this.widget.guiprops.formExt.model.mainSettings.colorPod.opacityColorPod
          )).toString();
      }
      else {
        this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod = 'transparent';
      }
    }
  }

  public setBorderRadius(value: boolean): void {
    if (!value) {
      this.widget.guiprops.formExt.model.mainSettings.borderRadiusInputForm = 0;
    }
  }

  public dragItemClass(item) {
    if (!item.isTabOpened) {
      return 'form-ext-item-closed';
    }
  }

  public toggleItem(event, index, isPanelClick?) {
    const _this = $(event.currentTarget);
    const parent = _this.parents('.form-ext-item');
    let shouldToggle = parent.find('.form-ext-item__toggled-wrapper');

    if (isPanelClick) {
      shouldToggle = _this.find('.form-ext-item__toggled-wrapper');
      if (this.widget.guiprops.formExt.model.list[index].isTabOpened) {
        return;
      }
    } else {
      event.stopPropagation();
    }

    this.toggleElement(index);
  }

  private toggleElement(index) {
    const currentItem = this.widget.guiprops.formExt.model.list[index];
    this.setExtended.emit({ element: currentItem, index });
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
  }

  public highlightContentOn(index, type) {
    if (type === 'hidden') {
      return false;
    }
    const selector = '.form-ext-element-' + index + '';
    const elementToHighlight = $(selector);
    elementToHighlight.addClass('form-ext-element-highlighted');
  }

  public highlightContentOff(index) {
    const selector = '.form-ext-element-' + index + '';
    const elementToHighlight = $(selector);
    elementToHighlight.removeClass('form-ext-element-highlighted');
  }

  public removeElementFromFormExtList(event, index) {
    event.stopPropagation();
    this.widget.guiprops.formExt.model.list = this.widgetConstructorService.removeFromArray(this.widget.guiprops.formExt.model.list, index);
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
  }

  public cloneElementFromFormExtList(event, index, item) {
    event.stopPropagation();
    const newElement = { ...item };

    if (newElement.id) {
      newElement.id = this.utilsService.generateShortID();
    }
    if (newElement.idField) {
      newElement.idField = newElement.idField + '_copy';
    }

    this.widget.guiprops.formExt.model.list.splice(index + 1, 0, newElement);
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
  }

  public addItemToExtForm() {
    const newType = 'text';
    const item = this.widgetConstructorService.getItemFormByType(newType);
    if (this.widgetConstructorService.isItemMultiAndHasId(item.type)) {
      item.idField = item.idField + this.getIdField(item, this.widget.guiprops.formExt.model.list.length);
    }
    item.widthValue = this.widget.guiprops.formExt.model.list[this.widget.guiprops.formExt.model.list.length - 1].widthValue;
    item.widthType = this.widget.guiprops.formExt.model.list[this.widget.guiprops.formExt.model.list.length - 1].widthType;

    this.widget.guiprops.formExt.model.list.push(item);
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
    this.closeAfterAdded();
  }

  public isFieldSettings() {
    return this.widget.guiprops.formExt.model.list.some((item) => {
      return item.type === 'text' || item.type === 'email' || item.type === 'name' || item.type === 'phone' ||
        item.type === 'message' || item.type === 'variants';
    });
  }

  public isUnclonable(type) {
    return this.widgetConstructorService.isThatElementUnclonable(type);
  }

  private getIdField(item, index) {
    return item.type === 'hidden' ? item.fieldType.type : index;
  }

  private closeAfterAdded() {
    setTimeout(() => {
      const listOfBodies = $('#collapseTwo').find('.form-ext-item__toggled-wrapper');
      if (listOfBodies.length > 0) {
        this.closeInactive(listOfBodies.last());
      }
    });
  }

  private onStarting(drObj) {
    this.isCurrentDraggedWasClosed = !this.widget.guiprops.formExt.model.list[drObj.oldIndex].isTabOpened;
  }

  private onEnding(drObj) {
    if (drObj.newIndex !== drObj.oldIndex) {
      setTimeout(() => {
        const listOfBodies = $('#collapseTwo').find('.form-ext-item__toggled-wrapper');
        this.closeInactive($(listOfBodies[drObj.newIndex]), this.isCurrentDraggedWasClosed, true);
      }, 0);
    }
    this.widgetConstructorService.setArrayOfUsedItems(this.widget.guiprops.formExt.model.list);
  }

  private closeInactive(active, wasClosed?, slideAll?) {
    const shouldClosed = $('#collapseTwo').find('.form-ext-item__toggled-wrapper');
    shouldClosed.each((index, el) => {

      // TODO: Still need fix if same elements dragged
      // if (wasClosed) {
      //     $(el).slideUp(0);
      //     $(el).parents(".form-ext-item").addClass("form-ext-item-closed");
      //     return;
      // }
      // if (slideAll) {
      //     $(el).slideUp(0);
      //     scope.widget.guiprops.formExt.model.list[index].isTabOpened = false;
      //     return;
      // }
      if (active[0] !== el) {
        $(el).slideUp(300);
        this.widget.guiprops.formExt.model.list[index].isTabOpened = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.changeItemSub) {
      this.changeItemSub.unsubscribe();
    }
  }

}
