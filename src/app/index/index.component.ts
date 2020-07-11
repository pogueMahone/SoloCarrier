import { Component, OnInit } from '@angular/core';
import {ItemService} from '../shared/services/item.service';
import {ConfigService} from '../shared/services/config.service';
import {GoogleTagService} from '../shared/services/google-tag.service';
import {JsonLdTagService} from '../shared/services/json-ld-tag.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
favorites: Array<any>;
returnUrl:string;
config: any;
  constructor(private json_ld_tag: JsonLdTagService, private iS : ItemService, private configService: ConfigService) { 
    this.returnUrl = '/';
  }

  ngOnInit(): void {
    this.getFavorites();
    this.configService.getConfig().subscribe(config =>{
      this.config = config;
    });
    // setTimeout(() => {
    //   this.toastr.info('FYI!','All prices include applicable taxes and deposits.');
    // }, 1000);
  }

  private getFavorites(){
    this.iS.getFavorites().subscribe(response => {
      this.favorites = response;  
      // this.favorites.forEach(fav => {
      //   fav['url'] = `catalogue/item/${this.replaceSpaces(fav.brand)}/${this.replaceSpaces(fav.name)}/${fav.id}`;
      // }); 
      this.json_ld_tag.setItemListTag(this.favorites);
    }, error => {

      }
    );
  }

  private replaceSpaces(n:string ){
    return n.replace(/\s/g, '-');
  }

}
