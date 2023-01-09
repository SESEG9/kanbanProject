package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.User;
import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import at.ac.tuwien.sese.g09.repository.UserRepository;
import at.ac.tuwien.sese.g09.repository.VacationRepository;
import at.ac.tuwien.sese.g09.security.SecurityUtils;
import at.ac.tuwien.sese.g09.service.dto.VacationApplicationDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VacationService {

    private static final String ENTITY_NAME = "vacation";

    private static final int YEARLY_VACATION_DAYS = 25;

    private final VacationRepository vacationRepository;
    private final UserRepository userRepository;

    public VacationService(UserRepository userRepository, VacationRepository vacationRepository) {
        this.userRepository = userRepository;
        this.vacationRepository = vacationRepository;
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
                daysOutsideOfRange += ChronoUnit.DAYS.between(start, v.getStart());
            }
            if (v.getEnd().isAfter(end)) {
                daysOutsideOfRange += ChronoUnit.DAYS.between(end, v.getEnd());
            }
            vacationDays += ChronoUnit.DAYS.between(v.getStart(), v.getEnd());
        }
        vacationDays = vacationDays - daysOutsideOfRange;

        return YEARLY_VACATION_DAYS - vacationDays;
    }

    public Vacation setState(Long id, VacationState state) {
        Vacation v = vacationRepository.getReferenceById(id);
        v.setState(state);
        return vacationRepository.save(v);
    }

    public List<Vacation> filterVacations(LocalDate start, LocalDate end, VacationState state, Boolean forCurrentUser) {
        List<Vacation> vacations;
        User user = null;
        if (forCurrentUser) {
            user = getCurrentUser();
        }

        if (state != null && user != null) {
            vacations = vacationRepository.findAllVacationsOverlappingWithStateAndUser(start, end, state, user);
        } else if (user != null) {
            vacations = vacationRepository.findAllVacationsOverlappingWithUser(start, end, user);
        } else {
            vacations = vacationRepository.findAllVacationsOverlapping(start, end);
        }

        return vacations;
    }

    public Optional<Vacation> findById(Long id) {
        return vacationRepository.findById(id);
    }
}
