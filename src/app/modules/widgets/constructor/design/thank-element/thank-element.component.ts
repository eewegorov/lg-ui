import { Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-thank-element',
  templateUrl: './thank-element.component.html',
  styleUrls: ['./thank-element.component.scss']
})
export class ThankElementComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public bgStyle: string;

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

  public setVideoBGThankStyle() {
    if (($('#thankWidget').width() !== 0) && ($('#thankWidget').height() !== 0)) {
      if (($('.video-bg-thank').width() / $('.video-bg-thank').height()) >= (16 / 9)) {
        return 'wide-video-bg-ext';
      } else {
        return 'narrow-video-bg-ext';
      }
    }
    return '';
  }

}
