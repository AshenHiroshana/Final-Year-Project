package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ConsumedistributionitemUpdate extends Trigger{

    @Override
    public String getName() {
        return "consumedistributionitem_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "consumedistributionitem";
    }

    public ConsumedistributionitemUpdate(){
        addBodyLine("    DECLARE deference int(10) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.consumeitem_id = NEW.consumeitem_id THEN");
        addBodyLine("        IF OLD.qty != NEW.qty THEN");
        addBodyLine("            SET deference = OLD.qty - NEW.qty;");
        addBodyLine("            update consumeitem set qty = qty + deference where id = NEW.consumeitem_id;");
        addBodyLine("        END IF;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.consumeitem_id != NEW.consumeitem_id THEN");
        addBodyLine("        update consumeitem set qty = qty + OLD.qty where id = OLD.consumeitem_id;");
        addBodyLine("        update consumeitem set qty = qty - NEW.qty where id = NEW.consumeitem_id;");
        addBodyLine("    END IF;");
    }

}