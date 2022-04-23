package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class AuctionDelete extends Trigger{

    @Override
    public String getName() {
        return "auction_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "auction";
    }

    public AuctionDelete(){
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 3");
        addBodyLine("    where id = OLD.procurementitem_id;");
    }

}
