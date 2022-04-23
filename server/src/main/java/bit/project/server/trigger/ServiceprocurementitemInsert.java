package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServiceprocurementitemInsert extends Trigger{

    @Override
    public String getName() {
        return "serviceprocurementitem_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "serviceprocurementitem";
    }

    public ServiceprocurementitemInsert(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = IF(procurementitemstatus_id=2, 4, 5)");
        addBodyLine("    where id = NEW.procurementitem_id;");
    }

}