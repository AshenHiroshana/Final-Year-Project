package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PrintorderstatusData extends AbstractSeedClass {

    public PrintorderstatusData(){
        addIdNameData(1, "Ordered");
        addIdNameData(2, "In Progress");
        addIdNameData(3, "Printed");
        addIdNameData(4, "Send");
        addIdNameData(5, "Received");
        addIdNameData(6, "Canceled");
    }

}