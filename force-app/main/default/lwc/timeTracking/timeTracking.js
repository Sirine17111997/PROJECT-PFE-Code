import { LightningElement, track, wire, api } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import {
    getRecordCreateDefaults,
    generateRecordInputForCreate,
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
    getFieldValue
} from "lightning/uiRecordApi";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { reduceDMLErrors } from "c/utilities";

import getUnfinishedTimeEntries from "@salesforce/apex/TimeTrackingController.getUnfinishedTimeEntries";
import getPausedTimeEntries from "@salesforce/apex/TimeTrackingController.getPausedTimeEntries";
import getRecordTypeIdProjectTask from "@salesforce/apex/TimeTrackingController.getRecordTypeIdProjectTask";


import TIME_ENTRY_OBJECT from "@salesforce/schema/TimeEntry__c";
import TIME_ENTRY_NAME_FIELD from "@salesforce/schema/TimeEntry__c.Name";
import TIME_ENTRY_PROJECT_TEAM_MEMBER_FIELD from "@salesforce/schema/TimeEntry__c.Project_Team_Member__c";
import TIME_ENTRY_PROJECT_TASK_FIELD from "@salesforce/schema/TimeEntry__c.Project_Task__c";
import TIME_ENTRY_STATUS_FIELD from "@salesforce/schema/TimeEntry__c.Status__c";
import TIME_ENTRY_START_FIELD from "@salesforce/schema/TimeEntry__c.Start__c";
import TIME_ENTRY_END_FIELD from "@salesforce/schema/TimeEntry__c.End__c";
import TIME_ENTRY_DAILYRATE_FIELD from "@salesforce/schema/TimeEntry__c.Project_Team_Member__r.Project_Daily_Rate__c";
import TIME_ENTRY_DESCRIPTION_FIELD from "@salesforce/schema/TimeEntry__c.Description__c";
import TIME_ENTRY_ISPAUSED_FIELD from "@salesforce/schema/TimeEntry__c.isPaused__c";
import TIME_ENTRY_DURATION_IN_SECONDS_FIELD from "@salesforce/schema/TimeEntry__c.durationInSeconds__c";


import PROJECT_TASK_NAME_FIELD from "@salesforce/schema/ProjectTask__c.Name";
import PROJECT_TASK_PROJECT_ID_FIELD from "@salesforce/schema/ProjectTask__c.Project__r.Id";
import PROJECT_TASK_TEAM_MEMBER_ID_FIELD from "@salesforce/schema/ProjectTask__c.Assigned_To__r.Id";
import PROJECT_TASK_TEAM_MEMBER_DAILYRATE_FIELD from "@salesforce/schema/ProjectTask__c.Assigned_To__r.Project_Daily_Rate__c";


export default class TimeTracking extends LightningElement {

    LABELS = {
        CARD_TITLE: "Task Time Tracking",
        NO_TIME_ENTRY: "No running Time Entry was found. click on PLAY to start a new time entry.",
        ACTIVE_TIME_ENTRY: "Active Time Entry",
        TOAST_TITLE_ERROR: "An error occured during processing!",
        TOAST_TITLE_STARTED_SUCCESS: "Recording of Time Entry successfully started!",
        TOAST_TITLE_STOPPED_SUCCESS: "Recording successfully stopped. Time Entry submitted.",
        TOAST_TITLE_STOPPED_ERROR: "TimeTracking_Toast_CanNotStopRecording",
        TOAST_TITLE_RECORDING_ABORTED: "Recording aborted! Time Entry has been deleted.",
        TOAST_TITLE_RECORDING_REQUIRED_FIELDS: "Please fill all the time entry required fields.",

    };

    @api recordId;

    @track recordTypeIdProjectTask;
    @track activeTimeEntry;
    @track isRecording = false;
    @track isTimeTracking = false;
    @track isLoading = true;
    @track isWorking = false;
    @track activeTimeEntryId;
    @track currentTime = new Date().toISOString()
    @track isPaused = false;


    @wire(getRecordTypeIdProjectTask)
    WiredRecordTypeIdProjectTask({ data }) {
        this.recordTypeIdProjectTask = data;
    }

    @wire(getRecordCreateDefaults, { objectApiName: TIME_ENTRY_OBJECT, recordTypeId: '$recordTypeIdProjectTask' })
    timeEntryDefaults;

    @wire(getRecord, {
        recordId: "$activeTimeEntryId",
        fields: [
            TIME_ENTRY_NAME_FIELD,
            TIME_ENTRY_PROJECT_TEAM_MEMBER_FIELD,
            TIME_ENTRY_PROJECT_TASK_FIELD,
            TIME_ENTRY_STATUS_FIELD,
            TIME_ENTRY_START_FIELD,
            TIME_ENTRY_END_FIELD,
            TIME_ENTRY_DAILYRATE_FIELD,
            TIME_ENTRY_DESCRIPTION_FIELD,
            TIME_ENTRY_ISPAUSED_FIELD,
            TIME_ENTRY_DURATION_IN_SECONDS_FIELD,
        ]
    })
    getTimeEntryRecord({ data }) {
        this.activeTimeEntry = data;
        if (this.activeTimeEntry) {
            this.isLoading = false;
        }

        //pre-fill the duration timer
        if (data && this.template.querySelector('c-durtion') && data.fields.isPaused__c.value) {
            this.template.querySelector('c-durtion').setCustomDuration(data.fields.durationInSeconds__c.value)
        }
    }


