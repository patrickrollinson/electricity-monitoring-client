import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../../auth.service';
import { ClientService } from './../../../client.service';

import { DashboardComponent } from './../dashboard.component';

@Component({
    selector: 'settings',
    templateUrl: './emmSettings.component.html',
    styleUrls: ['./emmSettings.component.css']
})

export class EmmSettingsComponent {
    public emmDetails;
    public clientId: string;
    public emmId: string;

    public openAddCircuitView = false;
    private openAddLimitView = false;
    //ports
    private portTable
    private portTableData

    //limits
    private limitTable
    private limitTableData = []

    private addCtDetails

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private client: ClientService,
        private auth: AuthService,
    ) {
        this.emmId = route.snapshot.params.emmId;
        this.clientId = auth.id
    }

    ngOnInit() {
        this.client.getEmmDetails(this.clientId, this.emmId).subscribe(emmDetails => {
            this.emmDetails = emmDetails['emmDetails'];
            this.generatePortsTable()
          })
    }

    generatePortsTable() {
        this.portTableData = [];
        for (let i = 0; i < this.emmDetails.ports; i++) {
            let portTableRow = { port: i + 1, circuit_name: "", circuit_id: "" };
            this.portTableData.push(portTableRow);
        }
        for (let p = 0; p < this.emmDetails.ports_active.length; p++) {
            let currPort = this.emmDetails.ports_active[p].port;
            this.portTableData[currPort].circuit_id = this.emmDetails.ports_active[p].ctId._id;
            this.portTableData[currPort].circuit_name = this.emmDetails.ports_active[p].ctId.circuit_name;
        }
        this.portTable = new MatTableDataSource(this.portTableData);
    }

    openUpdateEmm() {
        let url = '/client/' + this.clientId + '/emm/' + this.emmId + "/update";
        this.router.navigate([url]);
    }

    

    

    

    
}


