import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { DashboardComponent } from '../../dashboard.component';

@Component({
    selector: 'circuits',
    templateUrl: './circuits.component.html',
    styleUrls: ['./circuits.component.css']
})

export class CircuitsComponent {
    @Input() public emmDetails;
    public adminId: string;
    public clientId: string;
    public emmId: string;

    public circuitView = 'viewCircuits';
    private circuitToUpdate 
    private portToUpdate

    public circuitPort
    public updateCircuit 
   
    //limits
    private circuitTable
    private circuitTableData = []


    ngOnChanges(changes: SimpleChanges) {
        
    }
    changeCircuitView(limitView: string):void {
        this.circuitView = limitView
    }

    addCircuitInit(port: number): void{
        this.circuitPort = port;
        this.circuitView = 'addCircuit';
    }

    updateCircuitInit(circuitToUpdate: object): void {
        for(let i = 0; i < this.emmDetails.ports_active.length; i ++){
            let id = circuitToUpdate['id'];
            let port = circuitToUpdate['port'];
            if(this.emmDetails.ports_active[i].ctId._id === id){
                this.circuitToUpdate = this.emmDetails.ports_active[i].ctId;
                this.portToUpdate = port
                this.circuitView = 'updateCircuit';
            }
            
        }
        
        
        
    }

}
