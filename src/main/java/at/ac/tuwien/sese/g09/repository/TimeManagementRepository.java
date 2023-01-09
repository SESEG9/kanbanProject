package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.TimeManagement;
import at.ac.tuwien.sese.g09.domain.TimeSlot;
import at.ac.tuwien.sese.g09.domain.User;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeManagementRepository extends JpaRepository<TimeManagement, Long> {
    List<TimeManagement> findByUserInAndTimeSlotInAndWorkdayIn(List<User> users, List<TimeSlot> timeSlots, List<LocalDate> workdays);
    List<TimeManagement> findByUserIn(List<User> users);
    List<TimeManagement> findByTimeSlotIn(List<TimeSlot> timeSlots);
    List<TimeManagement> findByWorkdayIn(List<LocalDate> localDates);
}
