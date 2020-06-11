import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from './../../../auth.service';
import { ClientService } from './../../../client.service';

import * as moment from 'moment';
import Chart from 'chart.js'

@Component({
  selector: 'live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})

export class LiveComponent {
  public liveReadings;

  private clientId: string;
  private emmId: string;

  public loading: boolean = true;

  public sankeyData = {
    chartType: 'Sankey',
    dataTable: [
      ['From', 'To', 'Value', { 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } }]
    ],
    options: {
      'height': 600,
      'focusTarget': 'category',
      'tooltip': { isHtml: true },
      'sankey': {
        'link': {
          'colorMode': 'target',
          'colors': [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ]
        },
        'node': {
          'colors': ['#000000'],
          'nodePadding': 80,
          'label': {
            'color': '#000000',
            'fontSize': 20
          }
        },
      }
    },
  };

  public label
  public timeDiff 

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

  ngOnInit(changes: SimpleChanges) {
    this.loading = true;
    let end = moment().unix() * 1000
    let start = end - 120000;

    this.client.getTelemetry(this.clientId, this.emmId, start, end).subscribe(readings => {
      readings;
      this.createLiveData(readings)
      
      let circuits = this.liveReadings.circuits
      //create array of all unique circuit types
      let uniqueTypes = circuits
        .map(item => item.type)
        .filter((value, index, self) => self.indexOf(value) === index)
      
      //sum values for each types
      let circuitTypes = []
      for (let u = 0; u < uniqueTypes.length; u++) {
        let type = uniqueTypes[u];
        let circuitType = { type: type, y: 0 }

        for (let c = 0; c < this.liveReadings.circuits.length; c++) {
          if (this.liveReadings.circuits[c].type === type) {
            circuitType.y += this.liveReadings.circuits[c].y
          }
        }
        circuitTypes.push(circuitType)
      }

      let circuitTypesArray = [
        {type: 'mains',               label: 'Mains'},
        {type: 'lights',              label: 'Lights'},
        {type: 'plugs',               label: 'Plugs'},
        {type: 'stove',               label: 'Stove'},
        {type: 'heating',             label: 'Heating'},
        {type: 'under_floor_heating', label: 'Under-floor Heating'},
        {type: 'electric_fence',      label: 'Electric Fence'},
        {type: 'jacuzzi',             label: 'Jacuzzi'},
        {type: 'pump',                label: 'Pump'},
        {type: 'pool',                label: 'Pool'},
      ]

      circuitTypes = circuitTypes.map(val => {
        let labelObj = circuitTypesArray.find((ct) => { 
          return ct.type === val.type
        })

        return {
          type: val.type,
          y: val.y,
          label: labelObj.label
        } 
      })

      circuits = circuits.map(circuit => {
        let labelObj = circuitTypesArray.find((ct) => { 
          return ct.type === circuit.type
        })
        return {
          circuitName: circuit.circuit,
          type: circuit.type,
          y: circuit.y,
          typeLabel: labelObj.label
        } 
      })
      

      for (let t = 1; t < circuitTypes.length; t++) {
        if (circuitTypes[t].y !== 0) {
           let type = [
            'Mains', 
            circuitTypes[t].label, 
            circuitTypes[t].y, 
            this.createTooltip(circuitTypes[t].type, circuitTypes[t].type, circuitTypes[t].y)
          ]
          this.sankeyData.dataTable.push(type)
        }
      }
      for (let c = 1; c < circuits.length; c++) {
        if (circuits[c].y !== 0) {
          let circuit = [
            circuits[c].typeLabel, 
            circuits[c].circuitName, 
            circuits[c].y, 
            this.createTooltip(circuits[c].type, circuits[c].circuitName, circuits[c].y)
          ]
          this.sankeyData.dataTable.push(circuit)
        }
      }
      this.loading = false;
    })
  }

  createTooltip(type, name, value) {
    function capitalizeFirstLetter(string) {
      return string[0].toUpperCase() + string.slice(1);
  }
    return '<div class="text-center" style="padding:5px 5px 5px 5px; width: 150px;">' +
      '<img src="../../../assets/icons/circuit/' + type + '.svg" height="80" width="80" align="middle">' +
      '<h3 class="text-center">' + capitalizeFirstLetter(name)  + '</h3>' +
      '<p> Power: ' + value + ' Watts </p>' +
      '<p> Cost: ' + Math.round(value * 0.00205 * 100) / 100 + ' R/hour</p></div>'
  }

  createLiveData(readings){
    this.liveReadings= {
        label: null,  
        timeDiff: null, 
        t: null, 
        circuits: []
    }
    
    if(readings.circuits[0].readings.length > 0){
        let lastReading = readings.circuits[0].readings.length -1 
        for(let c = 0; c < readings.circuits.length; c++){
            if(c === 0 ){
                this.liveReadings.t = readings.circuits[0].readings[lastReading].t;
                this.liveReadings.label =  moment(new Date(this.liveReadings.t)) 
                this.liveReadings.timeDiff = moment().diff(this.liveReadings.label, 'seconds')
            }
            let liveReading = {
                circuit: readings.circuits[c].name,
                type: readings.circuits[c].type,
                y: readings.circuits[c].readings[lastReading].y,
            }
            this.liveReadings.circuits.push(liveReading)
        }
    }
  } 

}






