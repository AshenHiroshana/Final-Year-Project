package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PaymentstatusData extends AbstractSeedClass {

    public PaymentstatusData(){
        addIdNameData(1, "Paid");
        addIdNameData(2, "Pending");
        addIdNameData(3, "Rejected");
    }

}