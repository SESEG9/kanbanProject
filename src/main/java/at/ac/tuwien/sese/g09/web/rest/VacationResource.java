package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import at.ac.tuwien.sese.g09.repository.VacationRepository;
import at.ac.tuwien.sese.g09.service.VacationService;
import at.ac.tuwien.sese.g09.service.dto.RemainingDaysResponseDTO;
import at.ac.tuwien.sese.g09.service.dto.VacationApplicationDTO;
import at.ac.tuwien.sese.g09.service.dto.VacationUpdateDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.Vacation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VacationResource {

    private final Logger log = LoggerFactory.getLogger(VacationResource.class);

    private static final String ENTITY_NAME = "vacation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacationService vacationService;

    public VacationResource(VacationService vacationService) {
        this.vacationService = vacationService;
    }

    /**
     * {@code POST  /vacations} : Apply for a vacation.
     *
     * @param application the vacation application.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacation, or with status {@code 400 (Bad Request)} if the vacation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vacations/apply")
    public ResponseEntity<Vacation> createVacation(@RequestBody VacationApplicationDTO application) throws URISyntaxException {
        Vacation result = vacationService.applyForVacation(application);
        return ResponseEntity
            .created(new URI("/api/vacations/apply" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacations/:id} : Set state of a Vacation
     *
     * @param id the id of the vacation to save.
     * @param vacationUpdateDTO updated state.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacation,
     * or with status {@code 400 (Bad Request)} if the vacation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vacations/{id}")
    public ResponseEntity<Vacation> updateVacation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VacationUpdateDTO vacationUpdateDTO
    ) throws URISyntaxException {
        Vacation result = vacationService.setState(id, vacationUpdateDTO.getState());
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /vacations} : get all the vacations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacations in body.
     */
    @GetMapping("/vacations")
    public List<Vacation> getAllVacations(
        @RequestParam(required = false) LocalDate start,
        @RequestParam(required = false) LocalDate end,
        @RequestParam(required = false) VacationState state,
        @RequestParam(required = false) Boolean currentUserOnly
    ) {
        return vacationService.filterVacations(start, end, state, currentUserOnly);
    }

    /**
     * {@code GET  /vacations/:id} : get the "id" vacation.
     *
     * @param id the id of the vacation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vacations/{id}")
    public ResponseEntity<Vacation> getVacation(@PathVariable Long id) {
        log.debug("REST request to get Vacation : {}", id);
        Optional<Vacation> vacation = vacationService.findById(id);
        return ResponseUtil.wrapOrNotFound(vacation);
    }

    /**
     Get the remaining vacation days of the current user
     */
    @GetMapping("/vacations/remaining")
    public RemainingDaysResponseDTO getVacation(
        @RequestParam(required = true) int year,
        @RequestParam(required = true, defaultValue = "false") boolean includeRequested
    ) {
        RemainingDaysResponseDTO response = new RemainingDaysResponseDTO();
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        int days = vacationService.getRemainingVacationDays(start, end, includeRequested);
        response.setRemainingDays(days);
        return response;
    }
}
