package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class VendortypeData extends AbstractSeedClass {

    public VendortypeData(){
        addIdNameData(1, "Person");
        addIdNameData(2, "Company");
    }

}