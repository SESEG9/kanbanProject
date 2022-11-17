package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.GlobalSettings;
import at.ac.tuwien.sese.g09.repository.GlobalSettingsRepository;
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
 * Integration tests for the {@link GlobalSettingsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GlobalSettingsResourceIT {

    private static final Integer DEFAULT_CANCEL_TIME = 1;
    private static final Integer UPDATED_CANCEL_TIME = 2;

    private static final String ENTITY_API_URL = "/api/global-settings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GlobalSettingsRepository globalSettingsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGlobalSettingsMockMvc;

    private GlobalSettings globalSettings;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalSettings createEntity(EntityManager em) {
        GlobalSettings globalSettings = new GlobalSettings().cancelTime(DEFAULT_CANCEL_TIME);
        return globalSettings;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GlobalSettings createUpdatedEntity(EntityManager em) {
        GlobalSettings globalSettings = new GlobalSettings().cancelTime(UPDATED_CANCEL_TIME);
        return globalSettings;
    }

    @BeforeEach
    public void initTest() {
        globalSettings = createEntity(em);
    }

    @Test
    @Transactional
    void createGlobalSettings() throws Exception {
        int databaseSizeBeforeCreate = globalSettingsRepository.findAll().size();
        // Create the GlobalSettings
        restGlobalSettingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isCreated());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeCreate + 1);
        GlobalSettings testGlobalSettings = globalSettingsList.get(globalSettingsList.size() - 1);
        assertThat(testGlobalSettings.getCancelTime()).isEqualTo(DEFAULT_CANCEL_TIME);
    }

    @Test
    @Transactional
    void createGlobalSettingsWithExistingId() throws Exception {
        // Create the GlobalSettings with an existing ID
        globalSettings.setId(1L);

        int databaseSizeBeforeCreate = globalSettingsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGlobalSettingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGlobalSettings() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        // Get all the globalSettingsList
        restGlobalSettingsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(globalSettings.getId().intValue())))
            .andExpect(jsonPath("$.[*].cancelTime").value(hasItem(DEFAULT_CANCEL_TIME)));
    }

    @Test
    @Transactional
    void getGlobalSettings() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        // Get the globalSettings
        restGlobalSettingsMockMvc
            .perform(get(ENTITY_API_URL_ID, globalSettings.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(globalSettings.getId().intValue()))
            .andExpect(jsonPath("$.cancelTime").value(DEFAULT_CANCEL_TIME));
    }

    @Test
    @Transactional
    void getNonExistingGlobalSettings() throws Exception {
        // Get the globalSettings
        restGlobalSettingsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGlobalSettings() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();

        // Update the globalSettings
        GlobalSettings updatedGlobalSettings = globalSettingsRepository.findById(globalSettings.getId()).get();
        // Disconnect from session so that the updates on updatedGlobalSettings are not directly saved in db
        em.detach(updatedGlobalSettings);
        updatedGlobalSettings.cancelTime(UPDATED_CANCEL_TIME);

        restGlobalSettingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGlobalSettings.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGlobalSettings))
            )
            .andExpect(status().isOk());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
        GlobalSettings testGlobalSettings = globalSettingsList.get(globalSettingsList.size() - 1);
        assertThat(testGlobalSettings.getCancelTime()).isEqualTo(UPDATED_CANCEL_TIME);
    }

    @Test
    @Transactional
    void putNonExistingGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, globalSettings.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGlobalSettingsWithPatch() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();

        // Update the globalSettings using partial update
        GlobalSettings partialUpdatedGlobalSettings = new GlobalSettings();
        partialUpdatedGlobalSettings.setId(globalSettings.getId());

        partialUpdatedGlobalSettings.cancelTime(UPDATED_CANCEL_TIME);

        restGlobalSettingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalSettings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGlobalSettings))
            )
            .andExpect(status().isOk());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
        GlobalSettings testGlobalSettings = globalSettingsList.get(globalSettingsList.size() - 1);
        assertThat(testGlobalSettings.getCancelTime()).isEqualTo(UPDATED_CANCEL_TIME);
    }

    @Test
    @Transactional
    void fullUpdateGlobalSettingsWithPatch() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();

        // Update the globalSettings using partial update
        GlobalSettings partialUpdatedGlobalSettings = new GlobalSettings();
        partialUpdatedGlobalSettings.setId(globalSettings.getId());

        partialUpdatedGlobalSettings.cancelTime(UPDATED_CANCEL_TIME);

        restGlobalSettingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGlobalSettings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGlobalSettings))
            )
            .andExpect(status().isOk());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
        GlobalSettings testGlobalSettings = globalSettingsList.get(globalSettingsList.size() - 1);
        assertThat(testGlobalSettings.getCancelTime()).isEqualTo(UPDATED_CANCEL_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, globalSettings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isBadRequest());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGlobalSettings() throws Exception {
        int databaseSizeBeforeUpdate = globalSettingsRepository.findAll().size();
        globalSettings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGlobalSettingsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(globalSettings))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GlobalSettings in the database
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGlobalSettings() throws Exception {
        // Initialize the database
        globalSettingsRepository.saveAndFlush(globalSettings);

        int databaseSizeBeforeDelete = globalSettingsRepository.findAll().size();

        // Delete the globalSettings
        restGlobalSettingsMockMvc
            .perform(delete(ENTITY_API_URL_ID, globalSettings.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GlobalSettings> globalSettingsList = globalSettingsRepository.findAll();
        assertThat(globalSettingsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
