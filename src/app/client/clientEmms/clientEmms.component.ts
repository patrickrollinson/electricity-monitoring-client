import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from '../../auth.service';
import { ClientService } from '../../client.service';


@Component({
    selector: 'client-emms',
    templateUrl: './clientEmms.component.html',
    styleUrls: ['./clientEmms.component.css']
})
export class ClientEmmsComponent {
    private clientId: string;
    private emmId: string;
    private clientDetails;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private client: ClientService,
        private auth: AuthService,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer
    ) {
        this.clientId = auth.id;
        iconRegistry.addSvgIcon(
            'emm',
            sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/emm.svg')
        )
    }

    ngOnInit() {
        console.log("clientId: ", this.clientId);

        //get client details
        this.client.getClientDetails(this.clientId).subscribe(res => {
            console.log(res);
            this.clientDetails = res['clientDetails'];
            console.log('this.clientDetails: ', this.clientDetails);
            if (this.clientDetails.emms_installed.length === 1) {
                this.viewEmm(this.clientDetails.emms_installed[0]._id)
            }
            if (this.clientDetails.emms_installed.length === 0) {

            }
        });

    }

    viewUpdateClient() {
        this.router.navigate(['client/' + this.clientId + '/update']);
    }

    viewEmm(emmId) {
        this.router.navigate(['client/' + this.clientId + '/emm/' + emmId]);
    }

}