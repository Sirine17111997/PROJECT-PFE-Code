import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ModelNewAbsence extends LightningElement {
constructor() {
    super();
     }
@api showelement = false;
    
@api newAbsenceRecord;
    
@api
openModal(record) {
    this.newAbsenceRecord = record
    this.showelement = true;
    }
@api
    closeModal(event) {
    this.showelement = false;
    location.reload();
      }
    
handleSuccess(event) {
        console.log(event);
        this.showelement = false;
        // show success msg
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: event.detail.apiName + ' created.',
            variant: 'success',
          }),
        );
       
        
       

        //dispatch created event
        let customEvent = new CustomEvent('created', {
          detail: null
        })
        this.dispatchEvent(customEvent);
        
      }
    




}