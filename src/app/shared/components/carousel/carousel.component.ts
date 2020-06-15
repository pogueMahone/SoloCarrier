import { Component, OnInit, Input } from '@angular/core';
import {ItemService} from '../../services/item.service';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() itemList : Array<any>; 
  @Input() returnUrl : string; 
  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(private iS : ItemService, private cS: ConfigService) { 

  }

  ngOnInit(): void {    
    let chunkSize = 3;
    this.cS.isMobile.subscribe(m => {
      if(m){
        chunkSize = 1;
      }else{
        chunkSize = 3;
      }
      this.slides = this.chunk(this.itemList, chunkSize);
    });    
  }

}
