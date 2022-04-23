package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ConsumeitemcategoryData extends AbstractSeedClass {

    public ConsumeitemcategoryData(){
        addIdNameData(1, "Printing item");
        addIdNameData(2, "Kitchen item");
        addIdNameData(3, "Stationary");
    }

}