import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../auth.service';
import { ClientService } from './../../client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'emm-settings',
    templateUrl: './updateEmm.component.html',
    styleUrls: ['./updateEmm.component.css']
})

export class UpdateEmmComponent {
    public adminId: string; 
    public clientId: string; 
    public emmId : string;

    //emm details
    private updateEmmDetails;

    public updateEmmForm 

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private client: ClientService,
        private auth: AuthService,  
    ){
        this.clientId = auth.id;
        this.emmId= route.snapshot.params.emmId;
    }

    onSubmit(){ 
        this.client.updateEmm(this.clientId, this.emmId, this.updateEmmForm.value)  
    }

    ngOnInit(){
        console.log('Update')
        this.client.getEmmDetails(this.clientId, this.emmId).subscribe( res => {
            let updateEmmDetails = res['emmDetails'];
            console.log(updateEmmDetails);  
            this.updateEmmForm= new FormGroup({
                name: new FormControl(updateEmmDetails.name, Validators.required),
                description: new FormControl(updateEmmDetails.description),
                client: new FormControl(updateEmmDetails.client),
                installion_by: new FormControl(updateEmmDetails.installion_by),
                status: new FormControl(updateEmmDetails.status, Validators.required),
                hardware_version: new FormControl(updateEmmDetails.hardware_version),
                firmware_version: new FormControl(updateEmmDetails.firmware_version),
                ports: new FormControl(updateEmmDetails.ports)
            });
            console.log(this.updateEmmForm);
        });
    };
        
        
        
}

 


