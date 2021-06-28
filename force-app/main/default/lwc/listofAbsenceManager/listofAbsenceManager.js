import { LightningElement  ,track,api,wire } from 'lwc';
import getAbsenceManager from '@salesforce/apex/AbsenceController.getAbsenceManager';
import getAbsManager from '@salesforce/apex/AbsenceController.getAbsManager';
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'show Details', name: 'showDetails' },
    { label: 'Delete', name: 'Delete' }
];

export default class ListofAbsenceManager extends  NavigationMixin(LightningElement) {
@track columns;
@track showModal = false;
@track value;
@api sortedDirection = 'asc';
@api sortedBy = 'Name';
@api searchKey = '';
Name="Name"
Email='Email__c';
phone="Phone__c"

 columns =[
   
    {
         type: 'text',
         fieldName: this.Name,
         label: 'Name  '
   },
   { label: 'Email', fieldName:this.Email, type: 'email' , sortable: true },
   { label: 'Phone', fieldName:this.phone, type: 'phone' , sortable: true },
   {
    type: 'action',
    typeAttributes: { rowActions: actions }}];
@track showModal=false;
@track error;
pagelinks = [];
@track page = 1; 
@track items = []; 
@track data = []; 
@track startingRecord = 1;
@track endingRecord = 0; 
@track pageSize =12; 
@track totalRecountCount = 0;
@track totalPage = 0;
@track showLoadingSpinner=false;
@api recordId;
refreshTable;
@wire(getAbsenceManager)
getAbsenceManager(result) {
    this.refreshTable = result;
    if (result.data) {
        this.items=result.data;
        this.totalRecountCount = result.data.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        

        for (let i = 1; i <= this.totalPage; i++) {
            this.pagelinks.push(i);
        }
        this.data = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
        this.error = undefined;

    } else if (result.error) {
        this.error = result.error;
        this.data = undefined;
    }
}
//sucess function
@api
handleSuccess() {
    return refreshApex(this.refreshTable);
}
//clicking on previous button this method will be called
previousHandler() {
    if (this.page > 1) {
        this.page = this.page - 1; //decrease page by 1
        this.displayRecordPerPage(this.page);
        }
}

//clicking on next button this method will be called
nextHandler() {
    if((this.page<this.totalPage) && this.page !== this.totalPage){
        this.page = this.page + 1; //increase page by 1
        this.displayRecordPerPage(this.page);            
        }             
    }

//this method displays records page by page
displayRecordPerPage(page){
      this.startingRecord = ((page -1) * this.pageSize) ;
      this.endingRecord = (this.pageSize * page);
      this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
      
       
    }    
handlePage(event) {
    this.page = event.target.label;
    this.displayRecordPerPage(this.page);
    this.isButtonDisabled=true;
}
disableEnableActions() {
        let buttons = this.template.querySelectorAll("lightning-button");

        buttons.forEach(bun => {
            if (bun.label === this.page) {
                bun.disabled = true;
            } else {
                bun.disabled = false;
            }
           if (bun.label === "Previous") {
                bun.disabled = this.page === 1 ? true : false;
            } else if (bun.label === "Next") {
                bun.disabled = this.page === this.totalPage ? true : false;
            }
        });
    }

handleKeyChange( event ) {
        this.searchKey = event.target.value;
        this.handleSuccess();
}  
callRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    console.log('Row --> ' + JSON.stringify(row));//JSON.stringify() converts a javascript value to a JSON String 
    switch (actionName) { 
        case 'Delete':
            this.deleteRow(row);
            break;
        case 'showDetails':
           this.showdetail(row);
            break;
        default:
    }
}
deleteRow(row){
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
      // showing success message
      this.dispatchEvent(new ShowToastEvent({
        message: 'Absence deleted sucessfully',
        variant: 'success'
    }));

    // refreshing table data using refresh apex
    this.handleSuccess();
   location.reload();
})
.catch(error => {
    this.dispatchEvent(new ShowToastEvent({
        message: error.message,
        variant: 'error'
    }));
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
showdetail(row){
    
    let id = row["Id"];
    this.recordId=id;
    this.showModal=true;
    


}
closeModal() {
    // to close modal window set 'bShowModal' tarck value as true
    this.showModal = false;
    this.handleSuccess();
 
}
handleKeyChange( event ) {  
          
    const searchKey = event.target.value;  

    if ( searchKey ) {  

        getAbsManager( { searchKey } )    
        .then(result => {  

            this.data = result;  
            this.handleSuccess();
        })  
        .catch(error => {  

            this.error = error;  
          
        });  

    } else  
    this.data= undefined;  
}      

}