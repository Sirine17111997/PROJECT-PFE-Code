import { LightningElement,track,wire,api } from 'lwc';
import AbsenceManager__c from '@salesforce/schema/AbsenceManager__c';
import Name from '@salesforce/schema/Absence__c.Name';
import Email__c from '@salesforce/schema/AbsenceManager__c.Email__c';
import Phone__c from '@salesforce/schema/AbsenceManager__c.Phone__c';
import Employee__c from '@salesforce/schema/AbsenceManager__c.Employee__c';
import { publish, MessageContext } from 'lightning/messageService';
import SampleMC from '@salesforce/messageChannel/SampleMC__c';
import { ShowToastEvent } from "lightning/platformShowToastEvent";




export default class NewbuttonAbsenceManager extends LightningElement {
   //use message services to communicate between lwc over message channel 
   @wire(MessageContext) messageContext;

   handleAbsencecreated(id) {
       // Respond to UI event by publishing message
       const payload = { param: 'created absence with id : ' + id };
       publish(this.messageContext, SampleMC , payload);
   }
  // The record page provides objectApiName
  
objectApiName = AbsenceManager__c;
@track showModal = false;
fields = [
      Name,
      Employee__c,
      Email__c,
      Phone__c,
  ];


/* javaScipt functions start */
openModal() {
  // to open modal window set 'bShowModal' tarck value as true
  this.showModal = true;
}

handleSuccess(event) {
  //update  calendar: add the new created absence 
   const evt = new ShowToastEvent({
       title: "Absence created",
       message: "Record ID: " + event.detail.id,
       variant: "success"
   });
   this.dispatchEvent(evt);
   this.closeModal();
   this.template.querySelector('c-listof-absence-manager').handleSuccess();
   




}
  


closeModal() {
  // to close modal window set 'bShowModal' tarck value as false
  this.showModal = false;
   
}





}