import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
})
export class ContentElementComponent implements OnInit {
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
