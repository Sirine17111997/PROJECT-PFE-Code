import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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
import Email__c from '@salesforce/schema/Absence__c.Email__c';
import Note__c from '@salesforce/schema/Absence__c.Note__c';
import { publish, MessageContext } from 'lightning/messageService';
import SampleMC from '@salesforce/messageChannel/SampleMC__c';


export default class ModelNewAbsence extends LightningElement {
constructor() {
    super();
     }
@api showelement = false;
objectApiName = Absence__c;
fields = [
       Name,
       StartDate__c,
       endDate__c,
       Workdays__c,
       approval__c,
       Reason__c,
       Note__c,
       Certificate__c,
       DangerToEmployees__c,
       AbsenceManager__c,
       Email__c,
   ];

    
@api newAbsenceRecord;
    
@api
openModal(record) {
    this.newAbsenceRecord = record;
    this.showelement = true;
    }
@api
    closeModal(event) {
    this.showelement = false;
    location.reload();
      }
    
handleSuccess(event) {
        console.log(event);
        
        // show success msg
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: event.detail.apiName + ' created.',
            variant: 'success',
          }),
        );
        this.closeModal(event);
    //dispatch created event
        let customEvent = new CustomEvent('created', {
          detail: null
        })
        this.dispatchEvent(customEvent);
        
      }



}