package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.RoomCapacity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RoomCapacity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoomCapacityRepository extends JpaRepository<RoomCapacity, Long> {}
