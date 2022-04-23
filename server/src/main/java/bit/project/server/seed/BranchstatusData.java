package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BranchstatusData extends AbstractSeedClass {

    public BranchstatusData(){
        addIdNameData(1, "Open");
        addIdNameData(2, "Closed");
    }

}