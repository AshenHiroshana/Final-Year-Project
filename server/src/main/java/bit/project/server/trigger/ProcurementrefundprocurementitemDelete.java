package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementrefundprocurementitemDelete extends Trigger{

    @Override
    public String getName() {
        return "procurementrefundprocurementitem_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "procurementrefundprocurementitem";
    }

    public ProcurementrefundprocurementitemDelete(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 1");
        addBodyLine("    where id = OLD.procurementitem_id;");
    }

}
