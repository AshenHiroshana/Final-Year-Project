package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumeitempurchaseconsumeitemDelete extends Trigger{

    @Override
    public String getName() {
        return "consumeitempurchaseconsumeitem_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "consumeitempurchaseconsumeitem";
    }

    public ConsumeitempurchaseconsumeitemDelete(){
        addBodyLine("    update consumeitem set qty = qty - OLD.qty where id = OLD.consumeitem_id;");
    }

}