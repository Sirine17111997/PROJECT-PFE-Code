public with sharing class AbsenceController{
	//absences-for-approval//en attent
@AuraEnabled(cacheable = true)
	public static List<Absence__c> getAbsencesForApproval(){
		List<Absence__c> absences;
		absences = [select ID, Name, absencemanager__r.employee__r.Name, StartDate__c, EndDate__c, Reason__c, Note__c, Certificate__c, Workdays__c,Approval__c
		            from Absence__c
		            where Approval__c = 'Pending'];
		return absences;
	}
 //absencemanager__r.employee__r.Name (relation parent-child) 
 
@AuraEnabled(cacheable = true)
 public static void updateAbsenceApproval( list<Id> absID){
	List<Absence__c> absToUpdate = new List<Absence__c>();
     for(Id abs : absID){
		for ( Absence__c a : [ 
			SELECT  ID, Name, absencemanager__r.employee__r.Name, StartDate__c, EndDate__c, Reason__c, Note__c, Certificate__c, Workdays__c,Approval__c
			from Absence__c WHERE  ID= :abs]) {
          a.Approval__c  = 'Approved';
          absToUpdate.add(a);
}    }
	if( !absToUpdate.isEmpty() ) {
		update absToUpdate;
	}
   }
	 
} 
	
