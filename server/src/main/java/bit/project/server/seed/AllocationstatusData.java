package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class AllocationstatusData extends AbstractSeedClass {

    public AllocationstatusData(){
        addIdNameData(1, "Allocated");
        addIdNameData(2, "Deallocate");
    }

}