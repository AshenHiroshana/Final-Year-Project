package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class AppointmentstatusData extends AbstractSeedClass {

    public AppointmentstatusData(){
        addIdNameData(1, "Active");
        addIdNameData(2, "Deactivated");
    }

}