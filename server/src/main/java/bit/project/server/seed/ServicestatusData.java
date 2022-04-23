package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ServicestatusData extends AbstractSeedClass {

    public ServicestatusData(){
        addIdNameData(1, "In Progress");
        addIdNameData(2, "Done");
        addIdNameData(3, "Canceled");
    }

}