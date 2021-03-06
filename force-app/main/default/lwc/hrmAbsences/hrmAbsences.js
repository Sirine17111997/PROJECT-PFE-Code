import { LightningElement,wire,api,track } from 'lwc';
import {registerListener,unregisterListener}from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';//to create a deep link to the page in salesforce

export default class HrmAbsences extends LightningElement {
    @track isAbsenceItemMenu=true;
    @track isSetupItemMenu =false;
    @track isAbsenceManagerItemMenu=false;
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
                 this.isAbsenceManagerItemMenu=false;
                 this.isItemMenudashboard=false;
             
                 this.isSetupItemMenu =false;
            }break;
            case 'dashboard':{
                this.isAbsenceItemMenu=false;
                this.isItemMenudashboard=true;
                this.isAbsenceManagerItemMenu=false;
              
           }break;
           case 'AbsenceManager':{
                this.isAbsenceItemMenu=false;
                this.isAbsenceManagerItemMenu=true;
                this.isItemMenudashboard=false;
               
            }break;
            case 'setup':{
                this.isAbsenceItemMenu=false;
                this.isAbsenceManagerItemMenu=false;
             
                this.isItemMenudashboard=false;
            }break;

        }


    }
    


    







}