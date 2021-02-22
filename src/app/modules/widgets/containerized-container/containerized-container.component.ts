import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-containerized-container',
  templateUrl: './containerized-container.component.html',
  styleUrls: ['./containerized-container.component.scss']
})
export class ContainerizedContainerComponent implements OnInit {
  @Input() public container = {};
  @Input() private currentCompany = '';
  @Input() private site = '';

  public emptyName = '';
  public emptyDescription = '';

  constructor() {
    this.emptyName = $translate.instant("containerized.container.add.name");
    this.emptyDescription = $translate.instant("containerized.container.add.description");
  }

  ngOnInit(): void {
  }

  public openContainerCodeModal() {
    ModalService.showModal({
      templateUrl: "../js/widgets/containerized/container-code-modal/container-code-modal-template.html",
      controller: "ContainerCodeModalController",
      inputs: {
        currentSiteId: scope.site.id,
        containerId: scope.container.id
      }
    }).then(function (modal) {
      modal.element.modal();
      modal.close.then(function (result) {
        $("body").removeClass("modal-open");
        // TODO: Implement logic when close modal. Don't forget "result"
      });
    });
  }

  public removeContainer() {
    swal({
        title: $translate.instant("widgetsList.widget.delete.title"),
        text: $translate.instant("containerized.container.delete.text"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: $translate.instant("widgetsList.widget.delete.confirm"),
        cancelButtonText: $translate.instant("widgetsList.widget.delete.cancel"),
        closeOnConfirm: true,
        closeOnCancel: true },
      function(isConfirm){
        if (isConfirm) {
          CWidgetService.deleteWContainer(scope.site.id, scope.container.id).then(function() {
            EventsService.publish(EVENTS.updateWidgetsList, scope.site.id);
            toastr["success"]($translate.instant("containerized.container.delete.desc"), $translate.instant("widgetsList.widget.delete.done"));
          });
        }
      });
  }

  public getAllCount(type) {
    var allValue = 0;
    scope.container.widgets.forEach(function(item) {
      if (!item.widgetConversion) return;
      allValue = allValue + item.widgetConversion[type];
    });
    return allValue;
  }

  public getAllCConversion = function() {
    return $filter("number")(((100 * scope.getAllCount('target')) / scope.getAllCount('shows')), 2) + "%";
  }

  public addVariant() {
    ModalService.showModal({
      templateUrl: "../js/widgets/containerized/add-containerized-modal/add-containerized-modal-template.html",
      controller: "AddCWModalController",
      inputs: {
        currentSiteId: scope.site.id,
        containerId: scope.container.id,
        currentCompany: scope.currentCompany,
        template: containerizedTemplate,
        type: containerizedType
      }
    }).then(function (modal) {
      modal.element.modal();
      modal.close.then(function (result) {
        $("body").removeClass("modal-open");
        // TODO: Implement logic when close modal. Don't forget "result"
      });
    });
  }

}
