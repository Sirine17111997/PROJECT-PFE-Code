import { LightningElement, track , wire ,api } from 'lwc';

import getabsenceManagerchart  from '@salesforce/apex/AbsenceController.getabsenceManagerchart';

export default class ChartAbsenceManager extends LightningElement {
    @track chartConfiguration;
    @wire(getabsenceManagerchart, {})
    getabsenceManagerchart({error, data}) {
     if (error) {
      this.error = error;
      console.log('error => ' + JSON.stringify(error));
      this.chartConfiguration = undefined;
     } else if (data) {
      let chartData = [];
      let chartLabels = [];
      data.forEach(abs => {
       chartData.push(abs.num);
       chartLabels.push(abs.abs);
      });
   
      this.chartConfiguration = {
       type: 'doughnut',
       barPercentage: 0.5,
       barThickness: 6,
       maxBarThickness: 8,
       minBarLength: 2,
       data: {
        labels: chartLabels,
        datasets: [
         {
          label: '',
          backgroundColor: [ '#98FB98', '#0000FF','#FF00FF','#FFE4C4','#98FB98', '#0000FF','#FF00FF'],
          
          data: chartData,
         },
        ],
       },
       options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }

       },
       
      };
      console.log('data => ', data);
      this.error = undefined;
     }
    }




}