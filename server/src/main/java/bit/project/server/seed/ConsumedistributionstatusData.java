package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ConsumedistributionstatusData extends AbstractSeedClass {

    public ConsumedistributionstatusData(){
        addIdNameData(1, "Send");
        addIdNameData(2, "Reserved");
    }

}