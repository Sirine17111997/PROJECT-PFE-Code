import {LightningElement,api,track} from 'lwc';
import uploadFiles from '@salesforce/apex/AbsenceController.uploadFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileComponent extends LightningElement {
    @track filesUploaded = [];

    handleFileUploaded(event) {
        if (event.target.files.length > 0) {
            let files = [];
            for(var i=0; i< event.target.files.length; i++){
                let file = event.target.files[i];
                let reader = new FileReader();
                reader.onload = e => {
                    let base64 = 'base64,';
                    let content = reader.result.indexOf(base64) + base64.length;
                    let fileContents = reader.result.substring(content);
                    this.filesUploaded.push({PathOnClient: file.name, Title: file.name, VersionData: fileContents});
                };
                reader.readAsDataURL(file);
            }
        }
    }

    attachFiles(event){
        uploadFiles({files: this.filesUploaded})
            .then(result => {
                if(result == true) {
                    this.showToastMessage('Success','Files uploaded', 'success');
                }else{
                    this.showToastMessage('Error','Error uploading files', 'error');
                }
            })
            .catch(error => {
                this.showToastMessage('Error','Error uploading files', 'error');
            });
    }

    showToastMessage(title,message,variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}