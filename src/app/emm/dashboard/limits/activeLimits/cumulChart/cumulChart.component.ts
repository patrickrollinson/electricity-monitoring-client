import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import Chart from 'chart.js'

@Component({
  selector: 'cumul-chart',
  templateUrl: './cumulChart.component.html',
  styleUrls: ['./cumulChart.component.css']
})

export class CumulChartComponent {
  @Input() public mainsCumul
  @Input() public activeType
  @Input() public activeLimit
  @Input() public projectedValue

  public emmId

  public cumulReadings

  public timeStart = moment().startOf('day')
  public timeEnd = moment().endOf('day')

  private reportCumulChartOptions = {
    type: 'bar',
    data: { datasets: [] },
    options: {
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          maxBarThickness: 40,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          },
          time: {                   
            unit: "hour",
            stepSize: 1
          }
        }],
        yAxes: [
          {
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Cost (Rand)',

            }
          }]
      }
    }
  }
  private reportCumulChart
  private reportCumulChartHandle;
  private reportCumulData = {
    firstReading: null,
    lastReading: null,
    circuits: null
  }
  constructor(){}

  ngOnChanges(){
    //console.log('this.mainsCumul: ', this.mainsCumul)
    if(this.activeType ==='day'){
      this.timeStart = moment().startOf('day')
      this.timeEnd = moment().endOf('day');
    }
    if(this.activeType ==='month'){
      this.timeStart = moment().startOf('month')
      this.timeEnd = moment().endOf('month');
    }
    this.generateCumulChart()
  }

  generateCumulChart() {
    let start = ''
    
    this.reportCumulChartHandle = document.getElementById("cumulChart");
    this.reportCumulChart = new Chart(this.reportCumulChartHandle, this.reportCumulChartOptions);
    this.reportCumulChart.config.data.datasets = [];
    
    let limitLine = {
      label: 'Limit',
      data: [
        { t: this.timeStart, y: this.activeLimit.cost_value},
        { t: this.timeEnd, y: this.activeLimit.cost_value}]
      ,
      borderColor: 'red',
      type: 'line',
      fill: -1,
      pointRadius:  0,
    };
    this.reportCumulChart.config.data.datasets.push(limitLine);
     
    
    let reqAvgLine = {
      label: 'Projected',
      data: [
        { t: this.timeStart, y: 0},
        { t: this.timeEnd, y: this.projectedValue}],
      type: 'line',
      borderColor: 'blue',
      fill: -1,
      pointRadius:  0,
    };
    this.reportCumulChart.config.data.datasets.push(reqAvgLine);
    //for (let i = 0; i < this.reportCumulData.circuits.length; i++) {
    //setting the chart series options
    let chartDataSeries = new ChartDataSeries;
    chartDataSeries.label = 'Mains '//this.reportCumulData.circuits[i].name;
    chartDataSeries.backgroundColor = '#FF5733'

    //add data to chartDataSeries
    chartDataSeries.data = this.mainsCumul
    //console.log('chartDataSeries: ', chartDataSeries)
    //push series to chartData 
    this.reportCumulChart.config.data.datasets.push(chartDataSeries);
    this.reportCumulChart.config.options.maintainAspectRatio = false;
    //};
    //console.log('this.activeLimit: ', this.activeLimit)
    if(this.activeType ==='day'){
      //console.log(this.reportCumulChart)
      this.reportCumulChart.options.scales.xAxes[0].time.unit = 'hour'
      this.reportCumulChart.options.scales.xAxes[0].time.min = moment().startOf('day')
      this.reportCumulChart.options.scales.xAxes[0].time.max = moment().endOf('day')
    }
    if(this.activeType ==='month'){
      this.reportCumulChart.options.scales.xAxes[0].time.unit = 'day'
      this.reportCumulChart.options.scales.xAxes[0].time.min = moment().startOf('month')
      this.reportCumulChart.options.scales.xAxes[0].time.max = moment().endOf('month')
    }
    
    //console.log("this.reportCumulChart: ", this.reportCumulChart)
    this.reportCumulChart.update();
  }


}


class ChartDataSeries {
  label: string;
  data: object[];
  type: string = 'bar';
  yAxisID: string;
  fill: -1;
  pointRadius: number = 0;
  backgroundColor: string;
};



