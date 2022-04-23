package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BuyingconditionData extends AbstractSeedClass {

    public BuyingconditionData(){
        addIdNameData(1, "Brand new");
        addIdNameData(2, "Second hand");
    }

}