    @wire(getRecord, {
        recordId: "$projectTaskId",
        fields: [PROJECT_TASK_NAME_FIELD, PROJECT_TASK_PROJECT_ID_FIELD, PROJECT_TASK_TEAM_MEMBER_ID_FIELD, PROJECT_TASK_TEAM_MEMBER_DAILYRATE_FIELD]
    })
    projectTask


    /**                                LIFECYCLE METHODS                                */
    connectedCallback() {
        //start timer
        setInterval(() => {
            if (!this.isPaused) {
                this.currentTime = new Date().toISOString()
            }
        }, 1000);

        //get task's unfinished time entry
        getUnfinishedTimeEntries({ taskId: this.projectTaskId }).then((data) => {
            if (data && data.length >= 1) {
                this.isRecording = true;
                this.isTimeTracking = true;
                this.activeTimeEntryId = data[0].Id;
                this.isLoading = false;

            }
            if (!this.isRecording) {
                this.isLoading = false;
            }
        });

        //get task's paused time entry
        getPausedTimeEntries({ taskId: this.projectTaskId }).then((data) => {
            if (data && data.length >= 1) {
                this.isRecording = true;
                this.isTimeTracking = false;
                this.isPaused = true;

                this.activeTimeEntryId = data[0].Id;
                this.isLoading = false;


            }
            if (!this.isRecording) {
                this.isLoading = false;
            }
        });
    }

    /**                                 EVENT HANDLING                                   */

    startRecording() {
        console.log("start recording-*********");
        this.isWorking = true;
        let newTimeEntry = this.createTimeEntryForInsert();
        newTimeEntry.fields.isPaused__c = false;
        newTimeEntry.fields.Start__c = this.currentTime;
        newTimeEntry.fields.DailyRate__c = this.projectTask.data.fields.Assigned_To__r.value.fields.Project_Daily_Rate__c.value;


        newTimeEntry.fields.Project_Task__c = this.projectTaskId;
        newTimeEntry.fields.Project_Team_Member__c = this.projectTask.data.fields.Assigned_To__r.value.id
        newTimeEntry.fields.Project__c = this.projectTask.data.fields.Project__r.value.id;


        createRecord(newTimeEntry)
            .then((newRecord) => {
                this.isRecording = true;
                this.isTimeTracking = true;
                this.isWorking = false;
                this.dispatchToast("success", this.LABELS.TOAST_TITLE_STARTED_SUCCESS);
                this.activeTimeEntry = newRecord;
                this.activeTimeEntryId = newRecord.id;
            })
            .catch((error) => {
                this.dispatchToast("error", this.LABELS.TOAST_TITLE_ERROR, reduceDMLErrors(error));
                this.isRecording = false;
                this.isWorking = false;
            });
    }


    stopRecording() {
        console.log("stop recording-*********");
        let fieldsMap = new Map();
        fieldsMap[TIME_ENTRY_END_FIELD.fieldApiName] = this.currentTime
        fieldsMap[TIME_ENTRY_ISPAUSED_FIELD.fieldApiName] = true;

        let updateTimeEntry = this.createTimeEntryRecordInputForFields(fieldsMap);
        updateRecord(updateTimeEntry)
            .then((updatedRecord) => {
                this.dispatchToast("success", this.LABELS.TOAST_TITLE_STOPPED_SUCCESS);
                this.updateActiveTimeEntryOnStop(updatedRecord);
            })
            .catch((error) => {
                this.dispatchToast("error", this.LABELS.TOAST_TITLE_STOPPED_ERROR, reduceDMLErrors(error));
                this.isWorking = false;
            });
    }


    sumbitRecording() {
        console.log("submit recording-*********");
        this.isWorking = true;
        let fieldsMap = new Map();
        fieldsMap[TIME_ENTRY_START_FIELD.fieldApiName] = this.template.querySelector('[data-id="InputStart__c"]').value;
        fieldsMap[TIME_ENTRY_END_FIELD.fieldApiName] = this.template.querySelector('[data-id="InputEnd__c"]').value;
        fieldsMap[TIME_ENTRY_DESCRIPTION_FIELD.fieldApiName] = this.template.querySelector('[data-id="InputDescription__c"]').value;
        fieldsMap[TIME_ENTRY_ISPAUSED_FIELD.fieldApiName] = false;

        let updateTimeEntry = this.createTimeEntryRecordInputForFields(fieldsMap);
        updateRecord(updateTimeEntry)
            .then((updatedRecord) => {
                this.dispatchToast("success", this.LABELS.TOAST_TITLE_STOPPED_SUCCESS);
                this.updateActiveTimeEntry(updatedRecord);
                this.isWorking = false;
                this.isRecording = false;
                this.isPaused = false;
                this.template.querySelector('c-durtion').hide = true
                window.location.reload();
            })
            .catch((error) => {
                this.dispatchToast("error", this.LABELS.TOAST_TITLE_STOPPED_ERROR, reduceDMLErrors(error));
                this.isWorking = false;
            });
    }

