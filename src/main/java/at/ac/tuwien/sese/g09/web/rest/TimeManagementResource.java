package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.TimeManagement;
import at.ac.tuwien.sese.g09.repository.TimeManagementRepository;
import at.ac.tuwien.sese.g09.service.TimeManagementService;
import at.ac.tuwien.sese.g09.service.dto.TimeManagementDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.TimeManagement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TimeManagementResource {

    private final Logger log = LoggerFactory.getLogger(TimeManagementResource.class);

    private static final String ENTITY_NAME = "timeManagment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimeManagementService timeManagementService;

    public TimeManagementResource(TimeManagementService timeManagementService) {
        this.timeManagementService = timeManagementService;
    }

    /**
     * {@code POST  /time-managements} : Create a new timeManagment.
     *
     * @param timeManagment the timeManagment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timeManagment, or with status {@code 400 (Bad Request)} if the timeManagment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/time-managements")
    public ResponseEntity<TimeManagement> createTimeManagement(@RequestBody TimeManagementDTO timeManagment) throws URISyntaxException {
        log.debug("REST request to save TimeManagement : {}", timeManagment);
        TimeManagement result = timeManagementService.createTimeManagement(timeManagment);
        return ResponseEntity
            .created(new URI("/api/time-managements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /time-managements} : get all the timeManagments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timeManagments in body.
     */
    @GetMapping("/time-managements")
    public List<TimeManagement> filterTimeManagements(
        @RequestParam(required = false) List<Long> userIds,
        @RequestParam(required = false) List<String> timeSlots,
        @RequestParam(required = false) List<LocalDate> workdays
    ) {
        log.debug("REST request to filter TimeManagements");
        return timeManagementService.filterTimeManagement(userIds, workdays, timeSlots);
    }

    /**
     * {@code GET  /time-managements} : get all the timeManagments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timeManagments in body.
     */
    @GetMapping("/time-management")
    public List<TimeManagement> getOwnTimeManagement() {
        log.debug("REST request to filter TimeManagements");
        return timeManagementService.filterTimeManagement();
    }

    /**
     * {@code DELETE  /time-managements/:id} : delete the "id" timeManagment.
     *
     * @param id the id of the timeManagment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/time-managements/{id}")
    public ResponseEntity<Void> deleteTimeManagement(@PathVariable Long id) {
        log.debug("REST request to delete TimeManagement : {}", id);
        timeManagementService.deleteTimeManagement(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
