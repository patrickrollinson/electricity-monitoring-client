import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { MatTableDataSource } from '@angular/material';

import { AuthService } from './../../../../../auth.service';
import { ClientService } from './../../../../../client.service';

import { DashboardComponent } from '../../../dashboard.component';

@Component({
    selector: 'view-monthly-limits',
    templateUrl: './viewMonthlyLimits.component.html',
    styleUrls: ['./viewMonthlyLimits.component.css']
})

export class ViewMonthlyLimitsComponent {
    @Input() public ctId;
    @Input() public monthLimits;
    @Output() clickAddLimitEvent: EventEmitter<string> = new EventEmitter<string>();
    //@Output() clickUpdateLimitEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickViewMonthDailyEvent: EventEmitter<number> = new EventEmitter<number>();

    public clientId: string;
    public emmId: string;

    public costValue

    public openAddCircuitView = false;
    private openAddLimitView = false;

    private monthLimitsTable = []

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private client: ClientService,
        private auth: AuthService,
    ) {
        this.emmId = route.snapshot.params.emmId;
        this.clientId = auth.id
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.monthLimits){
            this.monthLimitsTable = [];
            //console.log('this.monthLimits: ', this.monthLimits)
            this.generateMonthLimitsTable()
        }
    }
    
    createAddLimitForm() {
        //console.log("Form")
        // this.addLimitForm = this.fb.group({
        //     costValue: [0, Validators.required],
        //     date: [this.addLimit.date.date, Validators.required],
        //     week: [this.addLimit.date.week, Validators.required],
        //     month: [this.addLimit.date.month, Validators.required],
        //     year: [this.addLimit.date.year, Validators.required]
        // });
    }

    clickSetLimit(date): void {
        //this.clickAddLimitEvent.emit(month);
        this.monthLimitsTable[date.month].activity = 'add'; 
        this.monthLimitsTable[date.month].addLimit = {
            date: date,
            cost_value: null,
        }
    }

    clickUpdateLimit(month) {
        //this.clickAddLimitEvent.emit(month);
        //console.log('clickUpdateLimit, limit: ', limit.limit)
        let index = month.date.month;
        this.costValue = month.limit.cost_value;
        this.monthLimitsTable[index].activity = 'edit';
        this.monthLimitsTable[index].editLimit = {
            id: month.limit._id,
            date: month.date,
            cost_value: this.costValue,
        }
    }

    cancelAddLimit(date){
        this.monthLimitsTable[date.month].activity = 'none'; 
        this.monthLimitsTable[date.month].addLimit = null
    }

    addLimit(date){
        //this.clickAddLimitEvent.emit(month);
        this.monthLimitsTable[date.month].activity = 'add'; 
        this.monthLimitsTable[date.month].addLimit = {
            date: date,
            cost_value: this.costValue
        }
        //console.log('addLimit: ', this.monthLimitsTable[date.month].addLimit)
        if(this.monthLimitsTable[date.month].addLimit.cost_value > 0){
            this.postLimit(date, 'add', this.monthLimitsTable[date.month].addLimit)
        }else{
            //console.log("addLimit() else")
        }
        
    }
    
    editLimit(date){
        //this.clickAddLimitEvent.emit(month);
        let index = date.month
        this.monthLimitsTable[index].editLimit.cost_value =  this.costValue
       //console.log('editLimit: ', this.monthLimitsTable[index].editLimit)
        if(this.monthLimitsTable[index].editLimit.cost_value > 0){
            //console.log('this.postLimit: ')
            this.postLimit(date, 'edit', this.monthLimitsTable[index].editLimit)
        }else{
            //console.log("addLimit() else")
        }
    }

    viewMonthDaily(month){
        this.clickViewMonthDailyEvent.emit(month);
    }

    postLimit(date, action, formValues){
        //console.log('formValues: ', formValues)
        let index = date.month;
        let limitId = formValues.id;
        const limit = {
            type: 'month',
            value: formValues.cost_value  / 2.05,
            cost_value: formValues.cost_value,
        
            date: 0,
            week: 0,
            month: formValues.date.month,
            year: formValues.date.year,
        
            start: moment().month(formValues.date.month).year(formValues.date.year).startOf('day'), 
            end: moment().month(formValues.date.month).year(formValues.date.year).endOf('day'), 
        }
        //console.log("postLimit() limit: ", limit);
        if(action === 'add'){
            this.client.addLimit(this.clientId, this.emmId, this.ctId, limit).subscribe(limit => {
                this.monthLimits.push(limit);
                this.generateMonthLimitsTable()
            })
        }
        if(action === 'edit'){
            //console.log('postLimit edit')
            //console.log(limitId)
            this.client.updateLimit(this.clientId, this.emmId, this.ctId, limitId, limit).subscribe(updateStatus => {
                if(updateStatus['ok'] === 1){
                    let updatedLimitIndex = this.monthLimits.findIndex((limit)=>{ return limit._id == limitId })
                    //console.log('updatedLimitIndex', updatedLimitIndex)
                    //console.log('this.dayLimits[updatedLimitIndex]', this.monthLimits[updatedLimitIndex])
                    this.monthLimits[updatedLimitIndex].value = limit.value;
                    this.monthLimits[updatedLimitIndex].cost_value = limit.cost_value;
                    this.monthLimits[updatedLimitIndex].start = limit.start;
                    this.monthLimits[updatedLimitIndex].end = limit.end;
                    this.generateMonthLimitsTable()
                }
                
            })
        }
    }

    generateMonthLimitsTable() {
        
        for (let m = 0; m < 12; m++) {
            let currentMonth = moment().get('month')
            let limit = {
                name: moment().month(m).format("MMMM YYYY"),
                past: null,
                today: null,
                future: null,
                date: {
                    date: null,
                    week: null,
                    month: m,
                    year: 2018
                },
                activity: 'none',
                budget: null,
                budget_status: null, 
                actual: 0,
                explicit: null, 
                limit: null,
                addLimit: null,
                editLimit: null
            }
            if( moment().month(m).year(2018).isAfter(moment(), 'month')){
                limit.future = true;
            }
            if( moment().month(m).year(2018).isBefore(moment(), 'month')){
                limit.past = true
            }
            if( moment().month(m).year(2018).isSame(moment(), 'month')){
                limit.today = true
            }

            this.monthLimitsTable.push(limit);
        }
        
        for(let l = 0; l < this.monthLimits.length; l++){
            //console.log('monthLimits[l]: ', this.monthLimits[l])
            let month = this.monthLimits[l].date.month
            //console.log('month', month)
            this.monthLimitsTable[month].explicit = true; 
            this.monthLimitsTable[month].budget = this.monthLimits[l].cost_value
            this.monthLimitsTable[month].limit = this.monthLimits[l]
        }
    }
}
