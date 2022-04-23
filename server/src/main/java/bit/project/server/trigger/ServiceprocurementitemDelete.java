package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServiceprocurementitemDelete extends Trigger{

    @Override
    public String getName() {
        return "serviceprocurementitem_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "serviceprocurementitem";
    }

    public ServiceprocurementitemDelete(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = IF(procurementitemstatus_id=4, 2, 3)");
        addBodyLine("    where id = OLD.procurementitem_id;");
    }

}