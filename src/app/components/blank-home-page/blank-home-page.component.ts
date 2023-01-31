import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart/chart.service';
import { Chart } from 'chart.js';
import { StatusConstants } from '../../models/status-constants';

@Component({
  selector: 'app-blank-home-page',
  templateUrl: './blank-home-page.component.html',
  styleUrls: ['./blank-home-page.component.css']
})
export class BlankHomePageComponent implements OnInit {

  acceptedBuyLeads: number;
  totalBuyLeads: number;
  createdBuyLeads: number;
  rateUpdatedBuyLeads: number;
  approvedBuyLeads: number;
  quotationGeneratedBuyleads: number;
  barChart = [];
  pieChart = [];
  buyleadTotalStatus = [StatusConstants.CREATED_STATUS, StatusConstants.APPROVED_STATUS, StatusConstants.RATEUPDATED_STATUS,
  StatusConstants.QUOTATION_GENERATED, StatusConstants.REJECTED, StatusConstants.FOLLOWUP];

  constructor(private _chart: ChartService) { }

  ngOnInit() {
	  this._chart.getBuyleadCount(this.buyleadTotalStatus)
	  .subscribe(res => {
		this.totalBuyLeads = res;
		this._chart.getBuyleadCount([StatusConstants.ACCEPTED])
			.subscribe(res => {
			this.acceptedBuyLeads = res;
			this._chart.getBuyleadCount([StatusConstants.CREATED_STATUS])
				.subscribe(res => {
				this.createdBuyLeads = res;
				this._chart.getBuyleadCount([StatusConstants.RATEUPDATED_STATUS])
					.subscribe(res => {
					this.rateUpdatedBuyLeads = res;
					this._chart.getBuyleadCount([StatusConstants.APPROVED_STATUS])
						.subscribe(res => {
						this.approvedBuyLeads = res;
						this._chart.getBuyleadCount([StatusConstants.QUOTATION_GENERATED])
							.subscribe(res => {
							this.quotationGeneratedBuyleads = res;
							this.barChart = new Chart('bar', {
							"type": "bar",
							"data": {
								"labels": ["Created", "RateUpdated", "Approved", "QuotationGenerated"],
								"datasets": [{
									"label": "BUYLEAD STATISTICS",
									"data": [this.createdBuyLeads, this.rateUpdatedBuyLeads, this.approvedBuyLeads, this.quotationGeneratedBuyleads],
									"fill": false,
									"backgroundColor": ["#FF9966", "#9966FF", "#FF6384", "#63FF84"],
								}]
							},
							"options": {
								"responsive": true,
								"scales": {
									"yAxes": [{
										"ticks": {
											"beginAtZero": true,
											"fontSize": 13,
											"fontFamily":"Arial",
											"fontStyle" : "bold",
											"fontColor": "black"
										},
										"scaleLabel": {
											"display": true,
											"labelString": "BUYLEAD COUNT",
											"fontColor": "red",
											"fontSize": 12,
											"fontStyle" : "bold",
											"fontFamily":"Arial"
										}
									}],
									"xAxes": [{
										"ticks": {
											"beginAtZero": true,
											"fontSize": 13,
											"fontFamily":"Arial",
											"fontStyle" : "bold",
											"fontColor": "black"
										},
										"scaleLabel": {
											"display": true,
											"labelString": "BUYLEAD STATUS",
											"fontColor": "red",
											"fontSize": 12,
											"fontStyle" : "bold",
											"fontFamily":"Arial"
										}
									}]
								},
								"legend": {
									"labels": {
										"fontColor": "black",
										"fontSize" : 20
									}
								}
							}
						  });
						  this.pieChart = new Chart('pie', {
							"type": "pie",
							"data": {
								"labels": ["Accepted Buyleads", "Not Accepted Buyleads"],
								"datasets": [{
									"label": "Are We Successful?",
									"data": [this.acceptedBuyLeads, this.totalBuyLeads],
									"backgroundColor": ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
								}]
							},
							"options": {
								"legend": {
									"labels": {
										"fontColor": "black",
										"fontSize" : 20
									}
								}
							}
						  });
						});
					});
				});
			});
		});
	  });
  }
}
