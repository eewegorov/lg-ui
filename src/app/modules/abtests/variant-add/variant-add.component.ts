import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-variant-add',
  templateUrl: './variant-add.component.html',
  styleUrls: ['./variant-add.component.scss']
})
export class VariantAddComponent implements OnInit {
  @Input() public step = 0;
  @Input() private currentVariantsLength;
  @Input() private currentSiteId;
  @Input() private currentTestId;
  @Input() private currentTestIndex;
  @Input() private abtTypeWidget;
  @Input() public editableAB;
  public type;
  public grp;
  public cat;
  public mckp;

  constructor() { }

  ngOnInit(): void {
  }

}
