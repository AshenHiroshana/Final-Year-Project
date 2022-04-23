package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumeitempaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "consumeitempayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "consumeitempayment";
    }

    public ConsumeitempaymentDelete(){
        addBodyLine("    update consumeitempurchase set balance = balance + OLD.amount where id = OLD.consumeitempurchase_id;");
    }

}