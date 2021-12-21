import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const IMAGE_DEF = 'https://static.leadgenic.com/lg_widgets_l11/img/image_def.jpg';

@Component({
  selector: 'app-image-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './image-element.component.scss']
})
export class ImageElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;
  @Input() public widthHrType: string[];
  @Input() public floatBtn: string[];

  @Output() private listFileItem = new EventEmitter<{place: string, item: any}>();

  constructor() { }

  ngOnInit(): void {
  }

  public listFile(place, item): void {
    this.listFileItem.emit({ place, item });
  }

  public isDefault(url: string): boolean {
    return url === IMAGE_DEF;
  }

  public removeImage(): void {
    this.modelName.imageUrl = IMAGE_DEF;
  }

}
