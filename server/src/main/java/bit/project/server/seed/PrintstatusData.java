package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PrintstatusData extends AbstractSeedClass {

    public PrintstatusData(){
        addIdNameData(1, "Started");
        addIdNameData(2, "Finished");
        addIdNameData(3, "Send");
        addIdNameData(4, "Received");
        addIdNameData(5, "Canceled");
    }

}