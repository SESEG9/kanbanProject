package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.WorkPackage;
import at.ac.tuwien.sese.g09.repository.WorkPackageRepository;
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

/**
 * Integration tests for the {@link WorkPackageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorkPackageResourceIT {

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/work-packages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkPackageRepository workPackageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkPackageMockMvc;

    private WorkPackage workPackage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkPackage createEntity(EntityManager em) {
        WorkPackage workPackage = new WorkPackage()
            .start(DEFAULT_START)
            .end(DEFAULT_END)
            .summary(DEFAULT_SUMMARY)
            .description(DEFAULT_DESCRIPTION);
        return workPackage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkPackage createUpdatedEntity(EntityManager em) {
        WorkPackage workPackage = new WorkPackage()
            .start(UPDATED_START)
            .end(UPDATED_END)
            .summary(UPDATED_SUMMARY)
            .description(UPDATED_DESCRIPTION);
        return workPackage;
    }

    @BeforeEach
    public void initTest() {
        workPackage = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkPackage() throws Exception {
        int databaseSizeBeforeCreate = workPackageRepository.findAll().size();
        // Create the WorkPackage
        restWorkPackageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isCreated());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeCreate + 1);
        WorkPackage testWorkPackage = workPackageList.get(workPackageList.size() - 1);
        assertThat(testWorkPackage.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testWorkPackage.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testWorkPackage.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testWorkPackage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createWorkPackageWithExistingId() throws Exception {
        // Create the WorkPackage with an existing ID
        workPackage.setId(1L);

        int databaseSizeBeforeCreate = workPackageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkPackageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWorkPackages() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        // Get all the workPackageList
        restWorkPackageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workPackage.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getWorkPackage() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        // Get the workPackage
        restWorkPackageMockMvc
            .perform(get(ENTITY_API_URL_ID, workPackage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workPackage.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingWorkPackage() throws Exception {
        // Get the workPackage
        restWorkPackageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWorkPackage() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();

        // Update the workPackage
        WorkPackage updatedWorkPackage = workPackageRepository.findById(workPackage.getId()).get();
        // Disconnect from session so that the updates on updatedWorkPackage are not directly saved in db
        em.detach(updatedWorkPackage);
        updatedWorkPackage.start(UPDATED_START).end(UPDATED_END).summary(UPDATED_SUMMARY).description(UPDATED_DESCRIPTION);

        restWorkPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorkPackage.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorkPackage))
            )
            .andExpect(status().isOk());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
        WorkPackage testWorkPackage = workPackageList.get(workPackageList.size() - 1);
        assertThat(testWorkPackage.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorkPackage.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorkPackage.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testWorkPackage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workPackage.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkPackageWithPatch() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();

        // Update the workPackage using partial update
        WorkPackage partialUpdatedWorkPackage = new WorkPackage();
        partialUpdatedWorkPackage.setId(workPackage.getId());

        partialUpdatedWorkPackage.end(UPDATED_END).summary(UPDATED_SUMMARY).description(UPDATED_DESCRIPTION);

        restWorkPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkPackage.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkPackage))
            )
            .andExpect(status().isOk());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
        WorkPackage testWorkPackage = workPackageList.get(workPackageList.size() - 1);
        assertThat(testWorkPackage.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testWorkPackage.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorkPackage.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testWorkPackage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateWorkPackageWithPatch() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();

        // Update the workPackage using partial update
        WorkPackage partialUpdatedWorkPackage = new WorkPackage();
        partialUpdatedWorkPackage.setId(workPackage.getId());

        partialUpdatedWorkPackage.start(UPDATED_START).end(UPDATED_END).summary(UPDATED_SUMMARY).description(UPDATED_DESCRIPTION);

        restWorkPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkPackage.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkPackage))
            )
            .andExpect(status().isOk());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
        WorkPackage testWorkPackage = workPackageList.get(workPackageList.size() - 1);
        assertThat(testWorkPackage.getStart()).isEqualTo(UPDATED_START);
        assertThat(testWorkPackage.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testWorkPackage.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testWorkPackage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workPackage.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkPackage() throws Exception {
        int databaseSizeBeforeUpdate = workPackageRepository.findAll().size();
        workPackage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkPackageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workPackage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkPackage in the database
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkPackage() throws Exception {
        // Initialize the database
        workPackageRepository.saveAndFlush(workPackage);

        int databaseSizeBeforeDelete = workPackageRepository.findAll().size();

        // Delete the workPackage
        restWorkPackageMockMvc
            .perform(delete(ENTITY_API_URL_ID, workPackage.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkPackage> workPackageList = workPackageRepository.findAll();
        assertThat(workPackageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
