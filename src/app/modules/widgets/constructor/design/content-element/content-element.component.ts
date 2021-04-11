import { Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorDesignService } from '../../../services/widget-constructor-design.service';

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
})
export class ContentElementComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public widthImageStyle: string;
  @Input() public heightImageStyle: string;
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

  constructor(private widgetConstructorDesignService: WidgetConstructorDesignService) { }

  ngOnInit(): void {
  }

  public trackById(index, item) {
    return item.id;
  }

  public classNameImg() {
    return this.widgetConstructorDesignService
      .classNameImg(this.widget.guiprops.image, this.widget.guiprops.form, this.widget.guiprops.formExt.model.mainSettings);
  }

  public classNameImgMain() {
    return this.widgetConstructorDesignService.classNameImgMain(this.widget.guiprops.image);
  }

  public setVideoBGStyle() {
    if (($('.video-bg').width() !== 0) && ($('.video-bg').height() !== 0)) {
      if (($('.video-bg').width() / $('.video-bg').height()) >= (16 / 9)) {
        return 'wide-video-bg-ext';
      } else {
        return 'narrow-video-bg-ext';
      }
    }
    return '';
  }

  public colorPodStyles() {
    return {
      background: this.widget.guiprops.formExt.enable
        ? this.widget.guiprops.formExt.model.mainSettings.colorPod.rgbaColorPod
        : this.widget.guiprops.form.colorPod.rgbaColorPod,
      'border-bottom-left-radius': this.getColorPodBorderRadius(),
      'border-bottom-right-radius': this.getColorPodBorderRadius()
    };
  }

  private getColorPodBorderRadius() {
    if (this.widget.guiprops.formExt.model.mainSettings.visual.type === 1 ||
      this.widget.guiprops.form.visual === 'На всю ширину' || this.widget.guiprops.image.enable === false)
    {
      if ((this.widget.guiprops.image.place === 'Слева') || (this.widget.guiprops.image.place === 'Справа') ||
        (this.widget.guiprops.image.place === 'Сверху') || !this.widget.guiprops.image.enable)
      {
        return this.widget.guiprops.bg.borderRadius;
      }
      else {
        return '0';
      }
    }
    else {
      return '0';
    }
  }

}
