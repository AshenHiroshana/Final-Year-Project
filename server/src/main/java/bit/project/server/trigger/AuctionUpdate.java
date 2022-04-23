package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class AuctionUpdate extends Trigger{

    @Override
    public String getName() {
        return "auction_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "auction";
    }

    public AuctionUpdate(){
        addBodyLine("");
        addBodyLine("    IF OLD.procurementitem_id != NEW.procurementitem_id THEN");
        addBodyLine("");
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 3");
        addBodyLine("    where id = OLD.procurementitem_id;");
        addBodyLine("");
        addBodyLine("    update procurementitem");
        addBodyLine("    set procurementitemstatus_id = 6");
        addBodyLine("    where id = NEW.procurementitem_id;");
        addBodyLine("");
        addBodyLine("    END IF;");
    }

}
