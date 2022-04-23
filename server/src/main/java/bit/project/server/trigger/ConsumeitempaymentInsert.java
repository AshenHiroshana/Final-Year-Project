package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumeitempaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "consumeitempayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "consumeitempayment";
    }

    public ConsumeitempaymentInsert(){
        addBodyLine("    update consumeitempurchase set balance = balance - NEW.amount where id = NEW.consumeitempurchase_id;");
    }

}