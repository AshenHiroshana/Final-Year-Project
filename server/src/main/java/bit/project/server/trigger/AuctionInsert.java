package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class AuctionInsert extends Trigger{

    @Override
    public String getName() {
        return "auction_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "auction";
    }

    public AuctionInsert(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 6");
        addBodyLine("    where id = NEW.procurementitem_id;");
    }

}
