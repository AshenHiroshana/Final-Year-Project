package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementallocationprocurementitemDelete extends Trigger{

    @Override
    public String getName() {
        return "procurementallocationprocurementitem_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "procurementallocationprocurementitem";
    }

    public ProcurementallocationprocurementitemDelete(){
        addBodyLine("    update procurementitem set procurementitemstatus_id = 3 where id = OLD.procurementitem_id;");
    }

}