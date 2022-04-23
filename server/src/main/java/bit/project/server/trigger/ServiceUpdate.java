package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServiceUpdate extends Trigger{

    @Override
    public String getName() {
        return "service_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "service";
    }

    public ServiceUpdate(){
        addBodyLine("    IF NEW.servicestatus_id = 2 or NEW.servicestatus_id = 3 THEN");
        addBodyLine("        update procurementitem");
        addBodyLine("        set procurementitemstatus_id = IF(procurementitemstatus_id=4, 2, 3)");
        addBodyLine("        where id in (");
        addBodyLine("            select procurementitem_id");
        addBodyLine("            from serviceprocurementitem");
        addBodyLine("            where service_id=OLD.id");
        addBodyLine("        );");
        addBodyLine("    END IF;");
    }

}