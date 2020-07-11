import {Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {  
  @Input() items: any;
  @Input() parent_name: string;
  @ViewChild('childMenu', {static: true}) public childMenu: any;
  @Output() filterChange = new EventEmitter();
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  filter(item:any){    
    let tags = new Array<string>();
    if(item){
      tags.push(item.name);
    }    
    tags.push(this.parent_name);
    this.filterChange.emit(tags);    
  }

  filterChanged(tags:string[]){  
    tags.push(this.parent_name);
    this.filterChange.emit(tags);    
  }
}
