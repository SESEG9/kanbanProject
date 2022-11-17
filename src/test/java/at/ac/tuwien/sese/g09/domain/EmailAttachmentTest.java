package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmailAttachmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmailAttachment.class);
        EmailAttachment emailAttachment1 = new EmailAttachment();
        emailAttachment1.setId(1L);
        EmailAttachment emailAttachment2 = new EmailAttachment();
        emailAttachment2.setId(emailAttachment1.getId());
        assertThat(emailAttachment1).isEqualTo(emailAttachment2);
        emailAttachment2.setId(2L);
        assertThat(emailAttachment1).isNotEqualTo(emailAttachment2);
        emailAttachment1.setId(null);
        assertThat(emailAttachment1).isNotEqualTo(emailAttachment2);
    }
}
