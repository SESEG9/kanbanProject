package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.EmailAttachment;
import at.ac.tuwien.sese.g09.repository.EmailAttachmentRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link EmailAttachmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmailAttachmentResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/email-attachments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmailAttachmentRepository emailAttachmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmailAttachmentMockMvc;

    private EmailAttachment emailAttachment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmailAttachment createEntity(EntityManager em) {
        EmailAttachment emailAttachment = new EmailAttachment().image(DEFAULT_IMAGE).imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return emailAttachment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmailAttachment createUpdatedEntity(EntityManager em) {
        EmailAttachment emailAttachment = new EmailAttachment().image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return emailAttachment;
    }

    @BeforeEach
    public void initTest() {
        emailAttachment = createEntity(em);
    }

    @Test
    @Transactional
    void createEmailAttachment() throws Exception {
        int databaseSizeBeforeCreate = emailAttachmentRepository.findAll().size();
        // Create the EmailAttachment
        restEmailAttachmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isCreated());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeCreate + 1);
        EmailAttachment testEmailAttachment = emailAttachmentList.get(emailAttachmentList.size() - 1);
        assertThat(testEmailAttachment.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testEmailAttachment.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createEmailAttachmentWithExistingId() throws Exception {
        // Create the EmailAttachment with an existing ID
        emailAttachment.setId(1L);

        int databaseSizeBeforeCreate = emailAttachmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmailAttachmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmailAttachments() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        // Get all the emailAttachmentList
        restEmailAttachmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emailAttachment.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getEmailAttachment() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        // Get the emailAttachment
        restEmailAttachmentMockMvc
            .perform(get(ENTITY_API_URL_ID, emailAttachment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emailAttachment.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingEmailAttachment() throws Exception {
        // Get the emailAttachment
        restEmailAttachmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmailAttachment() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();

        // Update the emailAttachment
        EmailAttachment updatedEmailAttachment = emailAttachmentRepository.findById(emailAttachment.getId()).get();
        // Disconnect from session so that the updates on updatedEmailAttachment are not directly saved in db
        em.detach(updatedEmailAttachment);
        updatedEmailAttachment.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restEmailAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmailAttachment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmailAttachment))
            )
            .andExpect(status().isOk());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
        EmailAttachment testEmailAttachment = emailAttachmentList.get(emailAttachmentList.size() - 1);
        assertThat(testEmailAttachment.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testEmailAttachment.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emailAttachment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmailAttachmentWithPatch() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();

        // Update the emailAttachment using partial update
        EmailAttachment partialUpdatedEmailAttachment = new EmailAttachment();
        partialUpdatedEmailAttachment.setId(emailAttachment.getId());

        restEmailAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmailAttachment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmailAttachment))
            )
            .andExpect(status().isOk());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
        EmailAttachment testEmailAttachment = emailAttachmentList.get(emailAttachmentList.size() - 1);
        assertThat(testEmailAttachment.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testEmailAttachment.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateEmailAttachmentWithPatch() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();

        // Update the emailAttachment using partial update
        EmailAttachment partialUpdatedEmailAttachment = new EmailAttachment();
        partialUpdatedEmailAttachment.setId(emailAttachment.getId());

        partialUpdatedEmailAttachment.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restEmailAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmailAttachment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmailAttachment))
            )
            .andExpect(status().isOk());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
        EmailAttachment testEmailAttachment = emailAttachmentList.get(emailAttachmentList.size() - 1);
        assertThat(testEmailAttachment.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testEmailAttachment.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emailAttachment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmailAttachment() throws Exception {
        int databaseSizeBeforeUpdate = emailAttachmentRepository.findAll().size();
        emailAttachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emailAttachment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmailAttachment in the database
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmailAttachment() throws Exception {
        // Initialize the database
        emailAttachmentRepository.saveAndFlush(emailAttachment);

        int databaseSizeBeforeDelete = emailAttachmentRepository.findAll().size();

        // Delete the emailAttachment
        restEmailAttachmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, emailAttachment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmailAttachment> emailAttachmentList = emailAttachmentRepository.findAll();
        assertThat(emailAttachmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
