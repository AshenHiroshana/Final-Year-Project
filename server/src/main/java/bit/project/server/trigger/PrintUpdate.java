package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrintUpdate extends Trigger{

    @Override
    public String getName() {
        return "print_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "print";
    }

    public PrintUpdate(){
        addBodyLine("");
        addBodyLine("    IF NEW.printorder_id != OLD.printorder_id THEN");
        addBodyLine("        update printorder set printorderstatus_id = 1 where id = OLD.printorder_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.printstatus_id = 1 THEN");
        addBodyLine("        update printorder set printorderstatus_id = 2 where id = NEW.printorder_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.printstatus_id = 2 THEN");
        addBodyLine("        update printorder set printorderstatus_id = 3 where id = NEW.printorder_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.printstatus_id = 3 THEN");
        addBodyLine("        update printorder set printorderstatus_id = 4 where id = NEW.printorder_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.printstatus_id = 4 THEN");
        addBodyLine("        update printorder set printorderstatus_id = 5 where id = NEW.printorder_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF NEW.printstatus_id = 5 THEN");
        addBodyLine("        update printorder set printorderstatus_id = 1 where id = NEW.printorder_id;");
        addBodyLine("    END IF;");
    }

}