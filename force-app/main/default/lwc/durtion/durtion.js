import { LightningElement ,api,track} from 'lwc';

export default class Durtion extends LightningElement {
    @api
    get startTimeString() {
        return this.startTime.toISOString().split('T')[1];
    }
    set startTimeString(value) {
        let today = new Date().toISOString().split('T')[0];
        this.startTime = new Date(today + 'T' + value.split('T')[1].substring(0,8));
    }

    @api
    get endTimeString() {
        return this.endTime.toISOString().split('T')[1];
    }
    set endTimeString(value) {
        let today = new Date().toISOString().split('T')[0];
        // this.endTims17e = new Date(today + 'T' + value);
        this.endTime = new Date(today + 'T' + value.split('T')[1].substring(0,8));
    }

    @track startTime;
    @track endTime;

    @api
    get duration() {
        let durationInMilSec = this.endTime - this.startTime;
        let hours = Math.floor((durationInMilSec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((durationInMilSec % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((durationInMilSec % (1000 * 60)) / (1000));
        let numberFormat = new Intl.NumberFormat('de-DE', { minimumSignificantDigits: 1, minimumIntegerDigits: 2 });
        return numberFormat.format(hours) + ':' + numberFormat.format(minutes) + ':' + numberFormat.format(seconds);
    }



}