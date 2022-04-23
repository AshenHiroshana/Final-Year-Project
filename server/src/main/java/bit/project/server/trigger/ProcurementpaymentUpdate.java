package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProcurementpaymentUpdate extends Trigger{

    @Override
    public String getName() {
        return "procurementpayment_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "procurementpayment";
    }

    public ProcurementpaymentUpdate(){
        addBodyLine("");
        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.amount != NEW.amount AND NEW.paymentstatus_id != 3 THEN");
        addBodyLine("        SET deference = OLD.amount - NEW.amount;");
        addBodyLine("        update procurementitempurchase set balance = balance + deference where id = NEW.procurementitempurchase_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.paymentstatus_id = 2 AND NEW.paymentstatus_id = 3 THEN");
        addBodyLine("        update procurementitempurchase set balance = balance + OLD.amount where id = OLD.procurementitempurchase_id;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.paymentstatus_id = 3 AND NEW.paymentstatus_id = 2 THEN");
        addBodyLine("        update procurementitempurchase set balance = balance - NEW.amount where id = NEW.procurementitempurchase_id;");
        addBodyLine("    END IF;");
    }

}
