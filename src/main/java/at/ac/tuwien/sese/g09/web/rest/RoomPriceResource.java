package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.repository.RoomPriceRepository;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.RoomPrice}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoomPriceResource {

    private final Logger log = LoggerFactory.getLogger(RoomPriceResource.class);

    private static final String ENTITY_NAME = "roomPrice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoomPriceRepository roomPriceRepository;

    public RoomPriceResource(RoomPriceRepository roomPriceRepository) {
        this.roomPriceRepository = roomPriceRepository;
    }

    /**
     * {@code POST  /room-prices} : Create a new roomPrice.
     *
     * @param roomPrice the roomPrice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new roomPrice, or with status {@code 400 (Bad Request)} if the roomPrice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/room-prices")
    public ResponseEntity<RoomPrice> createRoomPrice(@RequestBody RoomPrice roomPrice) throws URISyntaxException {
        log.debug("REST request to save RoomPrice : {}", roomPrice);
        if (roomPrice.getId() != null) {
            throw new BadRequestAlertException("A new roomPrice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RoomPrice result = roomPriceRepository.save(roomPrice);
        return ResponseEntity
            .created(new URI("/api/room-prices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /room-prices/:id} : Updates an existing roomPrice.
     *
     * @param id the id of the roomPrice to save.
     * @param roomPrice the roomPrice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roomPrice,
     * or with status {@code 400 (Bad Request)} if the roomPrice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the roomPrice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/room-prices/{id}")
    public ResponseEntity<RoomPrice> updateRoomPrice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RoomPrice roomPrice
    ) throws URISyntaxException {
        log.debug("REST request to update RoomPrice : {}, {}", id, roomPrice);
        if (roomPrice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roomPrice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomPriceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RoomPrice result = roomPriceRepository.save(roomPrice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roomPrice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /room-prices/:id} : Partial updates given fields of an existing roomPrice, field will ignore if it is null
     *
     * @param id the id of the roomPrice to save.
     * @param roomPrice the roomPrice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roomPrice,
     * or with status {@code 400 (Bad Request)} if the roomPrice is not valid,
     * or with status {@code 404 (Not Found)} if the roomPrice is not found,
     * or with status {@code 500 (Internal Server Error)} if the roomPrice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/room-prices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RoomPrice> partialUpdateRoomPrice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RoomPrice roomPrice
    ) throws URISyntaxException {
        log.debug("REST request to partial update RoomPrice partially : {}, {}", id, roomPrice);
        if (roomPrice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roomPrice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomPriceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RoomPrice> result = roomPriceRepository
            .findById(roomPrice.getId())
            .map(existingRoomPrice -> {
                if (roomPrice.getPrice() != null) {
                    existingRoomPrice.setPrice(roomPrice.getPrice());
                }

                return existingRoomPrice;
            })
            .map(roomPriceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roomPrice.getId().toString())
        );
    }

    /**
     * {@code GET  /room-prices} : get all the roomPrices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of roomPrices in body.
     */
    @GetMapping("/room-prices")
    public List<RoomPrice> getAllRoomPrices() {
        log.debug("REST request to get all RoomPrices");
        return roomPriceRepository.findAll();
    }

    /**
     * {@code GET  /room-prices/:id} : get the "id" roomPrice.
     *
     * @param id the id of the roomPrice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the roomPrice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/room-prices/{id}")
    public ResponseEntity<RoomPrice> getRoomPrice(@PathVariable Long id) {
        log.debug("REST request to get RoomPrice : {}", id);
        Optional<RoomPrice> roomPrice = roomPriceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(roomPrice);
    }

    /**
     * {@code DELETE  /room-prices/:id} : delete the "id" roomPrice.
     *
     * @param id the id of the roomPrice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/room-prices/{id}")
    public ResponseEntity<Void> deleteRoomPrice(@PathVariable Long id) {
        log.debug("REST request to delete RoomPrice : {}", id);
        roomPriceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
