package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServicepaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "servicepayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "servicepayment";
    }

    public ServicepaymentInsert(){
        addBodyLine("    update service set balance = balance - NEW.amount where id = NEW.service_id;");
    }

}
