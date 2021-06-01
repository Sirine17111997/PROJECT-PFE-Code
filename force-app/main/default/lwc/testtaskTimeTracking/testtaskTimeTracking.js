import { LightningElement,track } from 'lwc';

export default class TesttaskTimeTracking extends LightningElement {
    @track showStartBtn = true;
    @track timeVal = '00:00:00';
    timeIntervalInstance;
    totalMilliseconds = 0;

    start(event) {
        this.showStartBtn = false;
        var parentThis = this;

        // Run timer code in every 100 milliseconds
        this.timeIntervalInstance = setInterval(function() {

            // Time calculations for hours, minutes, seconds and milliseconds
            var hours = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000);
            
             // Output the result in the timeVal variable
             if(minutes < 10) {
                minutes = "0" + minutes.ToString();
            }
            if(seconds < 10) {
                seconds = "0" + Mathf.RoundToInt(seconds).ToString();
            }
            parentThis.timeVal = hours + ":" + minutes + ":" + seconds ;   
            parentThis.totalMilliseconds += 1000;
        
        }, 1000);
    }

    stop(event) {
        this.showStartBtn = true;
        clearInterval(this.timeIntervalInstance);
    }


}