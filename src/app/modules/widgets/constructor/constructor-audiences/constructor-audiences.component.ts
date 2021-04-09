import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-constructor-audiences',
  templateUrl: './constructor-audiences.component.html',
  styleUrls: ['./constructor-audiences.component.scss']
})
export class ConstructorAudiencesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public addNewAudience() {
    $scope.audience = {
      name       : '',
      description: '',
      groups: [],
      sites: [],
      "widgetId": $scope.wid
    };
    $scope.audienceMode = $scope.MODE_ITEM;
  }

  public editAudience(item) {
    $scope.audience = item;
    $scope.audienceMode = $scope.MODE_ITEM;
  }


  public deleteAudience(item) {
    swal({
        title: $scope.localization.audience.delete.title,
        text: $scope.localization.audience.delete.text,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: $scope.localization.audience.delete.confirm,
        cancelButtonText: $scope.localization.audience.delete.cancel,
        closeOnConfirm: false,
        closeOnCancel: true },
      function(isConfirm){
        if (isConfirm) {
          $http({
            method: 'POST',
            url: "/audience/delete",
            data: $.param({'aid':item.id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
            .success(function() {
              for (var i = 0; i < $scope.audiences.length; i++) {
                if ($scope.audiences[i].id === item.id) {
                  $scope.audiences.splice(i, 1);
                  break;
                }
              }
              swal($scope.localization.audience.delete.done, "", "success");
            });
        }
      });
  }

  public getCroppedString(str, count, addedSymbol) {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }

    return str;
  }

  public saveAudience() {
    if ($("#audiences-item .has-error").size() > 0) {
      swal($scope.localization.audience.save.error.title, $scope.localization.audience.save.error.desc, "error");
      return;
    }

    $http({
      method: 'POST',
      url: "/audience/save",
      data: angular.toJson($scope.audience),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
      .success(function(data) {
        if (typeof $scope.audience.id == "undefined") {
          $scope.audiences.push(data);
        }
        $scope.audience = data;
        toastr["success"]($scope.localization.audience.save.done.desc, $scope.localization.audience.save.done.title);
      }).error(function(data) {
      console.log(data);
    });
  }

  public removeItem(group, index) {
    for (var i = 0; i < $scope.audience.groups.length; i++) {
      if ($scope.audience.groups[i].$$hashKey === group) {
        $scope.audience.groups[i].items = removeFromArray($scope.audience.groups[i].items, index);

        if ($scope.audience.groups[i].items.length == 0) {
          $scope.audience.groups = removeFromArray($scope.audience.groups, i);
        }
        return;
      }
    }
  }

  public removeSubItem(groupId, itemId, index) {
    for (var i = 0; i < $scope.audience.groups.length; i++) {
      if ($scope.audience.groups[i].$$hashKey === groupId) {

        for (var j = 0; j < $scope.audience.groups[i].items.length; j++) {
          if ($scope.audience.groups[i].items[j].$$hashKey === itemId) {
            $scope.audience.groups[i].items[j].subitems = removeFromArray($scope.audience.groups[i].items[j].subitems, index);

            if ($scope.audience.groups[i].items[j].subitems.length == 0) {
              $scope.removeItem($scope.audience.groups[i].$$hashKey, j);
            }

            return;
          }
        }

        return;
      }
    }
  }

}
