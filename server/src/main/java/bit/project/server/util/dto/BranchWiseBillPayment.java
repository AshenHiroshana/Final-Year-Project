package bit.project.server.util.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public interface BranchWiseBillPayment {
    String getAmount();
    String getBranch();
}
