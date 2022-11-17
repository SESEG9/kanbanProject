package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DeficitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Deficit.class);
        Deficit deficit1 = new Deficit();
        deficit1.setId(1L);
        Deficit deficit2 = new Deficit();
        deficit2.setId(deficit1.getId());
        assertThat(deficit1).isEqualTo(deficit2);
        deficit2.setId(2L);
        assertThat(deficit1).isNotEqualTo(deficit2);
        deficit1.setId(null);
        assertThat(deficit1).isNotEqualTo(deficit2);
    }
}
