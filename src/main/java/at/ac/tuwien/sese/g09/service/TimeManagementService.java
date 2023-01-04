package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.TimeManagement;
import at.ac.tuwien.sese.g09.domain.TimeSlot;
import at.ac.tuwien.sese.g09.domain.User;
import at.ac.tuwien.sese.g09.repository.TimeManagementRepository;
import at.ac.tuwien.sese.g09.repository.TimeSlotRepository;
import at.ac.tuwien.sese.g09.repository.UserRepository;
import at.ac.tuwien.sese.g09.service.dto.TimeManagementDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TimeManagementService {

    private static final String ENTITY_NAME = "time_management";

    private final TimeManagementRepository timeManagementRepository;
    private final UserRepository userRepository;

    private final TimeSlotRepository timeSlotRepository;

    public TimeManagementService(
        TimeManagementRepository timeManagementRepository,
        UserRepository userRepository,
        TimeSlotRepository timeSlotRepository
    ) {
        this.timeManagementRepository = timeManagementRepository;
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public TimeManagement createTimeManagement(TimeManagementDTO timeManagementDTO) {
        TimeManagement newTimeManagement = new TimeManagement();

        //validate user and time slot
        Optional<User> foundUser = userRepository.findById(timeManagementDTO.getUserId());
        if (foundUser.isPresent()) {
            newTimeManagement.setUser(foundUser.get());
        } else {
            throw new BadRequestAlertException(
                "User with ID " + timeManagementDTO.getUserId() + " does not exist!",
                ENTITY_NAME,
                "userNotFound"
            );
        }
        Optional<TimeSlot> foundTimeSlot = timeSlotRepository.findById(timeManagementDTO.getTimeSlot());
        if (foundTimeSlot.isPresent()) {
            newTimeManagement.setTimeSlot(foundTimeSlot.get());
        } else {
            throw new BadRequestAlertException(
                "Timeslot with ID " + timeManagementDTO.getTimeSlot() + " does not exist!",
                ENTITY_NAME,
                "timeSlotNotFound"
            );
        }

        newTimeManagement.setWorkday(timeManagementDTO.getWorkday());
        try {
            timeManagementRepository.save(newTimeManagement);
            timeManagementRepository.flush();
        } catch (Exception ex) {
            throw new BadRequestAlertException(
                "User with ID " + timeManagementDTO.getUserId() + " has already a schedule on this day!",
                ENTITY_NAME,
                "workDayOccupied"
            );
        }
        return newTimeManagement;
    }

    public List<TimeManagement> filterTimeManagement(List<Long> userIds, List<LocalDate> workdays, List<String> timeSlotNames) {
        List<User> users = new ArrayList<>();
        List<TimeSlot> timeSlots = new ArrayList<>();

        if (userIds == null) userIds = new ArrayList<>();
        if (workdays == null) workdays = new ArrayList<>();
        if (timeSlotNames == null) timeSlotNames = new ArrayList<>();

        if ((userIds.isEmpty()) && (workdays.isEmpty()) && (timeSlots.isEmpty())) {
            return timeManagementRepository.findAll();
        }
        if (!userIds.isEmpty()) {
            users = userRepository.findAllById(userIds);
        }
        if (!timeSlotNames.isEmpty()) {
            timeSlots = timeSlotRepository.findAllById(timeSlotNames);
        }

        return timeManagementRepository.findByUserIn(users);
    }

    public void deleteTimeManagement(Long id) {
        timeManagementRepository.deleteById(id);
    }
}
