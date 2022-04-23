package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BranchsectionstatusData extends AbstractSeedClass {

    public BranchsectionstatusData(){
        addIdNameData(1, "Active");
        addIdNameData(2, "Not Exist");
        addIdNameData(3, "On Repair");
    }

}