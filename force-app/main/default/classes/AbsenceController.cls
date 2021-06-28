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
 
@AuraEnabled
 public static void updateAbsenceApproval(List<Id> absID){
	List<Absence__c> absToUpdate = new List<Absence__c>();
     for(Id abs : absID){
		for ( Absence__c a : [ 
			select  ID, Name, absencemanager__r.employee__r.Name, StartDate__c, EndDate__c, Reason__c, Note__c, Certificate__c, Workdays__c,Approval__c
			from Absence__c WHERE  ID= :abs]) {
          a.Approval__c  = 'Approved';
          absToUpdate.add(a);
}    }
	if( !absToUpdate.isEmpty() ) {
		update absToUpdate;
	}
   }
 @AuraEnabled(cacheable = true)
	public static List<AbsenceManager__c> getAbsencesManager(){
		List<AbsenceManager__c> absencesManager;
		absencesManager= [select ID, Name, Email__c
		            from AbsenceManager__c
		           ];
		return absencesManager;
	}
@AuraEnabled(cacheable = true)
	public static List<Absence__c> getAbsences(){
		List<Absence__c> absences;
		absences = [select ID, Name, absencemanager__r.employee__r.Name, StartDate__c, EndDate__c, Reason__c, Note__c, Certificate__c, Workdays__c,Approval__c
		            from Absence__c];
		return absences;
	}
@AuraEnabled(cacheable=true)
    public static List<AggregateResult> getAbsenceschart(){
        return [select COUNT(Name) num, Reason__c , Certificate__c FROM Absence__c WHERE  Approval__c ='Approved' AND StartDate__c>=:system.today() AND StartDate__c<=:system.today()+7 GROUP BY Reason__c,Certificate__c];
    }
@AuraEnabled(cacheable=true)
    public static List<AggregateResult> getAbsencescertif(){
        return [select COUNT(Name) num,Reason__c  FROM Absence__c WHERE  Approval__c ='Rejected' AND StartDate__c>=:system.today() AND StartDate__c<=:system.today()+7 GROUP BY Reason__c];
    }


@AuraEnabled(cacheable=true)
public static List<AggregateResult> getabsencepending(){
return [select COUNT(Name) num , Reason__c FROM Absence__c WHERE  Approval__c ='Pending' AND StartDate__c>=:system.today() AND StartDate__c<=:system.today()+7  GROUP BY Reason__c ];
	  

	 

}


@AuraEnabled(cacheable=true)
public static List<AggregateResult> getabsencedanger(){
return [select COUNT(Name) num , DangerToEmployees__c FROM Absence__c WHERE StartDate__c>=:system.today() AND StartDate__c<=:system.today()+7  GROUP BY DangerToEmployees__c];}

@AuraEnabled
public static void rejectAbsenceApproval(List<Id> absID){
	List<Absence__c> absToreject = new List<Absence__c>();
     for(Id abs : absID){
		for ( Absence__c a : [ 
			select  ID, Name, absencemanager__r.employee__r.Name, StartDate__c, EndDate__c, Reason__c, Note__c, Certificate__c, Workdays__c,Approval__c
			from Absence__c WHERE  ID= :abs]) {
          a.Approval__c  = 'Rejected';
          absToreject.add(a);
}    }
	if( !absToreject.isEmpty() ) {
		delete absToreject;
	}
}
@AuraEnabled(cacheable=true)
public static List<AggregateResult> getabsenceManagerrr(){
	return [select COUNT(id) num , Name FROM AbsenceManager__c GROUP BY Name];}
@AuraEnabled(cacheable=true)
public static List<AbsenceManager__c> getAbsenceManager(){
	return [select  Name, Email__c ,phone__c FROM AbsenceManager__c];}
//Search keyworld from datatable of AbsenceManager
@AuraEnabled(cacheable=true)
	public static List<AbsenceManager__c> getAbsManager( String searchKey) {
		String strKey = '%' + searchKey + '%';  
        return [ SELECT Id, Name FROM AbsenceManager__c WHERE Name LIKE: strKey];  
}
@AuraEnabled(cacheable=true)
public static List<AggregateResult> getabsenceManagerchart(){
return [select COUNT(Name) num , AbsenceManager__r.Name abs FROM Absence__c WHERE StartDate__c>=:system.today() AND StartDate__c<=:system.today()+7  GROUP BY  AbsenceManager__r.Name];}


}