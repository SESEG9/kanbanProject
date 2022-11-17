package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.Deficit;
import at.ac.tuwien.sese.g09.domain.enumeration.DeficitState;
import at.ac.tuwien.sese.g09.repository.DeficitRepository;
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
 * Integration tests for the {@link DeficitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeficitResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final DeficitState DEFAULT_STATE = DeficitState.NEW;
    private static final DeficitState UPDATED_STATE = DeficitState.IN_PROCESS;

    private static final Float DEFAULT_DISCOUNT = 1F;
    private static final Float UPDATED_DISCOUNT = 2F;

    private static final String ENTITY_API_URL = "/api/deficits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DeficitRepository deficitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeficitMockMvc;

    private Deficit deficit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Deficit createEntity(EntityManager em) {
        Deficit deficit = new Deficit().description(DEFAULT_DESCRIPTION).state(DEFAULT_STATE).discount(DEFAULT_DISCOUNT);
        return deficit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Deficit createUpdatedEntity(EntityManager em) {
        Deficit deficit = new Deficit().description(UPDATED_DESCRIPTION).state(UPDATED_STATE).discount(UPDATED_DISCOUNT);
        return deficit;
    }

    @BeforeEach
    public void initTest() {
        deficit = createEntity(em);
    }

    @Test
    @Transactional
    void createDeficit() throws Exception {
        int databaseSizeBeforeCreate = deficitRepository.findAll().size();
        // Create the Deficit
        restDeficitMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isCreated());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeCreate + 1);
        Deficit testDeficit = deficitList.get(deficitList.size() - 1);
        assertThat(testDeficit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDeficit.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testDeficit.getDiscount()).isEqualTo(DEFAULT_DISCOUNT);
    }

    @Test
    @Transactional
    void createDeficitWithExistingId() throws Exception {
        // Create the Deficit with an existing ID
        deficit.setId(1L);

        int databaseSizeBeforeCreate = deficitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeficitMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDeficits() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        // Get all the deficitList
        restDeficitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deficit.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].discount").value(hasItem(DEFAULT_DISCOUNT.doubleValue())));
    }

    @Test
    @Transactional
    void getDeficit() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        // Get the deficit
        restDeficitMockMvc
            .perform(get(ENTITY_API_URL_ID, deficit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(deficit.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.discount").value(DEFAULT_DISCOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingDeficit() throws Exception {
        // Get the deficit
        restDeficitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDeficit() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();

        // Update the deficit
        Deficit updatedDeficit = deficitRepository.findById(deficit.getId()).get();
        // Disconnect from session so that the updates on updatedDeficit are not directly saved in db
        em.detach(updatedDeficit);
        updatedDeficit.description(UPDATED_DESCRIPTION).state(UPDATED_STATE).discount(UPDATED_DISCOUNT);

        restDeficitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeficit.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDeficit))
            )
            .andExpect(status().isOk());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
        Deficit testDeficit = deficitList.get(deficitList.size() - 1);
        assertThat(testDeficit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDeficit.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testDeficit.getDiscount()).isEqualTo(UPDATED_DISCOUNT);
    }

    @Test
    @Transactional
    void putNonExistingDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deficit.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeficitWithPatch() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();

        // Update the deficit using partial update
        Deficit partialUpdatedDeficit = new Deficit();
        partialUpdatedDeficit.setId(deficit.getId());

        partialUpdatedDeficit.state(UPDATED_STATE).discount(UPDATED_DISCOUNT);

        restDeficitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeficit.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeficit))
            )
            .andExpect(status().isOk());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
        Deficit testDeficit = deficitList.get(deficitList.size() - 1);
        assertThat(testDeficit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDeficit.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testDeficit.getDiscount()).isEqualTo(UPDATED_DISCOUNT);
    }

    @Test
    @Transactional
    void fullUpdateDeficitWithPatch() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();

        // Update the deficit using partial update
        Deficit partialUpdatedDeficit = new Deficit();
        partialUpdatedDeficit.setId(deficit.getId());

        partialUpdatedDeficit.description(UPDATED_DESCRIPTION).state(UPDATED_STATE).discount(UPDATED_DISCOUNT);

        restDeficitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeficit.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeficit))
            )
            .andExpect(status().isOk());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
        Deficit testDeficit = deficitList.get(deficitList.size() - 1);
        assertThat(testDeficit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDeficit.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testDeficit.getDiscount()).isEqualTo(UPDATED_DISCOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deficit.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeficit() throws Exception {
        int databaseSizeBeforeUpdate = deficitRepository.findAll().size();
        deficit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeficitMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deficit))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deficit in the database
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeficit() throws Exception {
        // Initialize the database
        deficitRepository.saveAndFlush(deficit);

        int databaseSizeBeforeDelete = deficitRepository.findAll().size();

        // Delete the deficit
        restDeficitMockMvc
            .perform(delete(ENTITY_API_URL_ID, deficit.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Deficit> deficitList = deficitRepository.findAll();
        assertThat(deficitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
