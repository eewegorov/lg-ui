import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import 'metismenu';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('menu', { static: true }) menu: ElementRef;
  public abtestsMenuExpanded = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.abtestsMenuExpanded = event.url.includes('/abtests/');
    });
  }

  ngOnInit(): void {
    $(this.menu.nativeElement).metisMenu();
  }

}
