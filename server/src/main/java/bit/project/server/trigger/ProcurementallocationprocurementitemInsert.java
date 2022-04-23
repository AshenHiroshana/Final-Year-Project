package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementallocationprocurementitemInsert extends Trigger{

    @Override
    public String getName() {
        return "procurementallocationprocurementitem_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "procurementallocationprocurementitem";
    }

    public ProcurementallocationprocurementitemInsert(){
        addBodyLine("    update procurementitem set procurementitemstatus_id = 2 where id = NEW.procurementitem_id;");
    }

}