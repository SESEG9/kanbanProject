package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GlobalSettingsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GlobalSettings.class);
        GlobalSettings globalSettings1 = new GlobalSettings();
        globalSettings1.setId(1L);
        GlobalSettings globalSettings2 = new GlobalSettings();
        globalSettings2.setId(globalSettings1.getId());
        assertThat(globalSettings1).isEqualTo(globalSettings2);
        globalSettings2.setId(2L);
        assertThat(globalSettings1).isNotEqualTo(globalSettings2);
        globalSettings1.setId(null);
        assertThat(globalSettings1).isNotEqualTo(globalSettings2);
    }
}
