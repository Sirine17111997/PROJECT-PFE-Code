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
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from '@salesforce/apex';
import { getRecord,getRecordNotifyChange } from 'lightning/uiRecordApi';
import updateAbsenceApproval from '@salesforce/apex/AbsenceController.updateAbsenceApproval';





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
    @track bShowModal = false;
    @track isEditForm = false;
    @track record = {};   
    @track certificate = Certificate__c;
    @track Reason = Reason__c;
    @track workdays = Workdays__c;
    @track showLoadingSpinner = false;
    refreshTable;
    error;
    startdate='StartDate__c';
    Enddate='EndDate__c'
   
    columns = [
   
        { label: 'Start', fieldName: this.startdate, type: 'date' },
        { label: 'End', fieldName: this.Enddate, type: 'date'  },
        {
            type: 'action',
            typeAttributes: { rowActions: actions }}
        
    ];
 @api currentRecordId ;

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
                this.deleteRow(row);
                break;
            case 'detail':
                this.showRowDetails(row);
                break;
            default:
        }
    }
deleteRow(row) {
        this.showLoadingSpinner = true;
        let id = row["Id"],
        index = this.findRowIndexById(id);
        console.log(index);
       
        if (index !== -1) {
          deleteRecord(id)
            .then(() => {
              this.data = this.data
                .slice(0, index)//slice() render an array object
                .concat(this.data.slice(index + 1));//concat() combines the text of several strings
              this.showLoadingSpinner = false;
              this.showToast("Success", "Absence Rejected sucessfully", "success");
               // refreshing table data using refresh apex
             return refreshApex(this.refreshTable);
              
            })
            .catch((error) => {
              this.showToast("Error deleting record", error.body.message, "error");
            });
        }
      }

findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
          if (row.Id === id) {
            ret = index;
            return true;
          }
          return false;
        });
        return ret;
    }
showRowDetails(row) {
        this.record = row;
    }
handleSuccess() {
      return refreshApex(this.refreshTable);
  }

 approveRow(currentRow){
  let currentRecord = [];
  currentRecord.push(currentRow.Id);
  this.showLoadingSpinner = true;

  // calling apex class method to delete the selected contact
  updateAbsenceApproval({ absID : currentRecord })
      .then( result => {

          this.showLoadingSpinner = false;

          // showing success message
          this.dispatchEvent(new ShowToastEvent({
              message: 'Absence approved sucessfully',
              variant: 'success'
          }));

          // refreshing table data using refresh apex
          return refreshApex(this.refreshTable);

      })
      .catch(error => {
          this.dispatchEvent(new ShowToastEvent({
              message: error.message,
              variant: 'error'
          }));
      });

  

 }
  

   //this.bShowModal = true;
   //this.isEditForm = true;
   //this.currentRecordId = this.row.Id;



  
  
    


closeModal() {    
  // to close modal window set 'bShowModal' tarck value as false
  this.bShowModal = false;
}

  // handleing record edit form submit
  handleSubmit(event) {
    // prevending default type sumbit of record edit form
    event.preventDefault();

    // querying the record edit form and submiting fields to form
    this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

    // closing modal
    this.bShowModal = false;

    // showing success message
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success!!',
        message: ' Absence approved Successfully!!.',
        variant: 'success'
    }),);

}


closeModal() {
  this.bShowModal = false;
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