package at.ac.tuwien.sese.g09.service.mapper;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.RoomCapacity;
import at.ac.tuwien.sese.g09.domain.RoomPicture;
import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.service.dto.RoomResponseDTO;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RoomMapper {

    public RoomResponseDTO roomToRoomResponseDTO(Room room) {
        return new RoomResponseDTO(
            room.getId(),
            room.getIdentifyer(),
            room.getMaxCapacity(),
            room.getPrices().stream().map(this::roomPriceToRoomPriceResponseDTO).collect(Collectors.toSet()),
            room.getRoomPictures().stream().map(RoomPicture::getId).collect(Collectors.toSet())
        );
    }

    private RoomResponseDTO.RoomPriceResponseDTO roomPriceToRoomPriceResponseDTO(RoomPrice roomPrice) {
        return new RoomResponseDTO.RoomPriceResponseDTO(
            roomPrice.getId(),
            roomPrice.getPrice(),
            roomCategoryToRoomCategoryResponseDTO(roomPrice.getCapacity())
        );
    }

    private RoomResponseDTO.RoomCapacityResponseDTO roomCategoryToRoomCategoryResponseDTO(RoomCapacity roomCapacity) {
        return new RoomResponseDTO.RoomCapacityResponseDTO(roomCapacity.getId(), roomCapacity.getName(), roomCapacity.getCapacity());
    }
}
