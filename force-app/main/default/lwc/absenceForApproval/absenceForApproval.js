import { LightningElement,api,wire,track } from 'lwc';
import  getAbsencesForApproval from '@salesforce/apex/AbsenceController.getAbsencesForApproval';
import { updateRecord } from 'lightning/uiRecordApi';
import Absence__c from '@salesforce/schema/Absence__c';
import Name from '@salesforce/schema/Absence__c.Name';
import StartDate__c from '@salesforce/schema/Absence__c.StartDate__c';
import endDate__c from '@salesforce/schema/Absence__c.EndDate__c';
import Workdays__c from '@salesforce/schema/Absence__c.Workdays__c';
import approval__c from '@salesforce/schema/Absence__c.Approval__c';
import Certificate__c from '@salesforce/schema/Absence__c.Certificate__c';
import Reason__c from '@salesforce/schema/Absence__c.Reason__c';
import DangerToEmployees__c from '@salesforce/schema/Absence__c.DangerToEmployees__c';
import AbsenceManager__c from '@salesforce/schema/Absence__c.AbsenceManager__c';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from '@salesforce/apex';
import updateAbsenceApproval from '@salesforce/apex/AbsenceController.updateAbsenceApproval';
import rejectAbsenceApproval from '@salesforce/apex/AbsenceController.rejectAbsenceApproval';






const actions = [
    { label: 'Approve', name: 'approve' },
    { label: 'Reject', name: 'reject' },
    { label: 'Detail', name: 'detail' }
];



export default class AbsenceForApproval extends LightningElement {
    @track data;
    @track columns;
    @track error;
    @track currentRecordId;
  
    @track record = {};   
    @track certificate = Certificate__c;
    @track Reason = Reason__c;
    @track workdays = Workdays__c;
    @track showLoadingSpinner = false;
    refreshTable;
  
    startdate='StartDate__c';
    Enddate='EndDate__c';
   
    columns = [
   
        { label: 'Start', fieldName: this.startdate, type: 'date' },
        { label: 'End', fieldName: this.Enddate, type: 'date'  },
        {
            type: 'action',
            typeAttributes: { rowActions: actions }}
        
    ];


@wire(getAbsencesForApproval)
    wiredAbsences(result) {
      this.refreshTable = result;
      if (result.data) {
          this.data = result.data;
          this.error = undefined;

      } else if (result.error) {
          this.error = result.error;
          this.data = undefined;
      }
  }
  handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log('Row --> ' + JSON.stringify(row));//JSON.stringify() converts a javascript value to a JSON String 
        switch (actionName) { 
            case 'approve':
                this.approveRow(row);
            break;
            case 'reject':
                this.rejectRow(row);
                break;
            case 'detail':
                this.showRowDetails(row);
                break;
            default:
        }
    }
rejectRow(row){
  this.showLoadingSpinner = true;
  let currentRecord = [];
  currentRecord.push(row.Id);
 

  // calling apex class method to update the pending absences
  rejectAbsenceApproval({ absID : currentRecord })
      .then(result => {

          this.showLoadingSpinner = false;
         // showing success message
          this.dispatchEvent(new ShowToastEvent({
              title: 'success',
              message: 'Absence rejected sucessfully',
              variant: 'success'
          }));

          // refreshing table data using refresh apex
          this.handleSuccess();
        

      })
      .catch(error => {
          this.dispatchEvent(new ShowToastEvent({
              message: error.message,
              variant: 'error'
          }));
      });

  

 
        

}
showRowDetails(row) {
       
        this.record = row;
        
    }
@api
handleSuccess() {
      return refreshApex(this.refreshTable);
  }

approveRow(row){
  this.showLoadingSpinner = true;
  let currentRecord = [];
  currentRecord.push(row.Id);
 

  // calling apex class method to update the pending absences
  updateAbsenceApproval({ absID : currentRecord })
      .then(result => {

          this.showLoadingSpinner = false;
         // showing success message
          this.dispatchEvent(new ShowToastEvent({
              title: 'success',
              message: 'Absence approved sucessfully',
              variant: 'success'
          }));

          // refreshing table data using refresh apex
          this.handleSuccess();
        

      })
      .catch(error => {
          this.dispatchEvent(new ShowToastEvent({
              message: error.message,
              variant: 'error'
          }));
      });

  

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