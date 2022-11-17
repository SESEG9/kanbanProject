package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.repository.RoomPriceRepository;
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
 * Integration tests for the {@link RoomPriceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoomPriceResourceIT {

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final String ENTITY_API_URL = "/api/room-prices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoomPriceRepository roomPriceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoomPriceMockMvc;

    private RoomPrice roomPrice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoomPrice createEntity(EntityManager em) {
        RoomPrice roomPrice = new RoomPrice().price(DEFAULT_PRICE);
        return roomPrice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoomPrice createUpdatedEntity(EntityManager em) {
        RoomPrice roomPrice = new RoomPrice().price(UPDATED_PRICE);
        return roomPrice;
    }

    @BeforeEach
    public void initTest() {
        roomPrice = createEntity(em);
    }

    @Test
    @Transactional
    void createRoomPrice() throws Exception {
        int databaseSizeBeforeCreate = roomPriceRepository.findAll().size();
        // Create the RoomPrice
        restRoomPriceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isCreated());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeCreate + 1);
        RoomPrice testRoomPrice = roomPriceList.get(roomPriceList.size() - 1);
        assertThat(testRoomPrice.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createRoomPriceWithExistingId() throws Exception {
        // Create the RoomPrice with an existing ID
        roomPrice.setId(1L);

        int databaseSizeBeforeCreate = roomPriceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoomPriceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRoomPrices() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        // Get all the roomPriceList
        restRoomPriceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roomPrice.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getRoomPrice() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        // Get the roomPrice
        restRoomPriceMockMvc
            .perform(get(ENTITY_API_URL_ID, roomPrice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(roomPrice.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE));
    }

    @Test
    @Transactional
    void getNonExistingRoomPrice() throws Exception {
        // Get the roomPrice
        restRoomPriceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoomPrice() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();

        // Update the roomPrice
        RoomPrice updatedRoomPrice = roomPriceRepository.findById(roomPrice.getId()).get();
        // Disconnect from session so that the updates on updatedRoomPrice are not directly saved in db
        em.detach(updatedRoomPrice);
        updatedRoomPrice.price(UPDATED_PRICE);

        restRoomPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoomPrice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoomPrice))
            )
            .andExpect(status().isOk());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
        RoomPrice testRoomPrice = roomPriceList.get(roomPriceList.size() - 1);
        assertThat(testRoomPrice.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, roomPrice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoomPriceWithPatch() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();

        // Update the roomPrice using partial update
        RoomPrice partialUpdatedRoomPrice = new RoomPrice();
        partialUpdatedRoomPrice.setId(roomPrice.getId());

        restRoomPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoomPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoomPrice))
            )
            .andExpect(status().isOk());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
        RoomPrice testRoomPrice = roomPriceList.get(roomPriceList.size() - 1);
        assertThat(testRoomPrice.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateRoomPriceWithPatch() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();

        // Update the roomPrice using partial update
        RoomPrice partialUpdatedRoomPrice = new RoomPrice();
        partialUpdatedRoomPrice.setId(roomPrice.getId());

        partialUpdatedRoomPrice.price(UPDATED_PRICE);

        restRoomPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoomPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoomPrice))
            )
            .andExpect(status().isOk());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
        RoomPrice testRoomPrice = roomPriceList.get(roomPriceList.size() - 1);
        assertThat(testRoomPrice.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, roomPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoomPrice() throws Exception {
        int databaseSizeBeforeUpdate = roomPriceRepository.findAll().size();
        roomPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomPriceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roomPrice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoomPrice in the database
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoomPrice() throws Exception {
        // Initialize the database
        roomPriceRepository.saveAndFlush(roomPrice);

        int databaseSizeBeforeDelete = roomPriceRepository.findAll().size();

        // Delete the roomPrice
        restRoomPriceMockMvc
            .perform(delete(ENTITY_API_URL_ID, roomPrice.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RoomPrice> roomPriceList = roomPriceRepository.findAll();
        assertThat(roomPriceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
