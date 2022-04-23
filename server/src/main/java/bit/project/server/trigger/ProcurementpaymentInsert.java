package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementpaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "procurementpayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "procurementpayment";
    }

    public ProcurementpaymentInsert(){
        addBodyLine("    update procurementitempurchase set balance = balance - NEW.amount where id = NEW.procurementitempurchase_id;");
    }

}