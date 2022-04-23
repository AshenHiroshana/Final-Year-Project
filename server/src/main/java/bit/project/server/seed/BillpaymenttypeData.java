package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BillpaymenttypeData extends AbstractSeedClass {

    public BillpaymenttypeData(){
        addIdNameData(1, "Telephone");
        addIdNameData(2, "Internet");
        addIdNameData(3, "Electricity");
        addIdNameData(4, "Water");
        addIdNameData(5, "Other");
    }

}