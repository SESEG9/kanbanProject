package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.domain.TimeSlot;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, String> {}
