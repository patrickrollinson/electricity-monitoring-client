import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../../../../auth.service';
import { ClientService } from './../../../../../client.service';

import { DashboardComponent } from '../../../dashboard.component';

@Component({
    selector: 'view-circuits',
    templateUrl: './viewCircuits.component.html',
    styleUrls: ['./viewCircuits.component.css']
})

export class ViewCircuitsComponent {
    @Input() public emmDetails;
    @Output() clickAddCircuitEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickUpdateCircuitEvent: EventEmitter<object> = new EventEmitter<object>();

    //ports
    public portTable
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
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer
    ) {
        iconRegistry.addSvgIcon(
            'mains',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/mains.svg'));
        iconRegistry.addSvgIcon(
            'plugs',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/plugs.svg'));
        iconRegistry.addSvgIcon(
            'lights',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/lights.svg'));
        iconRegistry.addSvgIcon(
            'stove',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/stove.svg'));
        iconRegistry.addSvgIcon(
            'heating',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/heating.svg'));
        iconRegistry.addSvgIcon(
            'under_floor_heating',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/under_floor_heating.svg'));
        iconRegistry.addSvgIcon(
            'electric_fence',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/electric_fence.svg'));
        iconRegistry.addSvgIcon(
            'jacuzzi',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/jacuzzi.svg'));
        iconRegistry.addSvgIcon(
            'pump',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/pump.svg'));
        iconRegistry.addSvgIcon(
            'pool',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/circuit/pool.svg'));
    }
   
    ngOnChanges(changes: SimpleChanges) {
        this.generateCircuitsTable()
    }

    clickAddCircuit(port): void {
        this.clickAddCircuitEvent.emit(port);
    }
    clickUpdateCircuit(id, port): void {
        let circuitToUpdate = {
            id: id,
            port: port
    }
        this.clickUpdateCircuitEvent.emit(circuitToUpdate);
    }

    generateCircuitsTable() {
        this.portTableData = [];
        for (let i = 0; i < this.emmDetails.ports; i++) {
            let portTableRow = { port: i + 1, name: "", id: "" , type: ""};
            this.portTableData.push(portTableRow);
        }
        for (let p = 0; p < this.emmDetails.ports_active.length; p++) {
            let currPort = this.emmDetails.ports_active[p].port;
            this.portTableData[currPort - 1].id = this.emmDetails.ports_active[p].ctId._id;
            this.portTableData[currPort - 1].name = this.emmDetails.ports_active[p].ctId.circuit_name;
            this.portTableData[currPort - 1].type = this.emmDetails.ports_active[p].ctId.circuit_type;
        }
        this.portTable = new MatTableDataSource(this.portTableData);
    }
}