    deleteRecording() {
        console.log("delete recording-*********");


        this.isWorking = true;
        deleteRecord(this.activeTimeEntryId)
            .then(() => {
                this.dispatchToast("warning", this.LABELS.TOAST_TITLE_RECORDING_ABORTED);
                this.activeTimeEntryId = undefined;
                this.activeTimeEntry = undefined;
                this.isRecording = false;
                this.isWorking = false;
                this.isPaused = false;
                this.template.querySelector('c-duration-timer').hide = true

            })
            .catch((error) => {
                this.dispatchToast("error", this.LABELS.TOAST_TITLE_ERROR, reduceDMLErrors(error));
                this.isWorking = false;
            });
    }

    updateRecordLookup(event) {
        this.isWorking = true;
        let timeEntryUpdate = this.createTimeEntryRecordInputForField(
            event.currentTarget.fieldName,
            event.detail && event.detail.value.length === 0 ? "" : event.detail.value[0]
        );

        this.updateTimeEntryRecord(timeEntryUpdate);
    }

    updateRecordValue(event) {
        this.isWorking = true;
        this.isLoading = true;
        let timeEntryUpdate = this.createTimeEntryRecordInputForField(event.currentTarget.name, event.currentTarget.value);

        updateRecord(timeEntryUpdate).then((updatedRecord) => {
            this.isWorking = false;
            this.isLoading = false;
        });
    }

    /**                                GETTERS & SETTERS                                     */

    get projectTaskId() {
        return this.recordId;
    }

    get isReady() {
        return !this.isRecording && !this.isLoading;
    }

    get isFullyLoaded() {
        return this.isRecording && !this.isLoading;
    }

    get isDescriptionVisible() {
        return getFieldValue(this.activeTimeEntry, TIME_ENTRY_ISPAUSED_FIELD) && getFieldValue(this.activeTimeEntry, TIME_ENTRY_END_FIELD)
    }


    get Description() {
        return getFieldValue(this.activeTimeEntry, TIME_ENTRY_DESCRIPTION_FIELD);
    }

    get startTime() {
        return getFieldValue(this.activeTimeEntry, TIME_ENTRY_START_FIELD)
            ? getFieldValue(this.activeTimeEntry, TIME_ENTRY_START_FIELD)
            : this.currentTime;
    }

    get endTime() {
        return getFieldValue(this.activeTimeEntry, TIME_ENTRY_END_FIELD)
            ? getFieldValue(this.activeTimeEntry, TIME_ENTRY_END_FIELD)
            : this.currentTime;
    }

    get activeTimeEntryLink() {
        return window.location.protocol + '//' + window.location.hostname + '/' + this.activeTimeEntryId;
    }

    get activeTimeEntryName() {
        return getFieldValue(this.activeTimeEntry, TIME_ENTRY_NAME_FIELD)
    }


    /**                                     HELPERS                                      */

    createTimeEntryRecordInputForField(fieldName, fieldValue) {
        let recordInput = {
            fields: {
                Id: this.activeTimeEntryId
            }
        };
        recordInput.fields[fieldName] = fieldValue;
        return recordInput;
    }

    createTimeEntryRecordInputForFields(fieldsMap) {
        let recordInput = {
            fields: {
                Id: this.activeTimeEntryId
            }
        };
        for (const [fieldName, fieldValue] of Object.entries(fieldsMap)) {
            recordInput.fields[fieldName] = fieldValue;
        }
        return recordInput;
    }
    
    createTimeEntryForInsert() {
        if (!this.timeEntryDefaults.data) {
            return undefined;
        }
        return generateRecordInputForCreate(
            this.timeEntryDefaults.data.record,
            this.timeEntryDefaults.data.objectInfos[TIME_ENTRY_OBJECT.objectApiName]
        );
    }

    dispatchToast(variant, title, message) {
        let toast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toast);
    }

    updateActiveTimeEntry(updatedRecord) {
        this.isRecording = false;
        this.activeTimeEntry = undefined;
        this.activeTimeEntryId = undefined;
        this.isWorking = false;
        this.activeTimeEntry = updatedRecord;
    }

    updateActiveTimeEntryOnStop(updatedRecord) {
        this.isPaused = true;
    }

    updateTimeEntryRecord(recordInput) {
        updateRecord(recordInput).then((updatedRecord) => {
            this.isWorking = false;
        });
    }




}