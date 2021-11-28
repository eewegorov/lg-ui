import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-extended-ddw',
  templateUrl: './extended-ddw.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-ddw.component.scss']
})
export class ExtendedDdwComponent implements OnInit {
  @Input() public item: Record<string, any>;
  @Input() public st: Record<string, any>;

  @ViewChild('element', { static: true }) element: ElementRef;

  constructor() { }

  ngOnInit(): void {
    $(this.element.nativeElement).bind('click', (event) => {
      event.stopPropagation();
    });

    $(document).bind('click', () => {
      this.item.serviceData.isOpen = false;
    });

    $('#widgetFormBlockMExt').bind('click', () => {
      this.item.serviceData.isOpen = false;
    });
  }

  public setFormExtDDState(item, variant) {
    item.serviceData.isOpen = !item.serviceData.isOpen;
    item.serviceData.extraLabel = variant;
  }

}
