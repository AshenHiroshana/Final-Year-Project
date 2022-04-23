package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementpaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "procurementpayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "procurementpayment";
    }

    public ProcurementpaymentDelete(){
        addBodyLine("    update procurementitempurchase set balance = balance + OLD.amount where id = OLD.procurementitempurchase_id;");
    }

}