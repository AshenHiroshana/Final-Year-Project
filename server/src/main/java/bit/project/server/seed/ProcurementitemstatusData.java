package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ProcurementitemstatusData extends AbstractSeedClass {

    public ProcurementitemstatusData(){
        addIdNameData(1, "Just purchased");
        addIdNameData(2, "In use");
        addIdNameData(3, "Not in used");
        addIdNameData(4, "Maintaining");
        addIdNameData(5, "Repairing");
        addIdNameData(6, "Auctioned");
        addIdNameData(7, "Disposed");
        addIdNameData(8, "Returned");
    }

}
