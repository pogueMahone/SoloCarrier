import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {AuthService} from '../../../shared/services/auth.service';
import {ItemService} from '../../../shared/services/item.service';
import {ConfigService} from '../../../shared/services/config.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})

export class AddItemComponent implements OnInit, OnDestroy {
  itemForm: FormGroup;
  private id : string;
  dateAvail:any;
  private sub:any;
  private photoUrl: string;
  private categories: any;
  constructor(private toastr: ToastrService, private route: ActivatedRoute, private formBuilder: FormBuilder, private aS: AuthService, private iS : ItemService, private config: ConfigService) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      'name': new FormControl('', Validators.required),
      'brand': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required),
      'description': new FormControl('', [Validators.required, Validators.maxLength(500)]),
      'imageUrl': new FormControl('', Validators.required),
      'size': new FormControl('', Validators.required),
      'sizeUOM': new FormControl('', Validators.required),
      'headline': new FormControl('', [Validators.required, Validators.maxLength(200)]),
      'price': new FormControl('', [Validators.required, Validators.min(0.01)]),
      'quantity': new FormControl('', [Validators.required, Validators.min(1)]),
      'isFavorite': new FormControl(false),
      'available': [null],
      'active': new FormControl(true),
      'rating': new FormControl(3, [Validators.max(5), Validators.min(1)])
    });
    this.sub = this.route.queryParams.subscribe((params) => {
      this.id = params['id'] || null;
      if(this.id != null){
        this.iS.getItem(this.id).subscribe(data => {
          if (data) {
            this.loadForm(data);
          }
        },
          error => {
            this.toastr.error('Error', 'An error occurred retrieving this item.  Please try again.')
          }
        );
      }
    });
   
  }

  private loadForm(item:any){
    this.itemForm.controls['name'].setValue(item.name);
    this.itemForm.controls['brand'].setValue(item.brand);
    this.itemForm.controls['category'].setValue(item.category);
    this.itemForm.controls['description'].setValue(item.description);
    this.itemForm.controls['imageUrl'].setValue(item.imageUrl);
    this.itemForm.controls['size'].setValue(item.size);
    this.itemForm.controls['sizeUOM'].setValue(item.sizeUOM);
    this.itemForm.controls['headline'].setValue(item.headline);
    this.itemForm.controls['price'].setValue(item.price);
    this.itemForm.controls['quantity'].setValue(item.quantity);
    this.itemForm.controls['isFavorite'].setValue(item.isFavorite);    
    this.itemForm.controls['active'].setValue(item.active);    
    this.itemForm.controls['rating'].setValue(item.rating);
    this.itemForm.controls['available'].setValue(item.available);
    this.dateAvail = item.available;    
  }

  uploadPhoto= (files) => {
    if (files.length === 0) {
      return;
    }   
    const fileToUpload = <File>files[0];
    const formData = new FormData();
    let progress = null;
    formData.append('file', fileToUpload, fileToUpload.name);    
    this.iS.postPhoto(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            //file.progress = Math.round(event.loaded * 100 / event.total);  
            progress = Math.round(event.loaded * 100 / event.total); 
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        //file.inProgress = false;  
        return of(`${fileToUpload.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {            
          this.itemForm.controls['imageUrl'].setValue(event.body.url); 
        }  
      }, error => {

      }); 
  }

  save(){    
    if(this.itemForm.valid){      
      let item = this.itemForm.value;   
      if(this.id){
        this.iS.updateItem(this.id, item).subscribe(resp => {
          this.toastr.success('Item Updated',`Item ${this.id} has been updated.`);
        },
        err => {
          this.toastr.error('Error',err);
        });
      } else{  
        this.iS.create(item).subscribe(
          d => {
            //this.postResponse.status = n.status;
            this.id = d['id'];   
            this.toastr.success('Item Saved',`Item ${this.id} has been added to the database.`);       
          },
          err => {
          this.toastr.error('Error',err);
          },
          () => {       
          //console.log('done');
          }
          
        );
      }
    }    
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

}
