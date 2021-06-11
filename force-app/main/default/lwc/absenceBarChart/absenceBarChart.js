import {LightningElement, wire, track} from 'lwc';
import getAbsenceschart from '@salesforce/apex/AbsenceController.getAbsenceschart';

export default class AbsenceBarChart extends LightningElement {
    @track chartConfiguration;
    @wire(getAbsenceschart, {})
    getAbsenceschart({error, data}) {
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
       legend: {
        display: true,
        position: 'bottom',
        labels: {
            boxWidth: 20,
            fontColor: '#111',
            padding: 15
        }},
        plugins: {
          datalabels: {
              color: '#111',
              textAlign: 'center',
              font: {
                  lineHeight: 1.6
              },
              formatter: function(value, ctx) {
                  return ctx.chart.data.labels[ctx.dataIndex] + '\n' + value + '%';
              }
          }
      },
  
       data: {
        labels: chartLabels,
        datasets: [
         {
          label: 'Reason',
          backgroundColor: ["#00BFFF","#98FB98","#00BFFF","#98FB98","#00BFFF","#98FB98","#00BFFF"],
          
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