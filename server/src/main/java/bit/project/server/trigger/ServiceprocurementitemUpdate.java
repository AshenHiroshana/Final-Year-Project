package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServiceprocurementitemUpdate extends Trigger{

    @Override
    public String getName() {
        return "serviceprocurementitem_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "serviceprocurementitem";
    }

    public ServiceprocurementitemUpdate(){
        addBodyLine("");
        addBodyLine("    IF OLD.procurementitem_id != NEW.procurementitem_id THEN");
        addBodyLine("");
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = IF(procurementitemstatus_id=4, 2, 3)");
        addBodyLine("    where id = OLD.procurementitem_id;");
        addBodyLine("");
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = IF(procurementitemstatus_id=2, 4, 5)");
        addBodyLine("    where id = NEW.procurementitem_id;");
        addBodyLine("");
        addBodyLine("    END IF;");
    }

}