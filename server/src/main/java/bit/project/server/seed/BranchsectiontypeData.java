package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class BranchsectiontypeData extends AbstractSeedClass {

    public BranchsectiontypeData(){
        addIdNameData(1, "Lecture Hall");
        addIdNameData(2, "Office Room");
        addIdNameData(3, "Reception");
        addIdNameData(4, "Kitchen");
        addIdNameData(5, "Rest Area");
        addIdNameData(6, "Balcony");
    }

}