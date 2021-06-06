import { LightningElement,wire,api,track } from 'lwc';
import {fireEvent}from 'c/pubsub' ; 
import { CurrentPageReference } from 'lightning/navigation';//to create a deep link to the page in salesforce



export default class HrmMenus extends LightningElement {
  

    selected;
    @wire(CurrentPageReference) pageRef;
    handleSelectItemMenu(event){
        this.selected = event.detail.name;
        fireEvent(this.pageRef , 'itemmenuselected', this.selected);
    }
     //FireEvent through pubsub approach
     


}