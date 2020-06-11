import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from './../../../../auth.service';
import { ClientService } from './../../../../client.service';

import { JsonPipe } from '@angular/common';

import * as moment from 'moment';
import Chart from 'chart.js'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from'
import { scan } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import { filter, map } from 'rxjs/operators';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'active-limits',
  templateUrl: './activeLimits.component.html',
  styleUrls: ['./activeLimits.component.css']
})

export class ActiveLimitsComponent {
  @Input() public activeLimit;
  @Input() public activeType;
  public emmId
  public clientId

  public loading: boolean = true;

  public dayLimits
  public monthLimits

  public currCumul = 100;
  public current = {
    cost: null, 
    energy: null,
    percent: null,
    percentStr: null,
    status: null
  }
  public projected = {
    cost: null, 
    energy: null,
    percent: null,
    percentStr: null,
    status: null
  }

  public mainsCumul = null;
  public mainsCumulValues = [];
  public projectedValue

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private client: ClientService,
    private auth: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.emmId = route.snapshot.params.emmId;
    this.clientId = auth.id;
  }

  ngOnChanges() {
    //console.log("Limits Tab")
    if (this.activeType === 'day' && this.activeLimit !== undefined) {
      this.loading = true;
      let start = moment().startOf('day').unix()
      let end = moment().endOf('day').unix()
      this.client.getFiveMinReports(this.clientId, this.emmId, start, end).subscribe(readings => {
        this.mainsCumulValues = [];
        let circuits = readings['circuits']
        let mainsCircuits = circuits[0].readings
        let mains$ = Observable.from(mainsCircuits).pipe(scan((acc, curr) => acc + ((curr['y'] / 12000)*2.05), 0))
        let mainsCumulValues = mains$.subscribe(val => this.mainsCumulValues.push(val))
        this.mainsCumul = [];
        for (let i = 0; i < mainsCircuits.length; i++) {
          this.mainsCumul.push({
            t: mainsCircuits[i].t,
            y: this.mainsCumulValues[i]
          })
        }
        this.setCurrent()
        this.setProjected()
        this.loading = false;
      })
    }
    if (this.activeType === 'month' && this.activeLimit) {
      let start = moment().startOf('month').unix()
      let end = moment().endOf('month').unix()
      //this.calculatePercent(this.activeLimit.start_value, this.activeLimit.end_value, this.currCumul)
      this.client.getHourReports(this.clientId, this.emmId, start, end).subscribe(readings => {
        this.mainsCumulValues = [];
        let circuits = readings['circuits']
        let mainsCircuits = circuits[0].readings
        let mains$ = Observable.from(mainsCircuits).pipe(scan((acc, curr) => acc + ((curr['y'] / 1000)* 2.05), 0))
        let mainsCumulValues = mains$.subscribe(val => {
          this.mainsCumulValues.push(val);
        })
        this.mainsCumul = [];
        for (let i = 0; i < mainsCircuits.length; i++) {
          this.mainsCumul.push({
            t: mainsCircuits[i].t,
            y: this.mainsCumulValues[i]
          })
        }
        this.setCurrent()
        this.setProjected()
        this.loading = false;
        //console.log('Active Limit: ', JSON.stringify(this.activeLimit, null, 4))
        //console.log('Current: ',JSON.stringify(this.current, null, 4), 'Projected: ', JSON.stringify(this.projected,null, 4))
      })
    }
  }

  changeLimitView(type) {
    this.activeType = type;
  }

  calculatePercent(curr, value) {
    let percent = curr / value
    return Math.round(percent * 10000) / 100
  }

  getStatus(percent){
    if(percent >= 100){
      return status = 'exceeded'
    }
    if(percent >= 0 && percent < 100){
      return status = 'under'
    }
  }

  calcProjectValue(curr, type){
    let currTime = moment()
    let startTime = moment().startOf(type)
    let diffTime = currTime.diff(startTime, 'minutes')
    let avgLineM = (curr)/(diffTime)
    let endTime = moment().endOf(type)
    let totalDiffTime = endTime.diff(startTime, 'minutes');
    let endY =  (totalDiffTime * avgLineM)
    return Math.round( endY * 100) / 100
  }

  setCurrent(){
    let curr = this.mainsCumul[this.mainsCumul.length-1];
    this.current.cost = this.roundValue(curr.y);
    this.current.energy =  this.calcEnergy(curr.y);
    this.current.percent = this.calculatePercent(curr.y, this.activeLimit.cost_value);
    this.current.percentStr = this.current.percent + '%';
    this.current.status =  this.getStatus(this.current.percent);
  }

  setProjected(){
    /////////////////////////////projected/////////////////////////////
    let curr = this.mainsCumul[this.mainsCumul.length-1];
    if(this.activeLimit.type ==='day'){
      this.projected.cost = this.calcProjectValue(curr.y, 'day');
    }
    if(this.activeLimit.type ==='month'){
      this.projected.cost = this.calcProjectValue(curr.y, 'month');
    }
    this.projected.energy = this.calcEnergy(this.projected.cost);
    this.projected.percent = this.calculatePercent(this.projected.cost, this.activeLimit.cost_value);
    this.projected.percentStr = this.projected.percent + '%';
    this.projected.status =  this.getStatus(this.projected.percent);
    this.projectedValue = this.projected.cost;
  }

  calcCost(kWh){
    return Math.round( kWh * 2.05 *100 )/100 
  }

  calcEnergy(kWh){
    return Math.round( kWh / 2.05 *100 )/100 
  }

  roundValue(value){
    return Math.round( value * 100) / 100
  }
}






