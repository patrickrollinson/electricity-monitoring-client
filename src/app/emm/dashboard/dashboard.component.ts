import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from './../../auth.service';
import { ClientService } from './../../client.service';

import * as moment from 'moment';

@Component({
    selector: 'emm',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    private clientId: string;
    private emmId: string;
    public showGraphOptions; 

    public circuits;
    public format : string = 'cost';
    public view : string = 'graph';
    public tariff = 0.205;
    public energyReadings
    public costReadings

    ///timePeriod Selector vars
    public time
    public startTime 
    public finishTime 

    public pastXOptions
    public pastXSelected
    public pastXSelectedIndex

    public dayOptions
    public daySelected
    public daySelectedIndex

    public monthOptions
    public monthSelected
    public monthSelectedIndex

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        iconRegistry: MatIconRegistry, 
        sanitizer: DomSanitizer        
    ) {
        this.emmId = route.snapshot.params.emmId;
        this.clientId = auth.id;
        iconRegistry.addSvgIcon(
            'report',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/report.svg'));
        iconRegistry.addSvgIcon(
            'graph',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/graph.svg'));
        iconRegistry.addSvgIcon(
            'graphOptions',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/graphOptions.svg'));
        iconRegistry.addSvgIcon(
            'limits',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/limits.svg'));
        iconRegistry.addSvgIcon(
            'live',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/live.svg'));
    }

    ngOnInit() { 
        //time selector fucntions
        this.pastXInit()
        this.dayInit()
        this.monthInit()

        this.time = this.pastXOptions[0]
        this.startTime = this.time.start
        this.finishTime = this.time.finish 
        this.checkGraphOptions()
    }

    changeView(view){
        this.view = view;
        this.checkGraphOptions()
    }

    checkGraphOptions(){
        if(this.view === 'report' || this.view === 'graph'){
            this.showGraphOptions = true;
        }
        else{
            this.showGraphOptions = false;
        }
    }

    //timePeriod selection functions
    pastXInit(){
        this.pastXOptions = [
            {label: "Past 1 Hour", selected: 0, type:'1hour', start: moment().subtract(1, 'hours').unix() *1000, finish: moment().unix() *1000 },
            {label: "Past 2 Hours", selected: 0, type:'2hours', start: moment().subtract(2, 'hours').unix() *1000, finish: moment().unix() *1000}
        ] 
        this.pastXSelectedIndex = 0
        this.pastXSelected = this.pastXOptions[this.pastXSelectedIndex]
    }

    changePastX(bool){
        if(bool === 1){
            this.pastXSelectedIndex +=1 
            this.pastXSelected= this.pastXOptions[this.pastXSelectedIndex]
        }
        if(bool === 0){
            this.pastXSelectedIndex = this.pastXSelectedIndex - 1 
            this.pastXSelected = this.pastXOptions[this.pastXSelectedIndex]
        }
    }

    selectPastX(){
        this.pastXOptions[this.pastXSelectedIndex].selected = 1;
        this.time = this.pastXSelected;
        this.startTime = this.time.start
        this.finishTime = this.time.finish
    }
     
    //select day
    dayInit(){
        this.dayOptions = [
            {label: "Today", selected: 0, type:'day', start: moment().startOf('day').unix() *1000, finish:  moment().endOf('day').unix() *1000},
            {label: "Yesterday", selected: 0, type:'day', start: moment().startOf('day').subtract(1, 'days').unix() *1000, finish:  moment().endOf('day').subtract(1, 'days').unix() *1000}
        ] 
        for(let i = 2; i < 14; i++){
            let day = {
                label: moment().subtract(i, 'days').format("dddd, D MMMM"), 
                selected: 0,
                type: 'day',
                start: moment().startOf('day').subtract(i, 'days').unix() *1000,
                finish: moment().endOf('day').subtract( i, 'days').unix() *1000
            };
            this.dayOptions.push(day);
        }
        this.daySelectedIndex = 0
        this.daySelected = this.dayOptions[this.daySelectedIndex]
    }

    changeDay(bool){
        if(bool === 1){
            this.daySelectedIndex +=1 
            this.daySelected= this.dayOptions[this.daySelectedIndex]
        }
        if(bool === 0){
            this.daySelectedIndex = this.daySelectedIndex - 1 
            this.daySelected = this.dayOptions[this.daySelectedIndex]
        }
    }

    selectDay(){
        this.dayOptions[this.daySelectedIndex].selected = 1;
        this.time = this.daySelected
        this.startTime = this.time.start
        this.finishTime = this.time.finish
        //console.log(this.startTime)
    }

    //select month
    monthInit(){
        this.monthOptions = [] 
        for(let i = 0; i < 11; i++){
            let month = {
                label: moment().subtract(i, 'months').format("MMMM"),
                selected: 0,
                type:'month',
                start: moment().startOf('month').subtract(i, 'months').unix() *1000,
                finish: moment().endOf('month').subtract( i, 'months').unix() *1000
            };
            this.monthOptions.push(month);
        }
        this.monthSelectedIndex = 0
        this.monthSelected = this.monthOptions[this.monthSelectedIndex]
    }

    changeMonth(bool){
        if(bool === 1){
            this.monthSelectedIndex +=1 
            this.monthSelected= this.monthOptions[this.monthSelectedIndex]
        }
        if(bool === 0){
            this.monthSelectedIndex = this.monthSelectedIndex - 1 
            this.monthSelected = this.monthOptions[this.monthSelectedIndex]
        }
    }

    selectMonth(){
        this.monthOptions[this.monthSelectedIndex].selected = 1;
        this.time = this.monthSelected
        this.startTime = this.time.start
        this.finishTime = this.time.finish
    }

}



