import { LightningElement, api, wire, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendar from '@salesforce/resourceUrl/FullCalendarJS';
//Use the Lightning message service functions to communicate over a Lightning message channel(is not a component).
//Use Lightning message service to communicate across the DOM between lighnting web components.
//Lightning Message service is a way to communicate between Lightning Web Components (LWC), Aura Components, and, yes, even Visualforce Pages. The new capability is called Lightning Message Service.
//LMS API allow you to publish message throughout the lightning experience and subscribe the same message anywhere with in lightning page. It is similar to Aura Application Events to communication happens between components.
//Lightning Message Service is based on a new metadata type: Lightning Message Channels. We need to use Lightning Message Channel to access the Lightning Message Service API.
//lmsSubscriberWebComponent
// Import message service features required for subscribing and the message channel
import { helper } from './helper.js';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
  } from 'lightning/messageService';
  import SampleMC from '@salesforce/messageChannel/SampleMC__c';
 
export default class FullcalendarJStest extends LightningElement {
    LABELS = {
        // CARD_TITLE: 'Time Tracking',
        TOAST_TITLE_ERROR: 'An error occured during processing!',
      }
    
    
      //new absence button (absence created)
      //wire the message context
      @wire(MessageContext)
      messageContext;
    
      subscribeToMessageChannel() {
        if (!this.subscription) {
          this.subscription = subscribe(
            this.messageContext,
            SampleMC,
            (message) => this.handleNewAbsenceCreated(message),
            { scope: APPLICATION_SCOPE }
          );
        }
      }
     
      unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
      }
    
      // Handler for message received by component
      handleNewAbsenceCreated(message) {
        message ? this.init_calendar() : null
      }
    
    
      //unscubscribe from the message channel
      disconnectedCallback() {
        this.unsubscribeToMessageChannel();
      }
      // ----------------------------
      @api currentDate = null;
      //may be loaded from database
    
      @api loadFromWrapper = false;

    
      @track spinnerFC = true;//spiner function
      //get the new absence data as a  json object
      @api newAbsenceRecord;
      connectedCallback() {
        // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
        this.subscribeToMessageChannel();
      
      }
  /////////////////////////////////////////////////////////////
  
  /**
   * @description Standard lifecyle method 'renderedCallback'
   *              Ensures that the page loads and renders the 
   *              container before doing anything else
   */
  renderedCallback() {
    Promise.all([
      loadScript(this, FullCalendar + '/jquery.min.js'),
      loadScript(this, FullCalendar + '/jquery-ui.min.js'),
      loadScript(this, FullCalendar + '/moment.min.js'),
      loadScript(this, FullCalendar + '/fullcalendar.min.js'),

      loadStyle(this, FullCalendar + '/fullcalendar.min.css'),
      loadStyle(this, FullCalendar + '/custom.css')
    ]).then(() => {
      
      //  the modal[c-modal-new-absence]   rather than calling  the current component 
      //we have no problem instanciating a new component from one of them
      let newAbsenceElem = this.template.querySelector('c-modal-new-absence')
    
      
      //get the dom element to contain the Full calendar 
      const ele = this.template.querySelector('div.fullcalendarjs');

      //spinner to wait for the calendar to load (optional UI element)
      this.spinnerFC = false;
      // check if the Calendar will be reloaded on a preset date
      let presetDate = null
      let tmpPreset = $(ele).fullCalendar('getDate')
      if (tmpPreset._fullCalendar) { presetDate = helper.formatDate(tmpPreset) }

      //destroy the old calendar 
      $(ele).fullCalendar('destroy')

      //configure the dom Full calendar with JSON object 
      //some features are commented , we may need them in future use cases

      //we can checkout the docs of every word inside this JSON object here https://fullcalendar.io/docs/ 
      // for example  if we are looking  for :
      // plugins 
      // https://fullcalendar.io/docs/plugins/plugins 
      // 
      // eventClick 
      // https://fullcalendar.io/docs/plugins/eventClick 
      // 
      // interaction
      // https://fullcalendar.io/docs/plugins/interaction 


      $(ele).fullCalendar({
        plugins: ['interaction', 'dayGrid', 'list', 'timeGrid'],
        hiddenDays: [],
        header: {
          right: 'prev,next',
          center: 'title',
          left: 'month,basicWeek'//,basicDay,weekendToggle
        },
        // eventLimit: true,
        //display Monday as the first day of the week 
        firstDay: 1,
        selectable: true,
        // selectOverlap: false,
        // selectOverlap:function(event) {
        //   return event.rendering === 'background';
        // },
        // selectMinDistance:2,
        selectHelper: true,
        // defaultDate: new Date(),
        defaultDate: presetDate == null ? new Date() : presetDate,
        // gotoDate: customDefaultDate,
        navLinks: true,
        editable: true,
        select: function (start, end) {
          console.log('selecting from' + start + 'to' + end);
          // let arrHolidays = helper.listOfHolidays.map(x => x.date__c)
          // let start_ = helper.formatDate(start);
          // let end_ = helper.formatDate(end);
          // if (
          //   !arrHolidays.includes(start_)
          //   && !helper.isWeekend(start_)
          //   && !arrHolidays.includes(end_)
          //   && !helper.isWeekend(end_)
          //   ) {}
          let newAbsence = {
            "StartDate__c": helper.formatDate(start),
            "EndDate__c": helper.addDays(end, (-1)),
            "Workdays__c": 0,
            "Approval__c": "",
            "Certificate__c": "",
            "DangerToEmployees__c": "",
            "AbsenceManager__c": "",
          }
          newAbsenceElem.openModal(newAbsence);
        },
      
     
      
      
      
      // weekends: false,
      //same as weekends: false
      dayRender: function (date, cell) {
        let arrHolidays = helper.listOfHolidays.map(x => x.date__c)
        let currentDate = helper.formatDate(date);
        if (arrHolidays.includes(currentDate) || helper.isWeekend(currentDate)) {
          cell.addClass('my-custom-disabled-event');
          let evList = helper.listOfHolidays.filter(p => p.date__c == currentDate)
          if (evList.length > 0) {
            let eventName = evList[0].holidayName__c
            cell.html(`<h3>${eventName}</h3>`)
            cell.css('text-align', 'center')
            cell.css('vertical-align', 'middle')
            cell.css('color', 'white')
          }
        }
      },

      
    
     
    });
    
  })



  
  }

 
  
 //get current date 
  @api
  getCurrentDate() {
    Promise.all([
      loadScript(this, FullCalendar + '/jquery.min.js'),
      loadScript(this, FullCalendar + '/jquery-ui.min.js'),
      loadScript(this, FullCalendar + '/moment.min.js'),
      loadScript(this, FullCalendar + '/fullcalendar.min.js'),
      loadStyle(this, FullCalendar + '/fullcalendar.min.css'),
      loadStyle(this, FullCalendar + '/custom.css'),
    ]).then(() => {
      const ele = this.template.querySelector('div.fullcalendarjs');
      let tmp = $(ele).fullCalendar('getDate')
      this.currentDate = helper.formatDate(tmp)
    })
  }

  @api
  toggleWeekend() {
    Promise.all([
      loadScript(this, FullCalendar + '/jquery.min.js'),
      loadScript(this, FullCalendar + '/jquery-ui.min.js'),
      loadScript(this, FullCalendar + '/moment.min.js'),
      loadScript(this, FullCalendar + '/fullcalendar.min.js'),
      loadStyle(this, FullCalendar + '/fullcalendar.min.css'),
      loadStyle(this, FullCalendar + '/custom.css'),
    ]).then(() => {
      const ele = this.template.querySelector('div.fullcalendarjs');

      if ($(ele).fullCalendar('option', 'hiddenDays').length == 0) {
        $(ele).fullCalendar('option', 'hiddenDays', [0, 6])
      } else if ($(ele).fullCalendar('option', 'hiddenDays').length == 2) {
        $(ele).fullCalendar('option', 'hiddenDays', [])
      }
    })

  }


  handleRecordsChange(e) {
    this.dispatchEvent(new CustomEvent('recordchange', {}))
  }

}
 
