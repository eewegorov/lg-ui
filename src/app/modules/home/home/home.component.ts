import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isConstructorOpened = false;
  public withoutTransition = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.isConstructorOpened = this.router.url.includes('widgets/edit');
    this.withoutTransition = this.router.url.includes('widgets/edit');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isConstructorOpened = event.url.includes('widgets/edit');

        setTimeout(() => {
          this.withoutTransition = event.url.includes('widgets/edit');
        }, 0);
      }
    })
  }

}
