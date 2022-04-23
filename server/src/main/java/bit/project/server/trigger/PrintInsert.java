package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrintInsert extends Trigger{

    @Override
    public String getName() {
        return "print_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "print";
    }

    public PrintInsert(){
        addBodyLine("");
        addBodyLine("        update printorder set printorderstatus_id = 2 where id = NEW.printorder_id;");
    }

}