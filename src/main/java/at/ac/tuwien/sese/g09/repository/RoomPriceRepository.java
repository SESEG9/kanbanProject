package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.RoomPrice;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RoomPrice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoomPriceRepository extends JpaRepository<RoomPrice, Long> {
    RoomPrice findByCapacity_IdAndRoom_Id(Long capacityId, Long roomId);
}
