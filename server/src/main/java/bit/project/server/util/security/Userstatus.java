/*
 * Generated By Spring Data JPA Entity Generator
 * @author Niroshan Mendis
 */

package bit.project.server.util.security;

public enum Userstatus {
    ACTIVE("Active"),
    LOCKED("Locked"),
    DEACTIVATED("Deactivated");

    public final String value;

    Userstatus(String value){
        this.value = value;
    }

    @Override
    public String toString() {
       return this.value;
    }
}
