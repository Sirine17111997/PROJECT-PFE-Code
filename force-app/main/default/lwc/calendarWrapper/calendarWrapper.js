import { LightningElement, api, track } from 'lwc';


export default class CalendarWrapper extends LightningElement {
    @api options_ = []
    @api initval = []
    @track toggleCalendar = true;

    
    handleToggleCalendar() {
        this.toggleCalendar = !this.toggleCalendar
    }


    handleToggleCalendarWeekend() {
        this.template.querySelector('c-full-calendar').toggleWeekend()
    }

    
    handleOnRecordChange(e) {
        debugger
        //reload the current page
        location.reload();
       
       
    }

}

  //#region 
    // return [
    //     { label: 'Approved Absence', value: '#7cfc00' },
    //     { label: 'Pending  Absence', value: '#add8e6' },
    //     { label: 'Rejected Absence', value: '#ff4500' },
    //     { label: 'Holidays', value: '#777777' }
    // ];
    // }
    //#endregion