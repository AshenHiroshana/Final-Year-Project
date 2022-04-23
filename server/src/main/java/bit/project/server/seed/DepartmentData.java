package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DepartmentData extends AbstractSeedClass {

    public DepartmentData(){
        addIdNameData(1, "HR");
        addIdNameData(2, "Academic");
        addIdNameData(3, "Administration");
        addIdNameData(4, "Printing");
        addIdNameData(5, "Accounting");
        addIdNameData(6, "Marketing");
        addIdNameData(7, "Exam");
    }

}