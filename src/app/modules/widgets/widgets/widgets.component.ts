import { Component, OnInit } from '@angular/core';
import { WidgetService } from '../services/widget.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {
  widgets;
  companies;
  company = { name: '' };
  currentSite = { name: '' };
  site = { name: '' };
  currentCompany = { id: '', name: '' };
  defCompanyName;
  types: { id: string; name: string; }[];


  constructor(private widgetService: WidgetService) { }

  ngOnInit(): void {
  }

  public getTypeItem(typeId: string): { id: string; name: string; } {
    return this.types.find((item) => {
      return item.id === typeId
    });
  }

  public getTypesWithCompanyFilter() {
    if (!this.widgets) {
      return [];
    }
    const keys = Object.keys(this.widgets);
    return keys.filter((item) => {
      return this.getFilteredWidgets(item).length > 0;
    });
  };

  private getFilteredWidgets(type) {
    if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id) {
      return this.widgets[type];
    }
    return this.widgets[type].filter((item) => {
      return item.companyId === this.currentCompany.id;
    });
  };

}
