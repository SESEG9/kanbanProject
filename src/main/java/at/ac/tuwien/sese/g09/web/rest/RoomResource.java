package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.repository.RoomRepository;
import at.ac.tuwien.sese.g09.web.rest.errors.BadRequestAlertException;
import io.undertow.util.BadRequestException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.Room}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoomResource {

    private final Logger log = LoggerFactory.getLogger(RoomResource.class);

    private static final String ENTITY_NAME = "room";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoomRepository roomRepository;

    public RoomResource(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
     * {@code POST  /rooms} : Create a new room.
     *
     * @param room the room to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new room, or with status {@code 400 (Bad Request)} if the room has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rooms")
    public ResponseEntity<Room> createRoom(@Valid @RequestBody Room room) throws URISyntaxException, BadRequestException {
        log.debug("REST request to save Room : {}", room);
        room.getPrices().stream().map(Object::toString).forEach(log::debug);
        if (room.getId() != null) {
            throw new BadRequestAlertException("A new room cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (room.getIdentifyer() == null || room.getIdentifyer().isEmpty()) {
            throw new BadRequestAlertException("No identifyer provided in room!", ENTITY_NAME, "noIdentifier");
        }
        if (!roomRepository.findByIdentifyer(room.getIdentifyer()).isEmpty()) {
            throw new BadRequestAlertException("There already exists a room with this identifier", ENTITY_NAME, "identifierExists");
        }
        if (room.getMaxCapacity() <= 0) {
            throw new BadRequestAlertException("The capacity of a room must be >= 1", ENTITY_NAME, "capacityTooLow");
        }
        if (room.getPrices().stream().anyMatch(roomPrice -> roomPrice.getPrice() <= 0)) {
            throw new BadRequestAlertException("A price is not allowed to be zero or negative", ENTITY_NAME, "priceTooLow");
        }
        if (room.getPrices().stream().anyMatch(roomPrice -> roomPrice.getCapacity() == null)) {
            throw new BadRequestAlertException("A capacity must be set for all prices", ENTITY_NAME, "noCapacityForPrice");
        }
        if (room.getPrices().stream().anyMatch(roomPrice -> roomPrice.getCapacity().getCapacity() > room.getMaxCapacity())) {
            throw new BadRequestAlertException(
                "A chosen alignment succeeds max capacity of the room",
                ENTITY_NAME,
                "capacityExceedsMaximum"
            );
        }
        if (!room.getPrices().stream().map(roomPrice -> roomPrice.getCapacity().getId()).allMatch(new HashSet<>()::add)) {
            throw new BadRequestAlertException("An alignment was chosen multiple times", ENTITY_NAME, "duplicateCapacity");
        }

        Room result = roomRepository.save(room);
        return ResponseEntity
            .created(new URI("/api/rooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rooms/:id} : Updates an existing room.
     *
     * @param id the id of the room to save.
     * @param room the room to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated room,
     * or with status {@code 400 (Bad Request)} if the room is not valid,
     * or with status {@code 500 (Internal Server Error)} if the room couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rooms/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Room room)
        throws URISyntaxException {
        log.debug("REST request to update Room : {}, {}", id, room);
        if (room.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, room.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Room result = roomRepository.save(room);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, room.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rooms/:id} : Partial updates given fields of an existing room, field will ignore if it is null
     *
     * @param id the id of the room to save.
     * @param room the room to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated room,
     * or with status {@code 400 (Bad Request)} if the room is not valid,
     * or with status {@code 404 (Not Found)} if the room is not found,
     * or with status {@code 500 (Internal Server Error)} if the room couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Room> partialUpdateRoom(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Room room
    ) throws URISyntaxException {
        log.debug("REST request to partial update Room partially : {}, {}", id, room);
        if (room.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, room.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Room> result = roomRepository
            .findById(room.getId())
            .map(existingRoom -> {
                if (room.getIdentifyer() != null) {
                    existingRoom.setIdentifyer(room.getIdentifyer());
                }
                if (room.getMaxCapacity() != null) {
                    existingRoom.setMaxCapacity(room.getMaxCapacity());
                }

                return existingRoom;
            })
            .map(roomRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, room.getId().toString())
        );
    }

    /**
     * {@code GET  /rooms} : get all the rooms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rooms in body.
     */
    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        log.debug("REST request to get all Rooms");
        return roomRepository.findAll();
    }

    /**
     * {@code GET  /rooms/:id} : get the "id" room.
     *
     * @param id the id of the room to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the room, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rooms/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        log.debug("REST request to get Room : {}", id);
        Optional<Room> room = roomRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(room);
    }

    /**
     * {@code DELETE  /rooms/:id} : delete the "id" room.
     *
     * @param id the id of the room to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        log.debug("REST request to delete Room : {}", id);
        roomRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
