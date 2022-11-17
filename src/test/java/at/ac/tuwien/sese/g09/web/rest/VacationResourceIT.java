package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import at.ac.tuwien.sese.g09.repository.VacationRepository;
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
 * Integration tests for the {@link VacationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VacationResourceIT {

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final VacationState DEFAULT_STATE = VacationState.REQUESTED;
    private static final VacationState UPDATED_STATE = VacationState.ACCEPTED;

    private static final String ENTITY_API_URL = "/api/vacations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VacationRepository vacationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacationMockMvc;

    private Vacation vacation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacation createEntity(EntityManager em) {
        Vacation vacation = new Vacation().start(DEFAULT_START).end(DEFAULT_END).state(DEFAULT_STATE);
        return vacation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacation createUpdatedEntity(EntityManager em) {
        Vacation vacation = new Vacation().start(UPDATED_START).end(UPDATED_END).state(UPDATED_STATE);
        return vacation;
    }

    @BeforeEach
    public void initTest() {
        vacation = createEntity(em);
    }

    @Test
    @Transactional
    void createVacation() throws Exception {
        int databaseSizeBeforeCreate = vacationRepository.findAll().size();
        // Create the Vacation
        restVacationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isCreated());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeCreate + 1);
        Vacation testVacation = vacationList.get(vacationList.size() - 1);
        assertThat(testVacation.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testVacation.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testVacation.getState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    void createVacationWithExistingId() throws Exception {
        // Create the Vacation with an existing ID
        vacation.setId(1L);

        int databaseSizeBeforeCreate = vacationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVacations() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        // Get all the vacationList
        restVacationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacation.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())));
    }

    @Test
    @Transactional
    void getVacation() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        // Get the vacation
        restVacationMockMvc
            .perform(get(ENTITY_API_URL_ID, vacation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacation.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVacation() throws Exception {
        // Get the vacation
        restVacationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacation() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();

        // Update the vacation
        Vacation updatedVacation = vacationRepository.findById(vacation.getId()).get();
        // Disconnect from session so that the updates on updatedVacation are not directly saved in db
        em.detach(updatedVacation);
        updatedVacation.start(UPDATED_START).end(UPDATED_END).state(UPDATED_STATE);

        restVacationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVacation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVacation))
            )
            .andExpect(status().isOk());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
        Vacation testVacation = vacationList.get(vacationList.size() - 1);
        assertThat(testVacation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testVacation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testVacation.getState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    void putNonExistingVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacationWithPatch() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();

        // Update the vacation using partial update
        Vacation partialUpdatedVacation = new Vacation();
        partialUpdatedVacation.setId(vacation.getId());

        partialUpdatedVacation.start(UPDATED_START).end(UPDATED_END);

        restVacationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacation))
            )
            .andExpect(status().isOk());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
        Vacation testVacation = vacationList.get(vacationList.size() - 1);
        assertThat(testVacation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testVacation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testVacation.getState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    void fullUpdateVacationWithPatch() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();

        // Update the vacation using partial update
        Vacation partialUpdatedVacation = new Vacation();
        partialUpdatedVacation.setId(vacation.getId());

        partialUpdatedVacation.start(UPDATED_START).end(UPDATED_END).state(UPDATED_STATE);

        restVacationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacation))
            )
            .andExpect(status().isOk());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
        Vacation testVacation = vacationList.get(vacationList.size() - 1);
        assertThat(testVacation.getStart()).isEqualTo(UPDATED_START);
        assertThat(testVacation.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testVacation.getState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    void patchNonExistingVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacation() throws Exception {
        int databaseSizeBeforeUpdate = vacationRepository.findAll().size();
        vacation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacation in the database
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacation() throws Exception {
        // Initialize the database
        vacationRepository.saveAndFlush(vacation);

        int databaseSizeBeforeDelete = vacationRepository.findAll().size();

        // Delete the vacation
        restVacationMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vacation> vacationList = vacationRepository.findAll();
        assertThat(vacationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
