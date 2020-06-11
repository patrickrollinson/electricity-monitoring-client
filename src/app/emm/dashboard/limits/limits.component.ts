import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from './../../../auth.service';
import { ClientService } from './../../../client.service';

import * as moment from 'moment';
import Chart from 'chart.js'

@Component({
  selector: 'limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.css']
})

export class LimitsComponent {
  public emmDetails;

  public emmId
  public clientId

  public view = 'active';
  public activeType = 'day'

  public dayLimits
  public monthLimits
  public activeLimits = {
    day: null,
    month: null
  }
  public activeLimit

  public currCumul = 100;
  public currPercent

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
    iconRegistry.addSvgIcon(
      'limits',
      sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/limitOptions.svg'));
  }

  ngOnInit() {
    //fetch emmDetails
    this.client.getEmmDetails(this.clientId, this.emmId).subscribe(emmDetails => {
      this.emmDetails = emmDetails['emmDetails'];
      let mainsCircuitId = this.emmDetails.ports_active[0].ctId._id;
      this.client.getLimits(this.clientId, this.emmId, mainsCircuitId).subscribe(limits => {
        this.dayLimits = limits['dayLimits'];
        this.monthLimits = limits['monthLimits'];
        this.activeLimits.day =     this.dayLimits.find((limit)=>{return limit.active === true})
        this.activeLimits.month = this.monthLimits.find((limit)=>{return limit.active === true})
        if(this.activeLimits.day === undefined){
          this.activeType = 'month'
          this.activeLimit = this.activeLimits.month
        }
        else{
          this.activeType = 'day'
          this.activeLimit = this.activeLimits.day
        }
      })
    })
  }

  viewActive(type){
    this.view = 'active';
    this.activeType = type
    if (this.activeType === 'day' && this.activeLimits) {
      this.activeLimit = this.activeLimits.day
    }
    if (this.activeType === 'month' && this.activeLimits) {
      this.activeLimit = this.activeLimits.month
    }
  }

  changeView(view){
    this.view = view
  }

  
}






