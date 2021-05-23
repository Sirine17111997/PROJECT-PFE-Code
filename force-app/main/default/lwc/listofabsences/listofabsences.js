import { LightningElement  ,track,api,wire } from 'lwc';
import getTreeData from '@salesforce/apex/treedata.getTreeData';
import { publish, MessageContext } from 'lightning/messageService';
import GoToDate from '@salesforce/messageChannel/GoToDate__c';
import Name from '@salesforce/schema/Absence__c.Name';
import StartDate__c from '@salesforce/schema/Absence__c.StartDate__c';
import endDate__c from '@salesforce/schema/Absence__c.EndDate__c';
import Workdays__c from '@salesforce/schema/Absence__c.Workdays__c';
import approval__c from '@salesforce/schema/Absence__c.Approval__c';
import Certificate__c from '@salesforce/schema/Absence__c.Certificate__c';
import DangerToEmployees__c from '@salesforce/schema/Absence__c.DangerToEmployees__c';
import Reason__c from '@salesforce/schema/Absence__c.Reason__c';
import { getRecord } from 'lightning/uiRecordApi';
export default class Listofabsences extends LightningElement {
    @api recordId;
    @track record;
    @track errors;

    @wire(getRecord, { recordId: '$recordId', fields:[Name] })
    wiredabsence({ errors, data }) {
        if (data) {
            this.record = data;
            this.errors = undefined;
            this.checkRecordName(this.record.fields.Name.value);
         
        } else if (errors) {
            this.errors = errors;
            this.record = undefined;
        }
    }
    get name() {
        return this.record.fields.Name.value;
    }
    get StartDate(){
        return this.absence.data.StartDate__c.value;
    }
   
    @wire(MessageContext)
    messageContext;
    @track showelement=false;
   
    @track treeItems;
    @track error;
    selectedItemValue;

    handleOnselect(event) {
        this.selectedItemValue = event.detail.name;
       

        }
        
            

        
 @wire(getTreeData)
    wireTreeData({
        error,
        data
    }) {
        if (data) {
            this.treeItems = data;
            console.log(JSON.stringify(data, null, '\t'));
        } else {
            this.error = error;
        }
    }


  

  



}