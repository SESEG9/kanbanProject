package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.RoomCapacity;
import at.ac.tuwien.sese.g09.repository.RoomCapacityRepository;
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
 * Integration tests for the {@link RoomCapacityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoomCapacityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final String ENTITY_API_URL = "/api/room-capacities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoomCapacityRepository roomCapacityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoomCapacityMockMvc;

    private RoomCapacity roomCapacity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoomCapacity createEntity(EntityManager em) {
        RoomCapacity roomCapacity = new RoomCapacity().name(DEFAULT_NAME).capacity(DEFAULT_CAPACITY);
        return roomCapacity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoomCapacity createUpdatedEntity(EntityManager em) {
        RoomCapacity roomCapacity = new RoomCapacity().name(UPDATED_NAME).capacity(UPDATED_CAPACITY);
        return roomCapacity;
    }

    @BeforeEach
    public void initTest() {
        roomCapacity = createEntity(em);
    }

    @Test
    @Transactional
    void createRoomCapacity() throws Exception {
        int databaseSizeBeforeCreate = roomCapacityRepository.findAll().size();
        // Create the RoomCapacity
        restRoomCapacityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isCreated());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeCreate + 1);
        RoomCapacity testRoomCapacity = roomCapacityList.get(roomCapacityList.size() - 1);
        assertThat(testRoomCapacity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRoomCapacity.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
    }

    @Test
    @Transactional
    void createRoomCapacityWithExistingId() throws Exception {
        // Create the RoomCapacity with an existing ID
        roomCapacity.setId(1L);

        int databaseSizeBeforeCreate = roomCapacityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoomCapacityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRoomCapacities() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        // Get all the roomCapacityList
        restRoomCapacityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roomCapacity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)));
    }

    @Test
    @Transactional
    void getRoomCapacity() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        // Get the roomCapacity
        restRoomCapacityMockMvc
            .perform(get(ENTITY_API_URL_ID, roomCapacity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(roomCapacity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY));
    }

    @Test
    @Transactional
    void getNonExistingRoomCapacity() throws Exception {
        // Get the roomCapacity
        restRoomCapacityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoomCapacity() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();

        // Update the roomCapacity
        RoomCapacity updatedRoomCapacity = roomCapacityRepository.findById(roomCapacity.getId()).get();
        // Disconnect from session so that the updates on updatedRoomCapacity are not directly saved in db
        em.detach(updatedRoomCapacity);
        updatedRoomCapacity.name(UPDATED_NAME).capacity(UPDATED_CAPACITY);

        restRoomCapacityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoomCapacity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoomCapacity))
            )
            .andExpect(status().isOk());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
        RoomCapacity testRoomCapacity = roomCapacityList.get(roomCapacityList.size() - 1);
        assertThat(testRoomCapacity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRoomCapacity.getCapacity()).isEqualTo(UPDATED_CAPACITY);
    }

    @Test
    @Transactional
    void putNonExistingRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, roomCapacity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoomCapacityWithPatch() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();

        // Update the roomCapacity using partial update
        RoomCapacity partialUpdatedRoomCapacity = new RoomCapacity();
        partialUpdatedRoomCapacity.setId(roomCapacity.getId());

        partialUpdatedRoomCapacity.capacity(UPDATED_CAPACITY);

        restRoomCapacityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoomCapacity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoomCapacity))
            )
            .andExpect(status().isOk());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
        RoomCapacity testRoomCapacity = roomCapacityList.get(roomCapacityList.size() - 1);
        assertThat(testRoomCapacity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRoomCapacity.getCapacity()).isEqualTo(UPDATED_CAPACITY);
    }

    @Test
    @Transactional
    void fullUpdateRoomCapacityWithPatch() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();

        // Update the roomCapacity using partial update
        RoomCapacity partialUpdatedRoomCapacity = new RoomCapacity();
        partialUpdatedRoomCapacity.setId(roomCapacity.getId());

        partialUpdatedRoomCapacity.name(UPDATED_NAME).capacity(UPDATED_CAPACITY);

        restRoomCapacityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoomCapacity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoomCapacity))
            )
            .andExpect(status().isOk());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
        RoomCapacity testRoomCapacity = roomCapacityList.get(roomCapacityList.size() - 1);
        assertThat(testRoomCapacity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRoomCapacity.getCapacity()).isEqualTo(UPDATED_CAPACITY);
    }

    @Test
    @Transactional
    void patchNonExistingRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, roomCapacity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoomCapacity() throws Exception {
        int databaseSizeBeforeUpdate = roomCapacityRepository.findAll().size();
        roomCapacity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomCapacityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomCapacity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoomCapacity in the database
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoomCapacity() throws Exception {
        // Initialize the database
        roomCapacityRepository.saveAndFlush(roomCapacity);

        int databaseSizeBeforeDelete = roomCapacityRepository.findAll().size();

        // Delete the roomCapacity
        restRoomCapacityMockMvc
            .perform(delete(ENTITY_API_URL_ID, roomCapacity.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RoomCapacity> roomCapacityList = roomCapacityRepository.findAll();
        assertThat(roomCapacityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
