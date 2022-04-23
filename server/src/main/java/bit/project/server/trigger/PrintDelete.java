package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrintDelete extends Trigger{

    @Override
    public String getName() {
        return "print_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "print";
    }

    public PrintDelete(){
        addBodyLine("    update printorder set printorderstatus_id = 1 where id = OLD.printorder_id;");
    }

}