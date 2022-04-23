package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ServicepaymentUpdate extends Trigger{

    @Override
    public String getName() {
        return "servicepayment_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "servicepayment";
    }

    public ServicepaymentUpdate(){
        addBodyLine("");
        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("        IF OLD.amount != NEW.amount THEN");
        addBodyLine("            SET deference = OLD.amount - NEW.amount;");
        addBodyLine("            update service set balance = balance + deference where id = NEW.service_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 2 AND NEW.paymentstatus_id = 3 THEN");
        addBodyLine("            update service set balance = balance + NEW.amount where id = NEW.service_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 3 AND NEW.paymentstatus_id = 2 THEN");
        addBodyLine("            update service set balance = balance - NEW.amount where id = NEW.service_id;");
        addBodyLine("        END IF;");
    }

}
