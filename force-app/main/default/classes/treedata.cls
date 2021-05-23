public with sharing class treedata {
    @AuraEnabled(cacheable=true)
    public static List<AbsenceManagerWrapper> getTreeData(){
        List<AbsenceManager__c> accs = [Select ID, Name, employee__r.Name, (select ID, Name, StartDate__c, EndDate__c
        from Absences__r)
         from AbsenceManager__c];
        List<AbsenceManagerWrapper> aooo = new List<AbsenceManagerWrapper>();
        for( AbsenceManager__c a : accs){
            AbsenceManagerWrapper aWraper = new AbsenceManagerWrapper() ; 
            aWraper.name ='E'+a.ID;
            aWraper.label =a.employee__r.Name ;
            aWraper.expanded =true ;
            aWraper.disabled = true;
            List<Items> co = new List<Items>(); 
            for(Absence__c c : a.Absences__r){
                Items conWrapp = new Items();
                conWrapp.name =c.ID ;
                conWrapp.label =c.Name ;
                conWrapp.StartDate=String.valueOf(c.StartDate__c); 
                conWrapp.expanded =true ;
                aWraper.disabled = false;
                co.add(conWrapp);
            }
            aWraper.items = co;
            aooo.add(aWraper);
            
        }
       return aooo;
    } 
    public Class AbsenceManagerWrapper{
        @AuraEnabled
        public String name{get;set;}
        @AuraEnabled
        public String label{get;set;}
        @AuraEnabled
        public Boolean expanded{get;set;}
        @AuraEnabled
        public Boolean disabled{get;set;}
        @AuraEnabled
        public List<Items> items{get;set;}
        
    }
    public Class Items{
        @AuraEnabled
        public String name{get;set;}
        @AuraEnabled
        public String label{get;set;}
        @AuraEnabled
        public Boolean expanded{get;set;}
        @AuraEnabled
        public Boolean disabled{get;set;}
        @AuraEnabled
        public String StartDate{get;set;}
    }
    
}

