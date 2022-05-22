import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Mockup, MockupGroup } from '@core/models/widgets';
import { WidgetService } from '../services/widget.service';

@Component({
  selector: 'app-templates-gallery',
  templateUrl: './templates-gallery.component.html',
  styleUrls: ['../shared/shared.scss', './templates-gallery.component.scss']
})
export class TemplatesGalleryComponent implements OnInit {
  @Input() public types = [];
  public groups = [];
  public mockups: Mockup[] = [];
  public isLoaderActive = false;
  @Input() private typeId = '';
  @Output() private chooseWidget = new EventEmitter<Mockup>();
  private ALL_TYPES;
  private tab: number;
  private startItem;
  private newItem;
  private ITEMS_TO_ADD = 9;
  private checkboxOnArray = [];
  private testArr = [];
  private queryForMockups = { type: '', categories: '' };

  constructor(private translate: TranslateService, private widgetService: WidgetService) {
    this.ALL_TYPES = {
      type: null,
      code: 'all',
      class: 'filter-tab-on-all',
      name: this.translate.instant('widgetsList.add.modal.gallery.tab.all.title'),
      sub: this.translate.instant('widgetsList.add.modal.gallery.tab.all.desc'),
      id: null
    };
  }

  ngOnInit(): void {
    if (this.typeId) {
      this.filterByTab('all', this.typeId);
    } else {
      this.types = [this.ALL_TYPES].concat(this.mapTypes(this.types));
      this.filterByTab('all');
    }
  }

  public isTabsActive(tabLabel) {
    return this.tab === tabLabel;
  }

  public filterByCat(checked, catId) {
    if (!checked) {
      for (let i = 0; i < this.checkboxOnArray.length; i++) {
        if (this.checkboxOnArray[i] === catId) {
          this.checkboxOnArray.splice(i, 1);
        }
      }
    } else {
      this.checkboxOnArray.push(catId);
    }

    this.isLoaderActive = true;
    this.testArr = [];

    if (!this.queryForMockups.type) {
      delete this.queryForMockups.type;
    }
    this.queryForMockups.categories = this.checkboxOnArray.join(',');
    this.widgetService
      .getMockups(this.queryForMockups.type, this.queryForMockups.categories)
      .subscribe((response: Mockup[]) => {
        this.actionAfterTabSwitch(response);
      });
  }

  public loadMore() {
    for (let i = this.startItem; i < this.startItem + this.ITEMS_TO_ADD; i++) {
      if (this.newItem < this.testArr.length) {
        this.mockups.push(this.testArr[i]);
        this.newItem++;
      } else {
        this.startItem = this.newItem;
        break;
      }
    }
    this.startItem = this.newItem;
  }

  public saveWidget(mockup: Mockup): void {
    this.chooseWidget.emit(mockup);
  }

  public trackById(index, item) {
    return item.id;
  }

  public filterByTab(newTab, typeId?) {
    this.isLoaderActive = true;
    this.testArr = [];
    this.checkboxOnArray = [];
    if (typeId) {
      this.queryForMockups.type = typeId;
    } else {
      delete this.queryForMockups.type;
    }
    delete this.queryForMockups.categories;

    let mockups = [];

    this.widgetService
      .getMockups(this.queryForMockups.type)
      .pipe(
        mergeMap((fetchedMockups: Mockup[]) => {
          mockups = fetchedMockups;
          return this.widgetService.getMockupGroups(this.queryForMockups.type);
        })
      )
      .subscribe((groups: MockupGroup[]) => {
        // Parse groups and categories
        this.groups = groups;
        for (let i = 0; i < groups.length; i++) {
          for (let j = 0; j < groups[i].categories.length; j++) {
            this.groups[i].categories[j] = {
              checked: false,
              id: groups[i].categories[j].id,
              name: groups[i].categories[j].name
            };
          }
        }

        this.actionAfterTabSwitch(mockups, newTab);
      });
  }

  private actionAfterTabSwitch(data, newTab?) {
    setTimeout(() => {
      this.mockups = [];
      this.testArr = data;
      this.fillArrayToShow();
    }, 200);

    setTimeout(() => {
      if (newTab) {
        this.tab = newTab;
      }
      this.isLoaderActive = false;
    }, 400);
  }

  // Add mockups to shown array firstly
  private fillArrayToShow() {
    for (let i = 0; i < this.ITEMS_TO_ADD; i++) {
      if (i < this.testArr.length) {
        this.mockups.push(this.testArr[i]);
        this.startItem = i + 1;
        this.newItem = this.startItem;
      } else {
        break;
      }
    }
  }

  private mapTypes(types) {
    return types.map(type => {
      type.class = `filter-tab-on-${type.code}`;
      type.sub = this.translate.instant(`widgetsList.add.modal.gallery.tab.${type.code}.desc`);
      return type;
    });
  }
}
