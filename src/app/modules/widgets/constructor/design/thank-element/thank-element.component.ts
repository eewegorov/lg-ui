import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-element',
  templateUrl: './thank-element.component.html',
  styleUrls: ['./thank-element.component.scss']
})
export class ThankElementComponent implements OnInit {
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

}
