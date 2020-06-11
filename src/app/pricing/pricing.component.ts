import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'pricing',
  templateUrl: './pricing.component.html',
  styleUrls:['./pricing.component.css']
})
export class PricingComponent {
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