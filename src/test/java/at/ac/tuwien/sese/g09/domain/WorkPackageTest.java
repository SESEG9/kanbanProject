package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WorkPackageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkPackage.class);
        WorkPackage workPackage1 = new WorkPackage();
        workPackage1.setId(1L);
        WorkPackage workPackage2 = new WorkPackage();
        workPackage2.setId(workPackage1.getId());
        assertThat(workPackage1).isEqualTo(workPackage2);
        workPackage2.setId(2L);
        assertThat(workPackage1).isNotEqualTo(workPackage2);
        workPackage1.setId(null);
        assertThat(workPackage1).isNotEqualTo(workPackage2);
    }
}
