package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class MaterialtypeData extends AbstractSeedClass {

    public MaterialtypeData(){
        addIdNameData(1, "Book");
        addIdNameData(2, "Past paper");
        addIdNameData(3, "Tute");
        addIdNameData(4, "Other");
    }

}