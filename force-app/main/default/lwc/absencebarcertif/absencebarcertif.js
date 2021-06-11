import { LightningElement,wire,track } from 'lwc';
import getAbsencescertif from '@salesforce/apex/AbsenceController.getAbsencescertif';

export default class Absencebarcertif extends LightningElement {
    @track chartConfiguration;
    @wire(getAbsencescertif, {})
    getAbsencescertif({error, data}) {
     if (error) {
      this.error = error;
      console.log('error => ' + JSON.stringify(error));
      this.chartConfiguration = undefined;
     } else if (data) {
      let chartData = [];
      let chartLabels = [];
      data.forEach(abs => {
       chartData.push(abs.num);
       chartLabels.push(abs.Reason__c);
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
          label: 'All  Absences per Certifcation ',
          backgroundColor: [ '#98FB98', '#0000FF','#FF00FF','#FFFF00','#98FB98', '#0000FF','#FF00FF'],
          
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