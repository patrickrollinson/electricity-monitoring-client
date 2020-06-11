import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ClientService } from '../../client.service';


@Component({
  selector: 'client-profile',
  templateUrl: './clientProfile.component.html',
  styleUrls: ['./clientProfile.component.css']
})
export class ClientProfileComponent {
    private clientId: string; 
    private emmId: string;
    public clientDetails;

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private client: ClientService,
        private auth: AuthService,  
    ){
        this.clientId = auth.id 
    }

    ngOnInit(){
        console.log("clientId: ", this.clientId);

        //get client details
        this.client.getClientDetails( this.clientId).subscribe( res => {
            console.log(res);
            this.clientDetails = res['clientDetails'];
            console.log('this.clientDetails: ', this.clientDetails); 
        });
    }

    viewUpdateClient(){
        this.router.navigate(['client/' + this.clientId + '/update']);
    }

    viewEmm(emmId){
        this.router.navigate(['client/' + this.clientId + '/emm/'+ emmId]);
        
    }
  
}