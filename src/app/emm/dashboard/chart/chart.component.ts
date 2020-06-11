import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from './../../../auth.service';
import { ClientService } from './../../../client.service';

import { DashboardComponent } from './../dashboard.component';

import Chart from 'chart.js'
import * as moment from 'moment';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges{
    @Input() public format: string;
    @Input() public time

    private clientId: string;
    private emmId: string;

    public loading: boolean = true;

    public myChart =null
    //chart data vars
    private chartData;
    public colorPalette = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
    ];
    public graphUnit = 'minute';
    public graphStepSize = 10;
    private dataInterval
    private dataArray 
    public chartDomHandle 
    
    public chartOptions = {      
        type: 'bar',
        data: {datasets: []},
        options: {
            legend: {
                position: 'bottom'
            }, 
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    maxBarThickness: 4,
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    time: {
                        min: null,
                        max: new Date(),
                        unit: this.graphUnit,
                        stepSize: this.graphStepSize
                    }
                }],
                yAxes: [
                {
                    ticks:{
                        min: 0,
                        stepSize: 50,
                        max: 400
                    },
                    position: 'left',
                    id: 'circuits',
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Power (Watts)',
                        stacked: true, 
                        
                    }
                },
                {
                    ticks:{
                        min: 0,
                        stepSize: 50,
                        max: 400
                    },
                    position: 'right',
                    id: 'total',
                    scaleLabel: {
                        display: false,
                        labelString: 'Power (Watts)',
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
        private auth: AuthService,
    ) {
        this.emmId = route.snapshot.params.emmId;
        this.clientId  = auth.id;
    }
    
    ngOnChanges(changes: SimpleChanges){
        // fetch telemetry
        let now = moment().unix() * 1000;
        this.loading = true;
        if(this.time.type === '1hour' ){
            this.client.getTelemetry(this.clientId, this.emmId, this.time.start, now).subscribe(readings => {
                this.createGraphData(readings, this.format)
            })
          }
          if(this.time.type === '2hours' ){
            this.client.getTelemetry(this.clientId, this.emmId, this.time.start, now).subscribe(readings => {
                this.createGraphData(readings, this.format)
            })
          }
          if(this.time.type === 'day'){
            this.client.getFiveMinReports(this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
                this.createGraphData(readings, this.format)
            })
          }
          if(this.time.type === 'month'){
            this.client.getHourReports(this.clientId, this.emmId, this.time.start, this.time.finish).subscribe(readings => {
                this.createGraphData(readings, this.format)
            })
          }
    }

    createGraphData(readings, unit){
        if(unit === 'cost'){
            this.chartData = readings.circuits.map(circuit => {
                circuit.max = circuit.max / 1000 * 24 *2.05
                circuit.readings =  this.convertToCost(circuit.readings)
                return circuit
            }); 
            this.generateChart()
        }
        if(unit === 'energy'){
            this.chartData = readings.circuits; 
            this.generateChart()
        }
    }

    convertToCost(readings){
        return readings.map(reading => {
            return {t: reading.t, y: (reading.y / 1000 * 24) *2.05 }
        })
    }

    setAxis(){
        //x axis
        if(this.time.type == "1hour" && this.format === 'cost'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'minute';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 2;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 10;
        }
        if(this.time.type == "1hour" && this.format === 'energy'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'minute';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 2;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 10;
        }
        if(this.time.type == "2hours" && this.format === 'cost'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'minute';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 5;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 5;
        }
        if(this.time.type == "2hours" && this.format === 'energy'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'minute';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 5;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 5;
        }
        if(this.time.type == "day" && this.format === 'cost'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'hour';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 1;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 5;
        }
        if(this.time.type == "day" && this.format === 'energy'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'hour';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 1;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 5;
        }
        if(this.time.type == "month" && this.format === 'cost'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'day';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 1;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 50;
        }
        if(this.time.type == "month" && this.format === 'energy'){
            this.myChart.config.options.scales.xAxes[0].time.unit = 'day';
            this.myChart.config.options.scales.xAxes[0].time.stepSize = 1;
            this.myChart.config.options.scales.xAxes[0].maxBarThickness = 50;
        }
        this.myChart.config.options.scales.xAxes[0].time.min = new Date(this.time.start)
        this.myChart.config.options.scales.xAxes[0].time.max = new Date(this.time.finish)

        //y axis 
        if(this.format === "cost"){
            this.myChart.config.options.scales.yAxes[0].scaleLabel.labelString = 'Cost (Rands / Day)';
            this.myChart.config.options.scales.yAxes[0].ticks.max = Math.ceil(1.1 * this.chartData[0].max);
            this.myChart.config.options.scales.yAxes[1].ticks.max = Math.ceil(1.1 * this.chartData[0].max);  
        }
        if(this.format === "energy"){
            this.myChart.config.options.scales.yAxes[0].scaleLabel.labelString = 'Power (Watts)'; 
            this.myChart.config.options.scales.yAxes[0].ticks.max = Math.ceil(1.1 * this.chartData[0].max);
            this.myChart.config.options.scales.yAxes[1].ticks.max = Math.ceil(1.1 * this.chartData[0].max);        
        }
    }
    
    generateChart(){
        if(this.myChart !== null){
            this.myChart.destroy()
        }
        this.chartDomHandle = document.getElementById("timeSeriesChart");
        this.myChart = new Chart(this.chartDomHandle, this.chartOptions);
        this.myChart.config.data.datasets = [];
        this.setAxis()

        let totalCircuit = {
            data : this.chartData[0].readings,
            label : "Total",
            yAxisID : 'total',
            type : 'line',
            lineTension: 0,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            pointRadius: 0,
            fill: false
        }    
        this.myChart.config.data.datasets.push(totalCircuit);

        for(let i = 1; i < this.chartData.length; i++){
            //setting the chart series options
            let chartDataSeries = new ChartDataSeries;
            chartDataSeries.label = this.chartData[i].name;
            chartDataSeries.yAxisID = 'circuits';
            chartDataSeries.backgroundColor = this.colorPalette[i]
            chartDataSeries.data = this.chartData[i].readings
            this.myChart.config.data.datasets.push(chartDataSeries);
        };
        this.myChart.update(); 
        this.loading = false;
    };
}


class ChartDataSeries {
    label: string;
    data: object[];
    type: string = 'bar';
    yAxisID: string;
    fill: -1;
    pointRadius: number = 0;
    backgroundColor: string ;
};