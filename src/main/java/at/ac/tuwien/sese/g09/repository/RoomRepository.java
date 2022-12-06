package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Room;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Room entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByIdentifyer(String identifyer);
}
