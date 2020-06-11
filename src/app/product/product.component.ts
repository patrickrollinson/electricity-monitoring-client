import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls:['./product.component.css']
})
export class ProductComponent {
  constructor(
    private log: LoggingService,
  ){}
  ngOnInit(){
    this.log.postUnauthUserActivity({activity:'load home page'})
  }
  
  logClick(clicked: string){
    console.log('logClick(): ', clicked)
    //this.log.postUnauthUserActivity({activity:clicked})
  }
}