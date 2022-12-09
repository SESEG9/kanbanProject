package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.RoomCapacity;
import at.ac.tuwien.sese.g09.repository.RoomCapacityRepository;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.RoomCapacity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoomCapacityResource {

    private final Logger log = LoggerFactory.getLogger(RoomCapacityResource.class);

    private static final String ENTITY_NAME = "roomCapacity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoomCapacityRepository roomCapacityRepository;

    public RoomCapacityResource(RoomCapacityRepository roomCapacityRepository) {
        this.roomCapacityRepository = roomCapacityRepository;
    }

    /**
     * {@code POST  /room-capacities} : Create a new roomCapacity.
     *
     * @param roomCapacity the roomCapacity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new roomCapacity, or with status {@code 400 (Bad Request)} if the roomCapacity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/room-capacities")
    public ResponseEntity<RoomCapacity> createRoomCapacity(@Valid @RequestBody RoomCapacity roomCapacity) throws URISyntaxException {
        log.debug("REST request to save RoomCapacity : {}", roomCapacity);
        if (roomCapacity.getId() != null) {
            throw new BadRequestAlertException("A new roomCapacity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RoomCapacity result = roomCapacityRepository.save(roomCapacity);
        return ResponseEntity
            .created(new URI("/api/room-capacities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /room-capacities/:id} : Updates an existing roomCapacity.
     *
     * @param id the id of the roomCapacity to save.
     * @param roomCapacity the roomCapacity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roomCapacity,
     * or with status {@code 400 (Bad Request)} if the roomCapacity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the roomCapacity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/room-capacities/{id}")
    public ResponseEntity<RoomCapacity> updateRoomCapacity(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RoomCapacity roomCapacity
    ) throws URISyntaxException {
        log.debug("REST request to update RoomCapacity : {}, {}", id, roomCapacity);
        if (roomCapacity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roomCapacity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomCapacityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RoomCapacity result = roomCapacityRepository.save(roomCapacity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roomCapacity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /room-capacities/:id} : Partial updates given fields of an existing roomCapacity, field will ignore if it is null
     *
     * @param id the id of the roomCapacity to save.
     * @param roomCapacity the roomCapacity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roomCapacity,
     * or with status {@code 400 (Bad Request)} if the roomCapacity is not valid,
     * or with status {@code 404 (Not Found)} if the roomCapacity is not found,
     * or with status {@code 500 (Internal Server Error)} if the roomCapacity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/room-capacities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RoomCapacity> partialUpdateRoomCapacity(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RoomCapacity roomCapacity
    ) throws URISyntaxException {
        log.debug("REST request to partial update RoomCapacity partially : {}, {}", id, roomCapacity);
        if (roomCapacity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roomCapacity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomCapacityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RoomCapacity> result = roomCapacityRepository
            .findById(roomCapacity.getId())
            .map(existingRoomCapacity -> {
                if (roomCapacity.getName() != null) {
                    existingRoomCapacity.setName(roomCapacity.getName());
                }
                if (roomCapacity.getCapacity() != null) {
                    existingRoomCapacity.setCapacity(roomCapacity.getCapacity());
                }

                return existingRoomCapacity;
            })
            .map(roomCapacityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roomCapacity.getId().toString())
        );
    }

    /**
     * {@code GET  /room-capacities} : get all the roomCapacities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of roomCapacities in body.
     */
    @GetMapping("/room-capacities")
    public List<RoomCapacity> getAllRoomCapacities() {
        log.debug("REST request to get all RoomCapacities");
        return roomCapacityRepository.findAll();
    }

    /**
     * {@code GET  /room-capacities/:id} : get the "id" roomCapacity.
     *
     * @param id the id of the roomCapacity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the roomCapacity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/room-capacities/{id}")
    public ResponseEntity<RoomCapacity> getRoomCapacity(@PathVariable Long id) {
        log.debug("REST request to get RoomCapacity : {}", id);
        Optional<RoomCapacity> roomCapacity = roomCapacityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(roomCapacity);
    }

    /**
     * {@code DELETE  /room-capacities/:id} : delete the "id" roomCapacity.
     *
     * @param id the id of the roomCapacity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/room-capacities/{id}")
    public ResponseEntity<Void> deleteRoomCapacity(@PathVariable Long id) {
        log.debug("REST request to delete RoomCapacity : {}", id);
        roomCapacityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
