package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServicepaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "servicepayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "servicepayment";
    }

    public ServicepaymentDelete(){
        addBodyLine("    update service set balance = balance + OLD.amount where id = OLD.service_id;");
    }

}
