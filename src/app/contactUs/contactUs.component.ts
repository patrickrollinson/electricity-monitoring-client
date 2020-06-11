import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'contact-us',
  templateUrl: './contactUs.component.html',
  styleUrls:['./contactUs.component.css']
})
export class ContactUsComponent {
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