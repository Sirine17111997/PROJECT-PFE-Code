import {LightningElement, wire, track} from 'lwc';
import getabsencepending from '@salesforce/apex/AbsenceController.getabsencepending';

export default class Chartuserabsence extends LightningElement {
    @track chartConfiguration;
    @wire(getabsencepending, {})
    getabsencepending({error, data}) {
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
       type: 'bar',
       barPercentage: 0.5,
       barThickness: 6,
       maxBarThickness: 8,
       minBarLength: 2,
       data: {
        labels: chartLabels,
        datasets: [
         {
          label:'Reason',
    
           backgroundColor: ["#00BFFF",'#98FB98',"#00BFFF","#98FB98",'#00BFFF',"#98FB98"]
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
                  beginAtZero: true,
                  /*,
                  precision: 0 ,
                  min: 0,
              max: 3   */       }
          }]
         }
       },
      };
      console.log('data => ', data);
      this.error = undefined;
     }
    }


}