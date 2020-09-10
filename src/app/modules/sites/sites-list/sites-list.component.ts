import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sites-list',
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss']
})
export class SitesListComponent implements OnInit {
  @Input() public item;
  @Input() public timezone = '';
  public actionsStatsWeekCount: number;
  public leadsStatsWeekCount: number;
  public mailStatsWeekCount: number;
  public data = [];
  public colors;
  public labels;
  public options = {
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: (value) => { if (value % 1 === 0) { return value; }}
        }
      }]
    }
  };
  private exptime;

  constructor() {
    this.exptime = this.item.tariffExp;
  }

  ngOnInit(): void {
  }

  public goToSiteSettings() {

  }

  public improvePlan() {

  }

}
