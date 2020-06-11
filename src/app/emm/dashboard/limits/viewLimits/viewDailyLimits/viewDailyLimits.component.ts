import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { JsonPipe } from '@angular/common';

import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../../../../auth.service';
import { ClientService } from './../../../../../client.service';

import { DashboardComponent } from '../../../dashboard.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from'
import { scan, filter, map, reduce } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import { validateConfig } from '@angular/router/src/config';

@Component({
    selector: 'view-daily-limits',
    templateUrl: './viewDailyLimits.component.html',
    styleUrls: ['./viewDailyLimits.component.css']
})

export class ViewDailyLimitsComponent {
    @Input() public ctId;
    @Input() public dayLimits;
    @Input() public viewingMonth;

    public costValue
    @Output() viewMonthLimits: EventEmitter<string> = new EventEmitter<string>();
    // @Output() clickUpdateLimitEvent: EventEmitter<string> = new EventEmitter<string>();
    public clientId: string;
    public emmId: string;

    public dayReports = [];
    public mainsMonthUsage

    // public dayLimits 
    // public monthLimits

    // public openAddCircuitView = false;
    // private openAddLimitView = false;

    // //limits
    // public limitTable
    public dayLimitsTable = []

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private client: ClientService,
        private auth: AuthService,
    ) {
        console.log('viewDailyLimits Component')
        this.emmId = route.snapshot.params.emmId;
        this.clientId = auth.id
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.viewingMonth && this.dayLimits){
            console.log("this.viewingMonth: ", this.viewingMonth)
            console.log("this.dayLimits: ", this.dayLimits)
            this.viewingMonth['daysInMonth'] = moment().month(this.viewingMonth.date.month).daysInMonth();
            console.log("this.monthLimit.daysInMonth: ", this.viewingMonth.daysInMonth)
            let start = moment().month(this.viewingMonth.date.month).startOf('month').unix() * 1000 - 1;
            let end = moment().month(this.viewingMonth.date.month).endOf('month').unix() * 1000;
            this.dayReports = [];
            this.client.getDayReports(this.clientId, this.emmId, start, end).subscribe(val => {
                console.log(val);
                let circuits = val['circuits']
                console.log('mainsCircuit: ', circuits);
                let mainsCircuits = circuits[0].readings
                Observable.from(mainsCircuits)
                    .pipe(reduce((acc, curr) => acc + ((curr['y'] * (24 / 1000)) * 2.05), 0))
                    .subscribe(val => this.mainsMonthUsage = Math.round(val * 100)/100)

                Observable.from(mainsCircuits)
                    .pipe(map((day) => {
                        return {t : moment(day['t']), y: day['y'] * (24 / 1000) * 2.05}
                    }))
                    .subscribe(val => this.dayReports.push(val))
              
                console.log('this.mainsMonthUsage: ', this.mainsMonthUsage);
                console.log('this.dayReports: ', this.dayReports);
                this.dayLimitsTable = [ ];
                this.generateDayLimitsTable()
            })
            
        }
    }
    
    // clickAddLimit(month): void {
    //     this.clickAddLimitEvent.emit(month);
    // }
    // clickUpdateLimit(id): void {
    //     this.clickUpdateLimitEvent.emit(id);
    // }

    generateDayLimitsTable() {
        this.dayLimitsTable = [];
        let month = this.viewingMonth.date.month;
        this.viewingMonth.dailyAverage = Math.round((this.mainsMonthUsage / this.viewingMonth.daysInMonth) * 100 ) / 100
        for (let d = 1; d <= this.viewingMonth.daysInMonth; d++) {
            let limit = {
                name: moment().date(d).month(month).year(2018).format("dddd, DD MMMM"),
                past: null,
                today: null,
                future: null, 
                activity: 'none',
                actual: 0,
                budget: null,
                budget_status: null, 
                limit: null,
                explicit: null, 
                date: {
                    date: d,
                    week: null,
                    month: month,
                    year: 2018
                },
            }
            if( moment().date(d).month(month).year(2018).isAfter(moment(), 'day')){
                limit.future = true;
            }
            if( moment().date(d).month(month).year(2018).isBefore(moment(), 'day')){
                limit.past = true
            }
            if( moment().date(d).month(month).year(2018).isSame(moment(), 'day')){
                limit.today = true
            }
            this.dayLimitsTable.push(limit);
        }
        if (this.viewingMonth.value) {
            this.addDayReports()
            this.createExplicitLimits()
            this.createImplicitLimits()
        }
        console.log('this.dayLimitsTable: ', this.dayLimitsTable)
    }

    addDayReports(){
        if(this.viewingMonth.date.month)
        for(let i = 0; i < this.dayReports.length; i++){
            let date = this.dayReports[i].t.date(); 
            let month = this.dayReports[i].t.month();
            this.dayLimitsTable[ date - 1 ].actual = Math.round(this.dayReports[i].y *100)/100;
        }
    }

    createExplicitLimits() {
        //limitsInMonth
        this.viewingMonth.dayLimits = this.dayLimits.filter((limit) => {
            if (limit.date.month === this.viewingMonth.date.month) {
                return limit
            }
        })

        for (let l = 0; l < this.viewingMonth.dayLimits.length; l++) {
            let date = this.viewingMonth.dayLimits[l].date.date;
            this.dayLimitsTable[date - 1].limit = this.viewingMonth.dayLimits[l];
            this.dayLimitsTable[date - 1].budget = this.viewingMonth.dayLimits[l].cost_value;
            this.dayLimitsTable[date - 1].explicit = true;
        }
    }

    createImplicitLimits() {
        //implicit limit calcs

        //if monthLimit is set -> test if exceeded limit 
        if(this.viewingMonth.value){
            console.log('this.viewingMonth.value set :', this.viewingMonth.value)
            if(this.viewingMonth.cost_value > this.mainsMonthUsage){
                let month = moment().month(this.viewingMonth.date.month);
                console.log('month: ', month);
                console.log('Month limit not exceeded')
                console.log('Set implicit limits')
                let allMonthExplLimits  = this.dayLimitsTable.filter( day => {
                    if(day.explicit === true){
                        return day
                    }
                })
                console.log('allMonthExplLimits: ', allMonthExplLimits)
                let allFutureExplLimits = allMonthExplLimits.filter(lim => {
                    if(moment().isSameOrBefore(moment(lim.limit.start), 'day')){
                        return lim
                    }
                })
                console.log('allFutureExplLimits: ', allFutureExplLimits);
                let totalCVFutureExplLim = allFutureExplLimits.reduce((acc, lim ) => {
                    console.log('totalCVFutureExplLim: ', lim.limit)
                    return acc + lim.limit.cost_value
                }, 0)


                let daysInMonth = month.daysInMonth();
                console.log('daysInMonth: ', daysInMonth)
                let calcDaysRemainingInMonth = () =>{
                    if(moment().isSame(month, 'month')){
                        let currDate = moment().date()
                        return daysInMonth - currDate;
                    }
                    else{
                        return daysInMonth
                    }
                }
                let daysRemainingInMonth = calcDaysRemainingInMonth()     
                console.log('daysRemainingInMonth: ', daysRemainingInMonth)
                console.log('monthLimt: ', this.viewingMonth.cost_value);
                console.log('totalFutureExplicitCostValue: ', totalCVFutureExplLim);
                console.log('mainMonthUsage: ', this.mainsMonthUsage)
                let totalImplicitCostValue = this.viewingMonth.cost_value - this.mainsMonthUsage - totalCVFutureExplLim;
                let dailyImplicitCostValue = Math.round((totalImplicitCostValue / daysRemainingInMonth) * 100)/100;
                console.log('dailyImplicitCostValue: ', dailyImplicitCostValue)
                console.log('totalImplicitCostValue: ', totalImplicitCostValue)
                for(let j = 0; j < this.dayLimitsTable.length; j ++ ){
                    if(this.dayLimitsTable[j].future ){
                        if(this.dayLimitsTable[j].explicit === null){
                            this.dayLimitsTable[j].explicit = false;
                            this.dayLimitsTable[j].budget  = dailyImplicitCostValue;
                            this.dayLimitsTable[j].limit = {
                                cost_value: dailyImplicitCostValue
                            }
                        }
                    }
                }
            }
            else{
                console.log('Month limit exceeded')
            }
        }
        else{
            console.log('no this.viewingMonth.value:',)
        }
    }

    clickSetLimit(limit) {
        //this.clickAddLimitEvent.emit(month);
        this.dayLimitsTable[limit.date.date - 1].activity = 'add';
        this.dayLimitsTable[limit.date.date - 1].addLimit = {
            date: limit.date,
            cost_value: limit.cost_value,
        }
        this.costValue = limit.cost_value
    }

    clickUpdateLimit(limit) {
        //this.clickAddLimitEvent.emit(month);
        console.log('clickUpdateLimit, limit: ', limit.limit)
        let index = limit.date.date - 1;
        this.costValue = limit.cost_value;
        this.dayLimitsTable[index].activity = 'edit';
        this.dayLimitsTable[index].editLimit = {
            id: limit.limit._id,
            date: limit.date,
            cost_value: this.costValue,
        }
    }

    cancelAddLimit(date){
        this.dayLimitsTable[date.date - 1].activity = 'none'; 
        this.dayLimitsTable[date.date - 1].addLimit = null;
    }

    clickViewMonthLimit(){
        console.log('clicked')
        this.viewMonthLimits.emit('clicked')
    }

    addLimit(date){
        //this.clickAddLimitEvent.emit(month);
        let index = date.date - 1
        this.dayLimitsTable[index].addLimit.cost_value = this.costValue
        console.log('addLimit: ', this.dayLimitsTable[index].addLimit)
        if(this.dayLimitsTable[index].addLimit.cost_value > 0){
            console.log('this.postLimit: ')
            this.postLimit(date, 'add', this.dayLimitsTable[index].addLimit)
        }else{
            console.log("addLimit() else")
        }
    }

    editLimit(date){
        //this.clickAddLimitEvent.emit(month);
        let index = date.date - 1
        this.dayLimitsTable[index].editLimit.cost_value =  this.costValue
        console.log('editLimit: ', this.dayLimitsTable[index].editLimit)
        if(this.dayLimitsTable[index].editLimit.cost_value > 0){
            console.log('this.postLimit: ')
            this.postLimit(date, 'edit', this.dayLimitsTable[index].editLimit)
        }else{
            console.log("addLimit() else")
        }
    }

    postLimit(date, action, formValues){
        console.log('formValues: ', formValues)
        let index = date.date - 1;
        let limitId = formValues.id;
        const limit = {
            type: 'day',
            value: formValues.cost_value  / 2.05,
            cost_value: formValues.cost_value,
        
            date: formValues.date.date,
            week: 0,
            month: formValues.date.month,
            year: formValues.date.year,
        
            start: moment().date(formValues.date.date).month(formValues.date.month).year(formValues.date.year).startOf('day'), 
            end: moment().date(formValues.date.date).month(formValues.date.month).year(formValues.date.year).endOf('day'), 
        }
        console.log("postLimit() limit: ", limit);
        if(action === 'add'){
            this.client.addLimit(this.clientId, this.emmId, this.ctId, limit).subscribe(limit => {
                this.dayLimits.push(limit);
                this.generateDayLimitsTable()
            })
        }
        if(action === 'edit'){
            console.log('postLimit edit')
            console.log(limitId)
            this.client.updateLimit(this.clientId, this.emmId, this.ctId, limitId,  limit).subscribe(updateStatus => {
                if(updateStatus['ok'] === 1){
                    let updatedLimitIndex = this.dayLimits.findIndex((limit)=>{ return limit._id == limitId })
                    console.log('updatedLimitIndex', updatedLimitIndex)
                    console.log('this.dayLimits[updatedLimitIndex]', this.dayLimits[updatedLimitIndex])
                    this.dayLimits[updatedLimitIndex].value = limit.value;
                    this.dayLimits[updatedLimitIndex].cost_value = limit.cost_value;
                    this.dayLimits[updatedLimitIndex].start = limit.start;
                    this.dayLimits[updatedLimitIndex].end = limit.end;
                    this.generateDayLimitsTable()
                }
                
            })
        }
        
        console.log("postLimit() this.monthLimitsTable[date.month].limit: ", this.dayLimitsTable[index].limit);
    }
    
}

