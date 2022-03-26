import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { sortBy } from 'lodash-es';
import { Mockup, MockupGroup } from '../../../core/models/widgets';
import { AbtestVariant } from '../../../core/models/abtests';
import { BinsDataService } from '../services/bins-data.service';
import { WidgetService } from '../../widgets/services/widget.service';
import { ContainerizedWidgetService } from '../../widgets/services/containerized-widget.service';
import { AbtestsService } from '../services/abtests.service';


@Component({
  selector: 'app-variant-add',
  templateUrl: './variant-add.component.html',
  styleUrls: ['./variant-add.component.scss']
})
export class VariantAddComponent implements OnInit {
  @Input() public step = 0;
  @Input() public editableAB;
  public isLoaderActive = false;
  public mockups = [];
  public groups = [];
  public ABTypes = [
    {
      type: 'DUPLICATE',
      title: 'Копировать исходный вариант'
    },
    {
      type: 'NEW',
      title: 'Создать вариант с нуля в конструкторе'
    },
    {
      type: 'MOCKUP',
      title: 'Выбрать один из готовых шаблонов в галерее'
    }
  ];
  @Input() private abTests;
  @Input() private currentVariantsLength;
  @Input() private currentSiteId;
  @Input() private currentTestId;
  @Input() private currentTestIndex;
  @Input() private abtTypeWidget;
  private colorsArray = ['#34495e', '#9b59b6', '#3498db', '#62cb31', '#ffb606', '#e67e22', '#e74c3c',
    '#c0392b', '#58b62c', '#e43725', '#2a7aaf', '#7c4792', '#4ea227', '#b8651b',
    '#9a2e22', '#2a3a4b', '#ffeb3b'];
  private checkboxOnArray = [];
  private testArr = [];
  private queryForMockups = { type: '', categories: '' };
  private startItem;
  private newItem;
  private ITEMS_TO_ADD = 6;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private binsDataService: BinsDataService,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private abTestsService: AbtestsService
  ) {
  }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public loadMore() {
    for (let i = this.startItem; i < (this.startItem + this.ITEMS_TO_ADD); i++) {
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
    this.widgetService.getMockups(this.queryForMockups.type, this.queryForMockups.categories).subscribe((response: Mockup[]) => {
      this.actionAfterTabSwitch(response);
    });
  }

  public setMockupABT(mockup) {
    this.editableAB.mockupId = mockup.id;
    delete this.editableAB.templateId;
    this.createABT();
  }

  public setABType(type) {
    this.editableAB.mode = type.type;
    if (this.editableAB.mode === 'MOCKUP') {
      this.filterByTab(this.abtTypeWidget);
      this.step = 1;
    } else if (this.editableAB.mode === 'NEW') {
      delete this.editableAB.mockupId;
      this.createABT();
    } else if (this.editableAB.mode === 'DUPLICATE') {
      delete this.editableAB.mockupId;
      delete this.editableAB.templateId;
      this.createABT();
    }
  }

  private createABT() {
    const isContainerized = this.editableAB.containerized;
    delete this.editableAB.containerized;
    const dataObj = { ...this.editableAB };
    this.abTestsService.createVariant(this.currentTestId, dataObj).subscribe((response: AbtestVariant) => {
      this.currentTestId = '';

      if (isContainerized) {
        this.containerizedWidgetService
          .rename(this.currentSiteId, response.value, 'Вариант ' + this.currentVariantsLength).subscribe(() => {
          this.updateVariantAfterCreating(response.value);
        });
      } else {
        this.widgetService.rename(this.currentSiteId, response.value, 'Вариант ' + this.currentVariantsLength).subscribe(() => {
          this.updateVariantAfterCreating(response.value);
        });
      }
    });
  }

  private updateVariantAfterCreating(id) {
    const newVariant = {
      conversions: [],
      name: 'Вариант №' + this.currentVariantsLength,
      etalon: false,
      id
    };
    this.addMoreDataToVariant(newVariant, this.abTests[this.currentTestIndex].variants.length, this.abTests[this.currentTestIndex]);

    this.abTests[this.currentTestIndex].variants.push(newVariant);

    this.router.navigate([`/widgets/edit/${this.currentSiteId}-${id}/`]).then();
    this.closeModal();
  }

  private addMoreDataToVariant(variant, index, test) {
    variant.conversions = sortBy(variant.conversions, 'date');
    variant.color = this.colorsArray[index];
    const arrayForInfo = this.binsDataService.binDist(
      [{ s: this.getActions(variant), n: this.getShows(variant) }], { confRange: 0.8, disc: 30000 }
    ).res;

    variant.convInfo = arrayForInfo[0];
    variant.convInfo.conversion = this.getConvItem(variant.convInfo);
    variant.convInfo.convNumber = this.getConvNumber(variant.convInfo);

    if (variant.etalon && test) {
      test.etalonConversion = variant.convInfo.convNumber;
    }

    if (test && typeof test.etalonConversion !== 'undefined') {
      variant.convInfo.betterTo =
        test.etalonConversion !== 0 ? (((variant.convInfo.convNumber - test.etalonConversion) / test.etalonConversion) * 100) : 0;
      variant.convInfo.betterTo = Math.round(variant.convInfo.betterTo * 100) / 100;
    }

    const charOpt = {
      pointBackgroundColor: variant.color,
      pointRadius: 1,
      borderColor: variant.color,
      tooltipCaretSize: 0,
      fill: false
    };
    test.chartSeries.push(variant.name);
    test.chartColors.push(charOpt);
  }

  private getActions(variant) {
    if (!variant.conversions.length) {
      return 0;
    }
    let total = 0;
    variant.conversions.forEach((item) => {
      total += item.target;
    });
    return total;
  }

  private getShows(variant) {
    if (!variant.conversions.length) {
      return 0;
    }
    let total = 0;
    variant.conversions.forEach((item) => {
      total += item.shows;
    });
    return total;
  }

  private getConvItem(item) {
    const conv = this.binsDataService.distRound(item.s / item.n);
    return item.n !== 0 ? conv : '0%';
  }

  private getConvNumber(item) {
    if (item.n !== 0) {
      return item.s / item.n;
    } else {
      return 0;
    }
  }

  private filterByTab(typeId) {
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

    this.widgetService.getMockups(this.queryForMockups.type).pipe(
      mergeMap(((fetchedMockups: Mockup[]) => {
        mockups = fetchedMockups;
        return this.widgetService.getMockupGroups(this.queryForMockups.type);
      }))
    ).subscribe((groups: MockupGroup[]) => {
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

      this.actionAfterTabSwitch(mockups);
    });
  }

  private actionAfterTabSwitch(data) {
    setTimeout(() => {
      this.mockups = [];
      this.testArr = data;
      this.fillArrayToShow();
    }, 200);

    setTimeout(() => {
      this.isLoaderActive = false;
    }, 400);
  }

  private fillArrayToShow() {
    for (let i = 0; i < this.ITEMS_TO_ADD; i++) {
      if (i < this.testArr.length) {
        this.mockups.push(this.testArr[i]);
        this.startItem = (i + 1);
        this.newItem = this.startItem;
      } else {
        break;
      }
    }
  }

}
