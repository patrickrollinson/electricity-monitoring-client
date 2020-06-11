import { Component, AfterContentInit } from '@angular/core';
import { LoggingService } from '../logging.service';

import * as d3 from 'd3';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {
  constructor(
    private log: LoggingService,
  ) { }

  radius = 10;



  ngOnInit() {
    var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      g = svg.append("g").attr("transform", "translate(40,0)");

    var tree = d3.tree()
      .size([height, width - 160]);

    var stratify = d3.stratify()
      .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    d3.csv("assets/liveData.csv", function (error, data) {
      if (error) throw error;
      console.log(data)

      var root = stratify(data)
        .sort(function (a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

      var link = g.selectAll(".link")
        .data(tree(root).links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
          .x(function (d) { return d.y; })
          .y(function (d) { return d.x; }));

      var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })

      node.append("circle")
        .attr("r", 2.5);

      node.append("text")
        .attr("dy", 3)
        .attr("x", function (d) { return d.children ? -8 : 8; })
        .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
        .text(function (d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
    });

  }







  // clicked(event: any) {
  //   console.log('clicked: ', event)
  //   d3.select(event.target).append('circle')
  //     .attr('cx', event.x)
  //     .attr('cy', event.y)
  //     .attr('r', () => {
  //       return this.radius;
  //     })
  //     .attr('fill', 'red');
  // }
}

// var svg = d3.select("svg");
    // var width = +svg.attr("width");
    // var height = +svg.attr("height");

    // var totalsWidth = 150;
    // var strokeWidth = function (p) {
    //   return p * totalsWidth / 100
    // }

    // var returnX = function (p) {
    //   return p * width / 100
    // }

    // var returnY = function (p) {
    //   return p * height / 100
    // }

    // // var formatNumber = d3.format(",.0f"),
    // //   format = function (d) { return formatNumber(d) + " TWh"; },
    // //   color = d3.scaleOrdinal(d3.schemeCategory10);

    // let circuits = [
    //   {name: 'Plugs 1', type: 'plugs', value: 25},
    //   {name: 'Plugs 2', type: 'plugs',value: 200},
    //   {name: 'Plugs 3', type: 'plugs',value: 586},
    //   {name: 'Lights 1', type: 'lights',value: 12},
    //   {name: 'Lights 2', type: 'lights',value: 36},
    //   {name: 'Lights 3', type: 'lights',value: 42},
    // ];

    // let numCircuits = circuits.length;
    // let circuitsHeight = height / (numCircuits + 1); 

    // let types = [
    //   {name: 'Plugs', type: 'plugs', numCircuits: 3,value: 798},
    //   {name: 'Lights', type: 'lights', numCircuits: 3, value: 90},
    // ];

    // let numTypes = circuits.length;
    // let typesHeight = height / (numTypes + 1); 

    // let totalPower = circuits.reduce(function(acc, curr){ return acc + curr.value}, 0)

    // let circuitsPercent = circuits.map(circuit => {
    //   circuit['percent'] = Math.round((circuit.value / totalPower) * 100);
    //   return circuit
    // })

    // console.log('circuits: ', circuits)
    // console.log('totalPower: ', totalPower)
    // console.log('circuitsPercent: ', circuitsPercent);
    // console.log('numCircuits: ', numCircuits);
    // console.log('circuitsHeight: ', circuitsHeight);

    // let totalsSource = { x: returnX(30), y: returnY(50)};
    // let typesTargetX = returnX(60);
    // let typesTargetY = 0
    // let data = [{
    //   source: totalsSource,
    //   target: {
    //     x: typesTargetX, y: returnY(30), 
    //   },
    //   value: 75
    // }, {
    //   source:totalsSource,
    //   target: {
    //     x: typesTargetX, y:  returnY(60)
    //   },
    //   value: 5
    // }, {
    //   source: totalsSource,
    //   target: {
    //     x: typesTargetX, y: returnY(90)
    //   },
    //   value: 20
    // },];

    // console.log('data:', data)

    // var link = d3.linkHorizontal()
    //   .x(function (d) {
    //     return d.x;
    //   })
    //   .y(function (d) {
    //     return d.y;
    //   });

    // var totalLink = svg.append("line")
    //   .attr("x1", returnX(5))
    //   .attr("y1", returnY(50))
    //   .attr("x2", returnX(30))
    //   .attr("y2", returnY(50))
    //   .attr("stroke", "#168cee")
    //   .attr("stroke-width", "200")

    // var totalText = svg.append("text")
    //   .attr("x", returnX(10))
    //   .attr("y", returnY(50))
    //   .attr("font-size", "35px")
    //   .attr("fill", "#ffffff")
    //   .text("Total")

    // // var linkTest = svg.append("path")
    // //   .attr("class", "link")
    // //   .attr("d", d3.linkHorizontal()
    // //     .x(function(d) { return d.y; })
    // //     .y(function(d) { return d.x; })
    // //   );

    // // <text x="7%" y="49%" style="font-size:35px; line-height:0;fill:#ffffff">Total</text>
    // // <text x="25%" y="49%" style="font-size:35px; line-height:0;fill:#ffffff">100%</text>

    // // var link = d3.linkHorizontal()
    // // .x(50)
    // // .y(50)


    // // link({
    // //   source: [100, 100],
    // //   target: [300, 300]
    // // });



    // // var sankey = d3.sankey()
    // //     .nodeWidth(15)
    // //     .nodePadding(10)
    // //     .extent([[1, 1], [width - 1, height - 6]]);



    // // var node = svg.append("g")
    // //   .attr("class", "nodes")
    // //   .attr("font-family", "sans-serif")
    // //   .attr("font-size", 10)
    // //   .selectAll("g");




    // var render = function (data) {
    //   // console.log('data: ', data)
    //   // //Bind data
    //   // var links = svg.selectAll("path").data(data.types);
    //   // var labels = svg.selectAll("text").data(data.types)

    //   // console.log('links: ', links)
    //   // console.log('labels: ', labels)
    //   // //Enter
    //   // links.enter().append("path").attr("class", "link");
    //   // //labels.enter().append("text");

    //   // //update
    //   // links
    //   // .attr("fill", "none")
    //   // .attr("stroke", "blue")
    //   // .attr("d", link);

    //   var links = svg.selectAll(null)
    //     .data(data)
    //     .enter()
    //     .append("path")

    //   links
    //     .attr("fill", "none")
    //     .attr("stroke", "blue")
    //     .attr("d", link)
    //     .attr('stroke-width', function(d){return strokeWidth(d.value)})

    // }

    // render(data)
    //   link.append("title")
    //     .text(function (d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    //   node = node
    //     .data(energy.nodes)
    //     .enter().append("g");

    //   node.append("rect")
    //     .attr("x", function (d) { return d.x0; })
    //     .attr("y", function (d) { return d.y0; })
    //     .attr("height", function (d) { return d.y1 - d.y0; })
    //     .attr("width", function (d) { return d.x1 - d.x0; })
    //     .attr("fill", function (d) { return color(d.name.replace(/ .*/, "")); })
    //     .attr("stroke", "#000");

    //   node.append("text")
    //     .attr("x", function (d) { return d.x0 - 6; })
    //     .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    //     .attr("dy", "0.35em")
    //     .attr("text-anchor", "end")
    //     
    //     .filter(function (d) { return d.x0 < width / 2; })
    //     .attr("x", function (d) { return d.x1 + 6; })
    //     .attr("text-anchor", "start");

    //   node.append("title")
    //     .text(function (d) { return d.name + "\n" + format(d.value); });