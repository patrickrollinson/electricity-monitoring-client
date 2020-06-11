import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../../../auth.service';
import { ClientService } from './../../../../client.service';

import { DashboardComponent } from '../../dashboard.component';

@Component({
    selector: 'view-limits',
    templateUrl: './viewLimits.component.html',
    styleUrls: ['./viewLimits.component.css']
})

export class ViewLimitsComponent {
    @Input() public emmDetails;
    @Input() public dayLimits;
    @Input() public monthLimits;
    
    public ctId  

    private viewLimitsView = 'view';
    public viewType = 'month';

    public addMonthLimit
    public monthLimit

    //limits
    public limitTable
    private limitTableData = []

    ngOnChanges(changes: SimpleChanges) {
        //console.log('viewLimits Component')
        //this.generateLimitsTable()
        this.ctId = this.emmDetails.ports_active[0].ctId._id;
        let currMonth = moment().get('month')
        if(this.monthLimits){
            this.monthLimit = this.monthLimits.find((limit)=>{
                if(limit.date.month === currMonth){
                    return limit
                }
            }); 
        }
        
    }

    addMonthLimitInit(month){
        //console.log('addMonthLimitInit() ', month)
        this.addMonthLimit = {
            date: {
                date: null,
                week: null,
                month: month,
                year: 2018
            }
        }
        //console.log('viewLimits addMonthLimit: ', this.addMonthLimit)
        this.viewLimitsView = 'addLimit'
    }

    changeViewMonth(str){
        console.log('recieved')
        this.viewType = 'month';
    }
    
    changeViewMonthDaily(month){
        let monthLimit = this.monthLimits.find((limit)=>{return limit.date.month === month})
        //console.log('monthLimit: ', monthLimit)
        this.monthLimit = createMonthLimit(monthLimit);
        this.viewType = 'day';
        
        function createMonthLimit(monthLimit){
            if(monthLimit){
                return monthLimit
            }
            else{
                return {
                    date:{
                        date: null,
                        week: null,
                        month: month,
                        year: moment().year()
                    }
                }
            }
        }
        
    }
}

