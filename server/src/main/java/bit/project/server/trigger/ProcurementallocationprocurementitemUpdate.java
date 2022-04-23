package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementallocationprocurementitemUpdate extends Trigger{

    @Override
    public String getName() {
        return "procurementallocationprocurementitem_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "procurementallocationprocurementitem";
    }

    public ProcurementallocationprocurementitemUpdate(){
        addBodyLine("");
        addBodyLine("    IF OLD.procurementitem_id != NEW.procurementitem_id THEN");
        addBodyLine("        update procurementitem set procurementitemstatus_id = 3 where id = OLD.procurementitem_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.allocationstatus_id = 2 THEN");
        addBodyLine("        update procurementitem set procurementitemstatus_id = 3 where id = NEW.procurementitem_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.allocationstatus_id = 1 THEN");
        addBodyLine("        update procurementitem set procurementitemstatus_id = 2 where id = NEW.procurementitem_id;");
        addBodyLine("    END IF;");
    }

}