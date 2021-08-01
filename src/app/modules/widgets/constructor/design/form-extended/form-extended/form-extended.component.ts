import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../../core/models/widgets';
import { Coupon } from '../../../../../../core/models/coupons';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';
import { UtilsService } from '../../../../../../core/services/utils.service';

@Component({
  selector: 'app-form-extended',
  templateUrl: './form-extended.component.html',
  styleUrls: ['../../../../shared/shared.scss', './form-extended.component.scss']
})
export class FormExtendedComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public placePopup: string[];

  @Output() private removeElement = new EventEmitter<{index: number, elem: Record<string, string>}>();

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  public onDrDr = {
    group: 'ng',
    animated: 100,
    filter: '.ignore-elements',
    handle: '.grab-form-ext-item',
    onStart: this.onStarting,
    onEnd: this.onEnding
  };

  private isCurrentDraggedWasClosed = false;

  constructor(
    private utilsService: UtilsService,
    private widgetConstructorService: WidgetConstructorService
  ) { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number, elem: Record<string, string>): void {
    this.removeElement.emit({index, elem});
  }

  public dragItemClass(item) {
    let className = '';

    if (!item.isTabOpened) {
      className += ' form-ext-item-closed';

    }

    return className;
  }

  public toggleItem(event, index, isPanelClick) {
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

    this.toggleElement(shouldToggle, index);
  }

  private toggleElement(shouldToggle, index) {
    this.widget.guiprops.formExt.model.list[index].isTabOpened = !this.widget.guiprops.formExt.model.list[index].isTabOpened;
    shouldToggle.slideToggle(500);
    this.closeInactive(shouldToggle);

    if (this.widget.guiprops.formExt.model.list[index].isTabOpened) {
      setTimeout(() => {
        const accordion = $('#accordion');
        const accordionIn = $('#accordionIn');

        const scrollTo = (shouldToggle.offset().top) - (accordionIn.offset().top) - 116;
        accordion.animate({scrollTop: scrollTo}, 200, 'swing');
      }, 800);
    }
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

    setTimeout(() => {
      const _this = $(event.currentTarget);
      const parent = _this.parents('.form-ext-item');
      const shouldToggle = parent.next().find('.form-ext-item__toggled-wrapper');
      this.toggleElement(shouldToggle, index + 1);
    }, 0);
  }

  public isUnclonable(type) {
    return this.widgetConstructorService.isThatElementUnclonable(type);
  }

  public trackByIndex(index) {
    return index;
  }

  private onStarting(drObj) {
    if (drObj.models.length > 1) {
      this.isCurrentDraggedWasClosed = !this.widget.guiprops.formExt.model.list[drObj.oldIndex].isTabOpened;
    }
  }

  private onEnding(drObj) {
    if (drObj.models.length > 1 && (drObj.newIndex !== drObj.oldIndex)) {
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

}
