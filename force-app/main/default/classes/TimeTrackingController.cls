public with sharing class TimeTrackingController {
	public Static String TimeEntryProjectTaskRecordTypeName = Constants.TIME_ENTRY_RECORD_TYPE_PROJECT_TASK;
	@AuraEnabled(cacheable = false)
	public static List<TimeEntry__c> getUnfinishedTimeEntries(String taskId){
		return [SELECT Id
		        FROM TimeEntry__c
		        WHERE OwnerId = :UserInfo.getUserId() AND RecordType.name = :TimeEntryProjectTaskRecordTypeName AND End__c = null AND isPaused__c = false AND Project_Task__c = :taskId
		        ORDER BY CreatedDate DESC];
	}

	/** @Description
	 *   Retrieves List of non-ended / paused time entries (Ids only) for the current user.
	 *   The Time Entries are ordered by created date (most recent first)
	 *
	 *   @return             List of paused Time Entries.
	 */
	@AuraEnabled(cacheable = false)
	public static List<TimeEntry__c> getPausedTimeEntries(String taskId){
		return [SELECT Id
		        FROM TimeEntry__c
		        WHERE OwnerId = :UserInfo.getUserId() AND RecordType.name = :TimeEntryProjectTaskRecordTypeName AND End__c != null AND isPaused__c = true AND Project_Task__c = :taskId
		        ORDER BY CreatedDate DESC];
	}
    /***********************************     record type id"s for lwc 	     ***********************************/
    @AuraEnabled(cacheable = true)
	public static String getRecordTypeIdProjectTask(){
		return Schema.SObjectType.TimeEntry__c.RecordTypeInfosByName.get(TimeEntryProjectTaskRecordTypeName).RecordTypeId;
	}
    
    

}