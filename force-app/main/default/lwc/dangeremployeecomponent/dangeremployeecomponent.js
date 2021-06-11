import {LightningElement, wire, track} from 'lwc';
import getabsencedanger from '@salesforce/apex/AbsenceController.getabsencedanger';
export default class Dangeremployeecomponent extends LightningElement {
    @track chartConfiguration;
    @wire(getabsencedanger, {})
    getabsencedanger({error, data}) {
     if (error) {
      this.error = error;
      console.log('error => ' + JSON.stringify(error));
      this.chartConfiguration = undefined;
     } else if (data) {
      let chartData = [];
      let chartLabels = [];
      data.forEach(abs => {
       chartData.push(abs.num);
       chartLabels.push(abs.DangerToEmployees__c);
      });
   
      this.chartConfiguration = {
       type: 'pie',
       barPercentage: 0.5,
       barThickness: 6,
       maxBarThickness: 8,
       minBarLength: 2,
       data: {
        labels: chartLabels,
        legend: {
            "display": true
          },
        datasets: [
         {
          label:'',
    
           backgroundColor: ["#0000FF","#00BFFF"]
          ,
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