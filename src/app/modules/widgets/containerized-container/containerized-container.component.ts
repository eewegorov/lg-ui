import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containerized-container',
  templateUrl: './containerized-container.component.html',
  styleUrls: ['./containerized-container.component.scss']
})
export class ContainerizedContainerComponent implements OnInit {
  public container = '';
  currentCompany = '';
  site = '';

  constructor() { }

  ngOnInit(): void {
  }

}
