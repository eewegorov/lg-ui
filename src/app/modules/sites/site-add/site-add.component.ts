import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.scss']
})
export class SiteAddComponent implements OnInit {
  @Input() public hidePhone: boolean;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
