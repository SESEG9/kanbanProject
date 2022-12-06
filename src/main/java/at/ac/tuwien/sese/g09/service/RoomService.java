package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.repository.RoomRepository;
import at.ac.tuwien.sese.g09.web.rest.errors.BadRequestAlertException;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RoomService {

    private static final String ENTITY_NAME = "room";

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
     * <p>Create a new room corresponding to the provided room entity</p>
     *
     * <p>In the provided room, the id is not allowed to be set.</p>
     *
     * @param room The room to be saved
     * @return The saved room entity
     */
    public Room createRoom(final Room room) {
        validateRoomForCreation(room);
        return roomRepository.save(room);
    }

    private void validateRoomForCreation(final Room room) {
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
    }

    /**
     * <p>Update the room at the provided id with the updated entity</p>
     *
     * @param id   The ID of the room to be updated
     * @param room The entity this room should be updated to
     * @return The updated room entity
     */
    public Room updateRoom(final Long id, final Room room) {
        if (room.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, room.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        return roomRepository.save(room);
    }

    public Optional<Room> partialUpdateRoom(final Long id, final Room room) {
        if (room.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, room.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        return roomRepository
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
    }

    /**
     * <p>Get a list containing all Rooms currently saved.</p>
     *
     * @return A list containing all rooms in the system
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * <p>Get the room entity corresponding to the provided ID</p>
     *
     * @param id The ID to get the room for
     * @return The room corresponding to the provided ID or an empty optional, if no room exists for the provided ID
     */
    public Optional<Room> getRoom(final Long id) {
        return roomRepository.findById(id);
    }

    /**
     * <p>Delete the room stored under the provided ID</p>
     *
     * @param id The ID of the room to be deleted
     */
    public void deleteRoom(final Long id) {
        roomRepository.deleteById(id);
    }
}
