package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BulkLetterTemplateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BulkLetterTemplate.class);
        BulkLetterTemplate bulkLetterTemplate1 = new BulkLetterTemplate();
        bulkLetterTemplate1.setId(1L);
        BulkLetterTemplate bulkLetterTemplate2 = new BulkLetterTemplate();
        bulkLetterTemplate2.setId(bulkLetterTemplate1.getId());
        assertThat(bulkLetterTemplate1).isEqualTo(bulkLetterTemplate2);
        bulkLetterTemplate2.setId(2L);
        assertThat(bulkLetterTemplate1).isNotEqualTo(bulkLetterTemplate2);
        bulkLetterTemplate1.setId(null);
        assertThat(bulkLetterTemplate1).isNotEqualTo(bulkLetterTemplate2);
    }
}
