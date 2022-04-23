package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumedistributionitemDelete extends Trigger{

    @Override
    public String getName() {
        return "consumedistributionitem_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "consumedistributionitem";
    }

    public ConsumedistributionitemDelete(){
        addBodyLine("    update consumeitem set qty = qty + OLD.qty where id = OLD.consumeitem_id;");
    }

}