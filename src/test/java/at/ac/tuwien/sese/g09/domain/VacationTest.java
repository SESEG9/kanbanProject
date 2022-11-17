package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VacationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vacation.class);
        Vacation vacation1 = new Vacation();
        vacation1.setId(1L);
        Vacation vacation2 = new Vacation();
        vacation2.setId(vacation1.getId());
        assertThat(vacation1).isEqualTo(vacation2);
        vacation2.setId(2L);
        assertThat(vacation1).isNotEqualTo(vacation2);
        vacation1.setId(null);
        assertThat(vacation1).isNotEqualTo(vacation2);
    }
}
