import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  @Input() rating: number;
  @Input() total: number = 5;
  @Input() readonly: boolean = false;
  ratings: Array<any> = [];
  constructor() { }

  private set() {
    this.ratings.length = 0;
    for (var i = 0; i < this.total; i++) {      
      if (this.rating - i > 0)
        this.ratings.push(true);
      else {
        this.ratings.push(false);
      }
    }
  }

  ngOnInit() {
    this.set();
  }
  toggle(i: number): void {
    if (!this.readonly) {
      this.rating = i + 1;
      this.set();
    }
  }

}
