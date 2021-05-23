import { LightningElement,wire,api,track } from 'lwc';
import {registerListener,unregisterListener}from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';//to create a deep link to the page in salesforce

export default class HrmAbsences extends LightningElement {
    @track isAbsenceItemMenu=true;
    @track isEquipmentItemMenu=false;
    @track isEmploymentItemMenu=false;
    @track isJobsItemMenu=false;
    @track isSetupItemMenu =false;
    @track absenceId ;
    @track isAbsence;
    @track isAbsenceManager;
    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        //subscribe to itemmenuselected event
        registerListener('itemmenuselected',this.handleItemMenuSelected,this);
    }
    disconnectedCallback(){
        //unsubscribe from itemmenuselected event
       unregisterListener(this);
    }
    handleselectAbsence(event){
        this.absenceId=event.detail;
        this.isAbsence=true;
        this.isAbsenceManager=false;
    }
    handleselectAbsenceManager(event){
        this.absenceId=event.detail;
        this.isAbsence=false;
        this.isAbsenceManager=true;
    }
    handleItemMenuSelected(itemMenuSelected){
        switch(itemMenuSelected){
            case 'absences':{
                 this.isAbsenceItemMenu=true;
                 this.isEquipmentItemMenu=false;
                 this.isEmploymentItemMenu=false;
                 this.isJobsItemMenu=false;
                 this.isSetupItemMenu =false;
            }break;
            case 'employment':{
                this.isAbsenceItemMenu=false;
                this.isEquipmentItemMenu=false;
                this.isEmploymentItemMenu=true;
                this.isJobsItemMenu=false;
                this.isSetupItemMenu =false;
            }break;
            case 'equipment':{
                this.isAbsenceItemMenu=false;
                this.isEquipmentItemMenu=true;
                this.isEmploymentItemMenu=false;
                this.isJobsItemMenu=false;
                this.isSetupItemMenu =false;
           }break;
           case 'jobs':{
                this.isAbsenceItemMenu=false;
                this.isEquipmentItemMenu=false;
                this.isEmploymentItemMenu=false;
                this.isJobsItemMenu=true;
                this.isSetupItemMenu =false;
            }break;
            case 'setup':{
                this.isAbsenceItemMenu=false;
                this.isEquipmentItemMenu=false;
                this.isEmploymentItemMenu=false;
                this.isJobsItemMenu=false;
                this.isSetupItemMenu =true;
            }break;

        }


    }
    


    







}