package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.repository.VacationRepository;
import at.ac.tuwien.sese.g09.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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

    private final VacationRepository vacationRepository;

    public VacationResource(VacationRepository vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    /**
     * {@code POST  /vacations} : Create a new vacation.
     *
     * @param vacation the vacation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacation, or with status {@code 400 (Bad Request)} if the vacation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vacations")
    public ResponseEntity<Vacation> createVacation(@RequestBody Vacation vacation) throws URISyntaxException {
        log.debug("REST request to save Vacation : {}", vacation);
        if (vacation.getId() != null) {
            throw new BadRequestAlertException("A new vacation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vacation result = vacationRepository.save(vacation);
        return ResponseEntity
            .created(new URI("/api/vacations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacations/:id} : Updates an existing vacation.
     *
     * @param id the id of the vacation to save.
     * @param vacation the vacation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacation,
     * or with status {@code 400 (Bad Request)} if the vacation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vacations/{id}")
    public ResponseEntity<Vacation> updateVacation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacation vacation
    ) throws URISyntaxException {
        log.debug("REST request to update Vacation : {}, {}", id, vacation);
        if (vacation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vacation result = vacationRepository.save(vacation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vacations/:id} : Partial updates given fields of an existing vacation, field will ignore if it is null
     *
     * @param id the id of the vacation to save.
     * @param vacation the vacation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacation,
     * or with status {@code 400 (Bad Request)} if the vacation is not valid,
     * or with status {@code 404 (Not Found)} if the vacation is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vacations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vacation> partialUpdateVacation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacation vacation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vacation partially : {}, {}", id, vacation);
        if (vacation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vacation> result = vacationRepository
            .findById(vacation.getId())
            .map(existingVacation -> {
                if (vacation.getStart() != null) {
                    existingVacation.setStart(vacation.getStart());
                }
                if (vacation.getEnd() != null) {
                    existingVacation.setEnd(vacation.getEnd());
                }
                if (vacation.getState() != null) {
                    existingVacation.setState(vacation.getState());
                }

                return existingVacation;
            })
            .map(vacationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacation.getId().toString())
        );
    }

    /**
     * {@code GET  /vacations} : get all the vacations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacations in body.
     */
    @GetMapping("/vacations")
    public List<Vacation> getAllVacations() {
        log.debug("REST request to get all Vacations");
        return vacationRepository.findAll();
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
        Optional<Vacation> vacation = vacationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vacation);
    }

    /**
     * {@code DELETE  /vacations/:id} : delete the "id" vacation.
     *
     * @param id the id of the vacation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vacations/{id}")
    public ResponseEntity<Void> deleteVacation(@PathVariable Long id) {
        log.debug("REST request to delete Vacation : {}", id);
        vacationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
