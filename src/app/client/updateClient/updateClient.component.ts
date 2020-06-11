import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material';

import { ClientService } from './../../client.service';
import { AuthService } from './../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'emm-settings',
    templateUrl: './updateClient.component.html',
    styleUrls: ['./updateClient.component.css']
})

export class UpdateClientComponent {
    public clientId: string; 
    public emmId : string;

    public updateClientContactDetailsForm 
    public updateClientAddressForm 
    public updateClientSiteDetailsForm

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private client: ClientService,
        private auth: AuthService,  
    ){
        this.clientId = auth.id;
        this.emmId= route.snapshot.params.emmId;
    }

    onContactDetailsSubmit(){ 
        console.log(this.updateClientContactDetailsForm.value);
        this.client.updateClientContactDetails(this.clientId, this.updateClientContactDetailsForm.value)  
    }

    onSiteDetailsSubmit(){
        console.log(this.updateClientSiteDetailsForm.value);
        this.client.updateClientSiteDetails(this.clientId, this.updateClientSiteDetailsForm.value)
    }

    onAddressSubmit(){
        console.log(this.updateClientAddressForm.value);
        this.client.updateClientAddress(this.clientId, this.updateClientAddressForm.value)
    }

    ngOnInit(){
        console.log('Update')
        this.client.getClientDetails( this.clientId).subscribe( res => {
             let clientDetails = res['clientDetails'];
             console.log(clientDetails);  
            this.updateClientContactDetailsForm= new FormGroup({
                first_name: new FormControl(clientDetails.contact_details.first_name, Validators.required),
                family_name: new FormControl(clientDetails.contact_details.family_name, Validators.required),
                contact_number: new FormControl(clientDetails.contact_details.contact_number, Validators.required)
            });

            this.updateClientAddressForm= new FormGroup({
                country: new FormControl(clientDetails.address.country), //Residential / Commercial
                city: new FormControl(clientDetails.address.city),//Free standing home/ Town house/ Apartement
                suburb: new FormControl(clientDetails.address.suburb), //3 (Phase) / 1 (Phase)",
                street: new FormControl(clientDetails.address.street), //60 (Amperes)
                street_number: new FormControl(clientDetails.address.street_number), //300 (m^2)
                complex_name: new FormControl(clientDetails.address.complex_name), 
                unit_number: new FormControl(clientDetails.address.unit_number)     
            });

            this.updateClientSiteDetailsForm= new FormGroup({
                entity: new FormControl(clientDetails.site_details.entity), //Residential / Commercial
                dwelling_type: new FormControl(clientDetails.site_details.dwelling_type),//Free standing home/ Town house/ Apartement
                connection_type: new FormControl(clientDetails.site_details.connection_type), //3 (Phase) / 1 (Phase)",
                main_breaker_size: new FormControl(clientDetails.site_details.main_breaker_size), //60 (Amperes)
                dwelling_area: new FormControl(clientDetails.site_details.dwelling_area), //300 (m^2)
                occupants: new FormControl(clientDetails.site_details.occupants), 
                bedrooms: new FormControl(clientDetails.site_details.bedrooms),
                bathrooms: new FormControl(clientDetails.site_details.bathrooms),
                pool_volume: new FormControl(clientDetails.site_details.pool_volume),
                stove_top_type: new FormControl(clientDetails.site_details.stove_top_type),
                under_floor_heating: new FormControl(clientDetails.site_details.under_floor_heating),
                comment: new FormControl(clientDetails.site_details.comment),
                db_location: new FormControl(clientDetails.site_details.db_location),
            });
            console.log(this.updateClientContactDetailsForm);
        });
    };
        
    
        
}

 


