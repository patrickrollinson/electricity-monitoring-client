import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

// interface ReportData {
//   label: string;
//   startUnix: number;
//   endUnix: number;
//   start: any;
//   end: any;
//   circuits: CircuitReport[]
// }

// interface CircuitReport {
//   name: string;
//   id: string;
//   port: number;
//   totalCost: number;
// }

export class ReportComponent implements OnChanges {
  @Input() public emmDetails;
  @Input() public format: string;
  @Input() public time

  private clientId: string;
  private emmId: string;

  public loading: boolean = true; 

  public colorPalette = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];
  private now = moment({ hour: 0, minute: 0 })
  public dayReport = {
    date: moment().format("dddd, MMMM Do YYYY"),
    circuits: []
  }
  private periodStart
  private periodFinish
  private filteredReadings = []

  private tariff = 2.05

  private reportData
  private reportSumData
  private reportCumulData = { 
    firstReading: null,
    lastReading: null,
    circuits: null 
  }

  //pie chart
  private pieChart
  private pieChartConfig
  private pieChartHandle

  //chart  
  private reportChart
  private reportChartHandle;
  private reportChartOptions = {
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
            min: this.periodStart,
            max: this.periodFinish,
            unit: "hour",
            stepSize: 1
          }
        }],
        yAxes: [
          {
            ticks: {
              min: 0
            },
            position: 'left',
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Energy (kWh)',
              stacked: true,

            }
          }]
      }
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private client: ClientService,
    private auth: AuthService
) {
    this.emmId = route.snapshot.params.emmId;
    this.clientId = auth.id;
}

  ngOnChanges(changes: SimpleChanges) {
    //this.generatorReport()
    if(this.time.type === '1hour' ){
      this.client.getTelemetry(this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
        this.generateReportData2(readings, 'telemetry' )
        this.generatePieChart()
      })
    }
    if(this.time.type === '2hours' ){
      this.client.getTelemetry(this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
        this.generateReportData2(readings, 'telemetry' )
        this.generatePieChart()
      })
    }
    if(this.time.type === 'day'){
      this.client.getFiveMinReports( this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
        this.generateReportData2(readings, '5min' )
        this.generatePieChart()
      })
    }
    if(this.time.type === 'month'){
      this.client.getHourReports( this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
        this.generateReportData2(readings, 'hour' )
        this.generatePieChart()
      })
    }

  }

  generateReportData2(readings, type){
    let timeDiffSec = moment(this.time.finish).diff(moment(this.time.start), 'seconds')
    let timeDiffHours = timeDiffSec / 3600; 

    let calcCost = (readings, type) =>{
      if(type === 'telemetry'){
        return ((readings.reduce((acc, reading)=>{ return acc + reading.y }, 0) / readings.length) / 1000 ) * timeDiffHours *2.05
      }
      if(type === '5min'){
        return readings.reduce((acc, reading)=>{ return acc + ((reading['y'] / 12000) *2.05)}, 0)
      }
      if(type === 'hour'){
        return ((readings.reduce((acc, reading)=>{ return acc + (reading.y * 2.05)}, 0) )/ 1000 )
      }
    }

    let circuits = readings['circuits'].map(circuit => {
      let totalCost = calcCost(circuit.readings, type) 
      let totalEnergy = totalCost / 2.05;
      return {
        name: circuit.name,
        type: circuit.type,
        totalEnergy: Math.round(totalEnergy*100)/100,
        totalCost: Math.round(totalCost*100)/100,
        percent: 0
      }
    })
    this.reportData = {
      label: this.time.label,
      startUnix: this.time.start,
      start: moment(this.time.start),
      endUnix: this.time.finish,
      end: moment(this.time.finish),
      numReadings: readings.circuits[0].readings.length,
      circuits
    };
    // adding percents to circuits
    let mainsCircuit = this.reportData.circuits.find(circuit => {
      if(circuit.type === 'mains'){
        return circuit
      }
    })
    let mainTotalEnergy = mainsCircuit.totalEnergy; 
    for(let i = 0; i < this.reportData.circuits.length; i ++ ){
      this.reportData.circuits[i].percent = Math.round((this.reportData.circuits[i].totalEnergy / mainTotalEnergy)*100) 
    }
    
  }

  generatePieChart() {
    this.pieChartConfig = {
      type: 'pie',
      options: {
        legend: {
          position: 'left'
        }
      },

      data: {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: []
      }
    }
    this.pieChartHandle = document.getElementById("pieChart");
    this.pieChart = new Chart(this.pieChartHandle, this.pieChartConfig);
    for (let i = 1; i < this.reportData.circuits.length; i++) {
      this.pieChartConfig.data.datasets[0].data.push(this.reportData.circuits[i].totalCost);
      this.pieChartConfig.data.labels.push(this.reportData.circuits[i].name);
      this.pieChartConfig.data.datasets[0].backgroundColor.push(this.colorPalette[i]);
    };
    this.pieChart.update();
  }

  generateReportChartData() {
    console.log(this.time)
    if (this.time.type === '1hour' || '2hours') {

    }
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






