import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-templates-gallery',
  templateUrl: './templates-gallery.component.html',
  styleUrls: ['./templates-gallery.component.scss']
})
export class TemplatesGalleryComponent implements OnInit {
  @Input() public types = [];

  @Input() private typeId = '';
  @Input() private callback: (data) => void;

  public groups = [];
  public mockups = [];

  private ALL_TYPES = {
    type: null,
    code: "all",
    class: "filter-tab-on-all",
    name: $translate.instant("widgetsList.add.modal.gallery.tab.all.title"),
    sub: $translate.instant("widgetsList.add.modal.gallery.tab.all.desc"),
    id: null
  };

  constructor() { }

  ngOnInit(): void {
    if (scope.typeId) {
      scope.filterByTab("all", scope.typeId);
    } else {
      scope.types = [ALL_TYPES].concat(mapTypes(scope.types));
      scope.filterByTab("all");
    }
  }

  public isTabsActive(tabLabel){
    return this.tab === tabLabel;
  }

  public filterByCat(checked, catId) {
    if (!checked) {
      for (var i = 0; i < checkboxOnArray.length; i++) {
        if (checkboxOnArray[i] === catId) {
          checkboxOnArray.splice(i, 1);
        }
      }
    } else {
      checkboxOnArray.push(catId);
    }
    scope.isLoaderActive = true;
    testArr = [];
    if(!queryMockups.type) {
      delete queryMockups.type;
    }
    queryMockups.categories = checkboxOnArray.join(",");
    WidgetService.getMockups(queryMockups).then(function(response) {
      actionAfterTabSwitch(response.data);
    });
  }

  public loadMore() {
    for(var i = startItem; i < (startItem + ITEMS_TO_ADD); i++) {
      if(newItem < testArr.length) {
        scope.mockups.push(testArr[i]);
        newItem++;
      } else {
        startItem = newItem;
        break;
      }
    }
    startItem = newItem;
  }

  public saveWidget(mockup) {
    scope.callback(mockup);
  }

  public filterByTab(newTab, typeId) {
    scope.isLoaderActive = true;
    testArr = [];
    checkboxOnArray = [];
    if (typeId) {
      queryMockups.type = typeId;
      queryGroups.type = typeId;
    } else {
      delete queryMockups.type;
      delete queryGroups.type;
    }
    delete queryMockups.categories;
    WidgetService.getMockups(queryMockups).then(function(response) {
      WidgetService.getMockupGroups(queryGroups).then(function(groups) {
        //Parse groups and categories
        scope.groups = groups.data;
        for (var i = 0; i < groups.data.length; i++) {
          for (var j = 0; j < groups.data[i].categories.length; j++) {
            scope.groups[i].categories[j] = {
              checked: false,
              id: groups.data[i].categories[j].id,
              name: groups.data[i].categories[j].name
            }
          }
        }

        this.actionAfterTabSwitch(response.data, newTab);
      });
    });
  }

  private actionAfterTabSwitch(data, newTab) {
    $timeout(function () {
      scope.mockups = [];
      testArr = data;
      fillArrayToShow();
    }, 200);
    $timeout(function () {
      if(newTab) {
        scope.tab = newTab;
      }
      scope.isLoaderActive = false;
    }, 400);
  }

  // Add mockups to shown array firstly
  private fillArrayToShow() {
    for(var i = 0; i < ITEMS_TO_ADD; i++) {
      if(i < testArr.length) {
        scope.mockups.push(testArr[i]);
        startItem = (i + 1);
        newItem = startItem;
      } else break;
    }
  }

  private mapTypes(types) {
    return types.map(function(type) {
      type.class = "filter-tab-on-" + type.code;
      type.sub = $translate.instant("widgetsList.add.modal.gallery.tab." + type.code + ".desc");
      return type;
    });
  }

}
