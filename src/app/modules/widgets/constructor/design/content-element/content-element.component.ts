import { Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
})
export class ContentElementComponent implements OnInit {
  @Input() public widget: FullWidget;

  public optionsSummernote = {
    airMode: true,
    dialogsInBody: true,
    popover: {
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        ['color', ['color']],
        ['font', ['bold', 'underline', 'italic', 'clear', 'fontsize', 'strikethrough']],
        ['para', ['paragraph', 'height']],
        ['insert', ['link']]
      ]
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  public trackById(index, item) {
    return item.id;
  }

}
