package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumeitempurchaseconsumeitemInsert extends Trigger{

    @Override
    public String getName() {
        return "consumeitempurchaseconsumeitem_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "consumeitempurchaseconsumeitem";
    }

    public ConsumeitempurchaseconsumeitemInsert(){
        addBodyLine("    update consumeitem set qty = qty + NEW.qty where id = NEW.consumeitem_id;");
    }

}