import { AfterViewInit, Component, OnInit } from '@angular/core';
import 'metismenu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.fixWrapperHeight();
    $('#side-menu').metisMenu();
  }

  private fixWrapperHeight() {
    // Get and set current height
    const headerH = 62;
    const navigationH = $('#navigation').height();
    const contentH = $('.content').height();

    // Set new height when contnet height is less then navigation
    if (contentH < navigationH) {
      $('#wrapper').css('min-height', navigationH + 'px');
    }

    // Set new height when contnet height is less then navigation and navigation is less then window
    if (contentH < navigationH && navigationH < $(window).height()) {
      $('#wrapper').css('min-height', $(window).height() - headerH  + 'px');
    }

    // Set new height when contnet is higher then navigation but less then window
    if (contentH > navigationH && contentH < $(window).height()) {
      $('#wrapper').css('min-height', $(window).height() - headerH + 'px');
    }
  }

}
