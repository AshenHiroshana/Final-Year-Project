package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementrefundprocurementitemInsert extends Trigger{

    @Override
    public String getName() {
        return "procurementrefundprocurementitem_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "procurementrefundprocurementitem";
    }

    public ProcurementrefundprocurementitemInsert(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 8");
        addBodyLine("    where id = NEW.procurementitem_id;");
    }

}
