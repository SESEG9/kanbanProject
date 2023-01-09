package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.TimeManagement;
import at.ac.tuwien.sese.g09.domain.TimeSlot;
import at.ac.tuwien.sese.g09.domain.User;
import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import at.ac.tuwien.sese.g09.repository.UserRepository;
import at.ac.tuwien.sese.g09.repository.VacationRepository;
import at.ac.tuwien.sese.g09.security.SecurityUtils;
import at.ac.tuwien.sese.g09.service.dto.TimeManagementDTO;
import at.ac.tuwien.sese.g09.service.dto.VacationApplicationDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VacationService {

    private static final String ENTITY_NAME = "vacation";

    private static final int YEARLY_VACATION_DAYS = 25;

    private final VacationRepository vacationRepository;
    private final UserRepository userRepository;

    private final TimeManagementService timeManagementService;

    public VacationService(
        UserRepository userRepository,
        VacationRepository vacationRepository,
        TimeManagementService timeManagementService
    ) {
        this.userRepository = userRepository;
        this.vacationRepository = vacationRepository;
        this.timeManagementService = timeManagementService;
    }

    private User getCurrentUser() {
        Optional<String> loggedInUserName = SecurityUtils.getCurrentUserLogin();
        if (loggedInUserName.isPresent()) {
            Optional<User> user = userRepository.findOneByLogin(loggedInUserName.get());
            return user.get();
        } else {
            throw new RuntimeException("Current User could not be determined");
        }
    }

    public Vacation applyForVacation(VacationApplicationDTO vacationApplicationDTO) {
        //validate application
        if (vacationApplicationDTO.getEnd().isBefore(vacationApplicationDTO.getStart())) {
            throw new BadRequestAlertException("Vacation application is invalid!", ENTITY_NAME, "startAfterEnd");
        }
        // check if user already has Vacations for this timespan
        List<Vacation> vacationsOverlapping = vacationRepository.findAllVacationsOverlappingWithUser(
            vacationApplicationDTO.getStart(),
            vacationApplicationDTO.getEnd(),
            getCurrentUser()
        );
        for (Vacation v : vacationsOverlapping) {
            if (v.getState() != VacationState.DECLINED) {
                throw new BadRequestAlertException(
                    "Vacation application is invalid! User has already a REQUESTED " + "or ACCEPTED application in this time frame",
                    ENTITY_NAME,
                    "startAfterEnd"
                );
            }
        }

        // link current user to the application
        Vacation newVacation = new Vacation();
        newVacation.setUser(getCurrentUser());

        // set start and end and the default status
        newVacation.setStart(vacationApplicationDTO.getStart());
        newVacation.setEnd(vacationApplicationDTO.getEnd());
        newVacation.setState(VacationState.REQUESTED);

        return vacationRepository.save(newVacation);
    }

    public int getRemainingVacationDays(LocalDate start, LocalDate end, boolean includeRequested) {
        User user = getCurrentUser();
        List<Vacation> vacations = vacationRepository.findAllVacationsOverlappingWithStateAndUser(start, end, VacationState.ACCEPTED, user);
        if (includeRequested) {
            vacations.addAll(vacationRepository.findAllVacationsOverlappingWithStateAndUser(start, end, VacationState.REQUESTED, user));
        }

        int vacationDays = 0;
        int daysOutsideOfRange = 0;
        // calculate precisely the remaining vacation days for the given timespan
        for (Vacation v : vacations) {
            if (v.getStart().isBefore(start)) {
                daysOutsideOfRange += ChronoUnit.DAYS.between(v.getStart(), start);
            }
            if (v.getEnd().isAfter(end)) {
                daysOutsideOfRange += ChronoUnit.DAYS.between(v.getEnd(), end);
            }
            vacationDays += ChronoUnit.DAYS.between(v.getStart(), v.getEnd()) + 1;
        }
        vacationDays = vacationDays - daysOutsideOfRange;

        return YEARLY_VACATION_DAYS - vacationDays;
    }

    public Vacation setState(Long id, VacationState state) {
        Vacation v = vacationRepository.getReferenceById(id);
        v.setState(state);
        Vacation response = vacationRepository.save(v);

        // update the workschedule of the user to vacation
        if (state == VacationState.ACCEPTED) {
            List<LocalDate> workdays = v.getStart().datesUntil(v.getEnd().plusDays(1)).collect(Collectors.toList());
            List<TimeManagement> workSchedules = timeManagementService.filterTimeManagement(
                Collections.singletonList(v.getUser().getId()),
                workdays,
                null
            );

            // delete existing workschedule
            for (TimeManagement tm : workSchedules) {
                timeManagementService.deleteTimeManagement(tm.getId());
            }

            TimeManagementDTO dto = new TimeManagementDTO();
            dto.setUserId(v.getUser().getId());
            // create workschedule of type vacation
            for (LocalDate workday : workdays) {
                dto.setWorkday(workday);
                dto.setTimeSlot("vacation");
                timeManagementService.createTimeManagement(dto);
            }
        }

        return response;
    }

    public List<Vacation> filterVacations(LocalDate start, LocalDate end, VacationState state, Boolean forCurrentUser) {
        List<Vacation> vacations;
        User user = null;
        if (forCurrentUser != null && forCurrentUser) {
            user = getCurrentUser();
        }

        if (start == null) {
            start = LocalDate.of(1, 1, 1);
        }
        if (end == null) {
            end = LocalDate.of(4000, 12, 31);
        }

        if (state != null && user != null) {
            vacations = vacationRepository.findAllVacationsOverlappingWithStateAndUser(start, end, state, user);
        } else if (user != null) {
            vacations = vacationRepository.findAllVacationsOverlappingWithUser(start, end, user);
        } else if (state != null) {
            vacations = vacationRepository.findAllVacationsOverlappingWithState(start, end, state);
        } else {
            vacations = vacationRepository.findAllVacationsOverlapping(start, end);
        }

        return vacations;
    }

    public Optional<Vacation> findById(Long id) {
        return vacationRepository.findById(id);
    }
}
