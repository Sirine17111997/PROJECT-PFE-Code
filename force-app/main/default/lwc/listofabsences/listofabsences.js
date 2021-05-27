import { LightningElement  ,track,api,wire } from 'lwc';
import getTreeData from '@salesforce/apex/treedata.getTreeData';
import { publish, MessageContext } from 'lightning/messageService';
import GoToDate from '@salesforce/messageChannel/GoToDate__c';
export default class Listofabsences extends LightningElement {

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