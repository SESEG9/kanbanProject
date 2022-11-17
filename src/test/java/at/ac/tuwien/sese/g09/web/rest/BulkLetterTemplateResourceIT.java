package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.BulkLetterTemplate;
import at.ac.tuwien.sese.g09.domain.enumeration.BulkLetterType;
import at.ac.tuwien.sese.g09.repository.BulkLetterTemplateRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link BulkLetterTemplateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BulkLetterTemplateResourceIT {

    private static final BulkLetterType DEFAULT_TYPE = BulkLetterType.BIRTHDAY;
    private static final BulkLetterType UPDATED_TYPE = BulkLetterType.DATE;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bulk-letter-templates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BulkLetterTemplateRepository bulkLetterTemplateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBulkLetterTemplateMockMvc;

    private BulkLetterTemplate bulkLetterTemplate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BulkLetterTemplate createEntity(EntityManager em) {
        BulkLetterTemplate bulkLetterTemplate = new BulkLetterTemplate()
            .type(DEFAULT_TYPE)
            .date(DEFAULT_DATE)
            .subject(DEFAULT_SUBJECT)
            .content(DEFAULT_CONTENT);
        return bulkLetterTemplate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BulkLetterTemplate createUpdatedEntity(EntityManager em) {
        BulkLetterTemplate bulkLetterTemplate = new BulkLetterTemplate()
            .type(UPDATED_TYPE)
            .date(UPDATED_DATE)
            .subject(UPDATED_SUBJECT)
            .content(UPDATED_CONTENT);
        return bulkLetterTemplate;
    }

    @BeforeEach
    public void initTest() {
        bulkLetterTemplate = createEntity(em);
    }

    @Test
    @Transactional
    void createBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeCreate = bulkLetterTemplateRepository.findAll().size();
        // Create the BulkLetterTemplate
        restBulkLetterTemplateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isCreated());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeCreate + 1);
        BulkLetterTemplate testBulkLetterTemplate = bulkLetterTemplateList.get(bulkLetterTemplateList.size() - 1);
        assertThat(testBulkLetterTemplate.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBulkLetterTemplate.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBulkLetterTemplate.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testBulkLetterTemplate.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createBulkLetterTemplateWithExistingId() throws Exception {
        // Create the BulkLetterTemplate with an existing ID
        bulkLetterTemplate.setId(1L);

        int databaseSizeBeforeCreate = bulkLetterTemplateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBulkLetterTemplateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBulkLetterTemplates() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        // Get all the bulkLetterTemplateList
        restBulkLetterTemplateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bulkLetterTemplate.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    void getBulkLetterTemplate() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        // Get the bulkLetterTemplate
        restBulkLetterTemplateMockMvc
            .perform(get(ENTITY_API_URL_ID, bulkLetterTemplate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bulkLetterTemplate.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBulkLetterTemplate() throws Exception {
        // Get the bulkLetterTemplate
        restBulkLetterTemplateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBulkLetterTemplate() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();

        // Update the bulkLetterTemplate
        BulkLetterTemplate updatedBulkLetterTemplate = bulkLetterTemplateRepository.findById(bulkLetterTemplate.getId()).get();
        // Disconnect from session so that the updates on updatedBulkLetterTemplate are not directly saved in db
        em.detach(updatedBulkLetterTemplate);
        updatedBulkLetterTemplate.type(UPDATED_TYPE).date(UPDATED_DATE).subject(UPDATED_SUBJECT).content(UPDATED_CONTENT);

        restBulkLetterTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBulkLetterTemplate.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBulkLetterTemplate))
            )
            .andExpect(status().isOk());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
        BulkLetterTemplate testBulkLetterTemplate = bulkLetterTemplateList.get(bulkLetterTemplateList.size() - 1);
        assertThat(testBulkLetterTemplate.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBulkLetterTemplate.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBulkLetterTemplate.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testBulkLetterTemplate.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bulkLetterTemplate.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBulkLetterTemplateWithPatch() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();

        // Update the bulkLetterTemplate using partial update
        BulkLetterTemplate partialUpdatedBulkLetterTemplate = new BulkLetterTemplate();
        partialUpdatedBulkLetterTemplate.setId(bulkLetterTemplate.getId());

        partialUpdatedBulkLetterTemplate.subject(UPDATED_SUBJECT).content(UPDATED_CONTENT);

        restBulkLetterTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBulkLetterTemplate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBulkLetterTemplate))
            )
            .andExpect(status().isOk());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
        BulkLetterTemplate testBulkLetterTemplate = bulkLetterTemplateList.get(bulkLetterTemplateList.size() - 1);
        assertThat(testBulkLetterTemplate.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBulkLetterTemplate.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBulkLetterTemplate.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testBulkLetterTemplate.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateBulkLetterTemplateWithPatch() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();

        // Update the bulkLetterTemplate using partial update
        BulkLetterTemplate partialUpdatedBulkLetterTemplate = new BulkLetterTemplate();
        partialUpdatedBulkLetterTemplate.setId(bulkLetterTemplate.getId());

        partialUpdatedBulkLetterTemplate.type(UPDATED_TYPE).date(UPDATED_DATE).subject(UPDATED_SUBJECT).content(UPDATED_CONTENT);

        restBulkLetterTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBulkLetterTemplate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBulkLetterTemplate))
            )
            .andExpect(status().isOk());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
        BulkLetterTemplate testBulkLetterTemplate = bulkLetterTemplateList.get(bulkLetterTemplateList.size() - 1);
        assertThat(testBulkLetterTemplate.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBulkLetterTemplate.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBulkLetterTemplate.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testBulkLetterTemplate.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bulkLetterTemplate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBulkLetterTemplate() throws Exception {
        int databaseSizeBeforeUpdate = bulkLetterTemplateRepository.findAll().size();
        bulkLetterTemplate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulkLetterTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bulkLetterTemplate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BulkLetterTemplate in the database
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBulkLetterTemplate() throws Exception {
        // Initialize the database
        bulkLetterTemplateRepository.saveAndFlush(bulkLetterTemplate);

        int databaseSizeBeforeDelete = bulkLetterTemplateRepository.findAll().size();

        // Delete the bulkLetterTemplate
        restBulkLetterTemplateMockMvc
            .perform(delete(ENTITY_API_URL_ID, bulkLetterTemplate.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BulkLetterTemplate> bulkLetterTemplateList = bulkLetterTemplateRepository.findAll();
        assertThat(bulkLetterTemplateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
