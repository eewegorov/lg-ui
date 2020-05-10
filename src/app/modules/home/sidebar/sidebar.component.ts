import { AfterViewInit, Component, OnInit } from '@angular/core';
import 'metismenu';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public abtestsMenuExpanded = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.abtestsMenuExpanded = event.url.includes('/abtests/');
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    $('#side-menu').metisMenu();
  }

}
