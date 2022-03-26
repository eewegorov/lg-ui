import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-redirect-element',
  templateUrl: './redirect-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './redirect-element.component.scss']
})
export class RedirectElementComponent implements OnInit, AfterViewInit {
  @Input() public widget: FullWidget;

  constructor() {
  }

  ngOnInit(): void {
    if (this.widget.guiprops.button.enable === true && this.widget.guiprops.form.enable === false) {
      this.widget.guiprops.formSet.redirect.enable = true;
    }
  }

  ngAfterViewInit(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
  }

  public validateRedirect(e) {
    const widgetInput = $(e.target).val();
    const widgetNameBtnDel = $('#removeWidgetRedirect');
    if (widgetInput === '') {
      widgetNameBtnDel.addClass('hide');
    } else {
      widgetNameBtnDel.removeClass('hide');
    }
  }

  public removeWidgetRedirect(e) {
    e.preventDefault();
    $('#widgetRedirectUrl').val('');
    this.widget.guiprops.formSet.redirect.url = '';
    $('#widgetRedirectUrl').change();
    $(e.target).addClass('hide');
  }

}
