package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.TimeManagement;
import at.ac.tuwien.sese.g09.domain.TimeSlot;
import at.ac.tuwien.sese.g09.domain.User;
import at.ac.tuwien.sese.g09.repository.TimeManagementRepository;
import at.ac.tuwien.sese.g09.repository.TimeSlotRepository;
import at.ac.tuwien.sese.g09.repository.UserRepository;
import at.ac.tuwien.sese.g09.security.SecurityUtils;
import at.ac.tuwien.sese.g09.service.dto.TimeManagementDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.util.*;
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

    public List<TimeManagement> filterTimeManagement(List<LocalDate> workdays, List<String> timeSlotNames) {
        Optional<String> loggedInUserName = SecurityUtils.getCurrentUserLogin();
        if (loggedInUserName.isPresent()) {
            Optional<User> user = userRepository.findOneByLogin(loggedInUserName.get());
            if (user.isPresent()) {
                return filterTimeManagement(List.of(user.get().getId()), workdays, timeSlotNames);
            }
        }
        throw new BadRequestAlertException("Logged in user not found!", ENTITY_NAME, "userNotFound");
    }

    public List<TimeManagement> filterTimeManagement(List<Long> userIds, List<LocalDate> workdays, List<String> timeSlotNames) {
        List<TimeManagement> response = new ArrayList<>();

        // in case no parameters specified find all
        if (
            (userIds == null || userIds.isEmpty()) &&
            (workdays == null || workdays.isEmpty()) &&
            (timeSlotNames == null || timeSlotNames.isEmpty())
        ) {
            return timeManagementRepository.findAll();
        }

        List<TimeManagement> filteredByUser = null;
        List<TimeManagement> filteredByTimeSlot = null;
        List<TimeManagement> filteredByWorkday = null;
        List<List<TimeManagement>> filtered = new ArrayList<>();

        if (userIds != null && !userIds.isEmpty()) {
            List<User> users = userRepository.findAllById(userIds);
            filteredByUser = timeManagementRepository.findByUserIn(users);
            if (filteredByUser.isEmpty()) {
                return new ArrayList<>();
            } else {
                response = filteredByUser;
            }
        }
        if (timeSlotNames != null && !timeSlotNames.isEmpty()) {
            List<TimeSlot> timeSlots = timeSlotRepository.findAllById(timeSlotNames);
            filteredByTimeSlot = timeManagementRepository.findByTimeSlotIn(timeSlots);
            if (filteredByTimeSlot.isEmpty()) {
                return new ArrayList<>();
            } else {
                if (response.isEmpty()) {
                    response = filteredByTimeSlot;
                } else {
                    filtered.add(filteredByTimeSlot);
                }
            }
        }
        if (workdays != null && !workdays.isEmpty()) {
            filteredByWorkday = timeManagementRepository.findByWorkdayIn(workdays);
            if (filteredByWorkday.isEmpty()) {
                return new ArrayList<>();
            } else {
                if (response.isEmpty()) {
                    response = filteredByWorkday;
                } else {
                    filtered.add(filteredByWorkday);
                }
            }
        }

        // intersect lists
        for (List<TimeManagement> list : filtered) {
            response.retainAll(list);
        }

        return response;
    }

    public void deleteTimeManagement(Long id) {
        timeManagementRepository.deleteById(id);
        timeManagementRepository.flush();
    }

    public void setVacation(TimeManagement tm) {
        TimeSlot vacationTimeSlot = timeSlotRepository.getReferenceById("vacation");
        tm.setTimeSlot(vacationTimeSlot);
        timeManagementRepository.save(tm);
    }
}
