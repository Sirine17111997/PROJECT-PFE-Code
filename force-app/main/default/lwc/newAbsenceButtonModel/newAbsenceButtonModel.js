import { LightningElement,track,wire } from 'lwc';
import Absence__c from '@salesforce/schema/Absence__c';
import Name from '@salesforce/schema/Absence__c.Name';
import StartDate__c from '@salesforce/schema/Absence__c.StartDate__c';
import endDate__c from '@salesforce/schema/Absence__c.EndDate__c';
import Workdays__c from '@salesforce/schema/Absence__c.Workdays__c';
import approval__c from '@salesforce/schema/Absence__c.Approval__c';
import Certificate__c from '@salesforce/schema/Absence__c.Certificate__c';
import DangerToEmployees__c from '@salesforce/schema/Absence__c.DangerToEmployees__c';
import AbsenceManager__c from '@salesforce/schema/Absence__c.AbsenceManager__c';
import Reason__c from '@salesforce/schema/Absence__c.Reason__c';
import { publish, MessageContext } from 'lightning/messageService';
import SampleMC from '@salesforce/messageChannel/SampleMC__c';
import { ShowToastEvent } from "lightning/platformShowToastEvent";




export default class NewAbsenceButtonModel extends LightningElement {
   //use message services to communicate between lwc over message channel 
    @wire(MessageContext) messageContext;

    handleAbsencecreated(id) {
        // Respond to UI event by publishing message
        const payload = { param: 'created absence with id : ' + id };
        publish(this.messageContext, SampleMC , payload);
    }
   // The record page provides objectApiName
    objectApiName = Absence__c;
    fields = 
    [Name,
    StartDate__c,
    endDate__c,
    Workdays__c,
    approval__c,
    Reason__c,
    Certificate__c,
    DangerToEmployees__c,
    AbsenceManager__c
];
    @track bShowModal = false;

    /* javaScipt functions start */ 
    openModal() {    
        // to open modal window set 'bShowModal' tarck value as true
        this.bShowModal = true;
    }
 
    closeModal() {    
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
    }
    handleSuccess(event){
        this.handleAbsencecreated(event.detail.id);
        this.closeModal();
        this.showToast("Success", "Absence Created", "success");

    }
    showToast(title, message, variant) {
        this.dispatchEvent(
          new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
          })
        );
      }


}