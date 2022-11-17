package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.WorkPackage;
import at.ac.tuwien.sese.g09.repository.WorkPackageRepository;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.WorkPackage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkPackageResource {

    private final Logger log = LoggerFactory.getLogger(WorkPackageResource.class);

    private static final String ENTITY_NAME = "workPackage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkPackageRepository workPackageRepository;

    public WorkPackageResource(WorkPackageRepository workPackageRepository) {
        this.workPackageRepository = workPackageRepository;
    }

    /**
     * {@code POST  /work-packages} : Create a new workPackage.
     *
     * @param workPackage the workPackage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workPackage, or with status {@code 400 (Bad Request)} if the workPackage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/work-packages")
    public ResponseEntity<WorkPackage> createWorkPackage(@RequestBody WorkPackage workPackage) throws URISyntaxException {
        log.debug("REST request to save WorkPackage : {}", workPackage);
        if (workPackage.getId() != null) {
            throw new BadRequestAlertException("A new workPackage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkPackage result = workPackageRepository.save(workPackage);
        return ResponseEntity
            .created(new URI("/api/work-packages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /work-packages/:id} : Updates an existing workPackage.
     *
     * @param id the id of the workPackage to save.
     * @param workPackage the workPackage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workPackage,
     * or with status {@code 400 (Bad Request)} if the workPackage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workPackage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/work-packages/{id}")
    public ResponseEntity<WorkPackage> updateWorkPackage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WorkPackage workPackage
    ) throws URISyntaxException {
        log.debug("REST request to update WorkPackage : {}, {}", id, workPackage);
        if (workPackage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workPackage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workPackageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WorkPackage result = workPackageRepository.save(workPackage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workPackage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /work-packages/:id} : Partial updates given fields of an existing workPackage, field will ignore if it is null
     *
     * @param id the id of the workPackage to save.
     * @param workPackage the workPackage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workPackage,
     * or with status {@code 400 (Bad Request)} if the workPackage is not valid,
     * or with status {@code 404 (Not Found)} if the workPackage is not found,
     * or with status {@code 500 (Internal Server Error)} if the workPackage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/work-packages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WorkPackage> partialUpdateWorkPackage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WorkPackage workPackage
    ) throws URISyntaxException {
        log.debug("REST request to partial update WorkPackage partially : {}, {}", id, workPackage);
        if (workPackage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workPackage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workPackageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WorkPackage> result = workPackageRepository
            .findById(workPackage.getId())
            .map(existingWorkPackage -> {
                if (workPackage.getStart() != null) {
                    existingWorkPackage.setStart(workPackage.getStart());
                }
                if (workPackage.getEnd() != null) {
                    existingWorkPackage.setEnd(workPackage.getEnd());
                }
                if (workPackage.getSummary() != null) {
                    existingWorkPackage.setSummary(workPackage.getSummary());
                }
                if (workPackage.getDescription() != null) {
                    existingWorkPackage.setDescription(workPackage.getDescription());
                }

                return existingWorkPackage;
            })
            .map(workPackageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workPackage.getId().toString())
        );
    }

    /**
     * {@code GET  /work-packages} : get all the workPackages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workPackages in body.
     */
    @GetMapping("/work-packages")
    public List<WorkPackage> getAllWorkPackages() {
        log.debug("REST request to get all WorkPackages");
        return workPackageRepository.findAll();
    }

    /**
     * {@code GET  /work-packages/:id} : get the "id" workPackage.
     *
     * @param id the id of the workPackage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workPackage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/work-packages/{id}")
    public ResponseEntity<WorkPackage> getWorkPackage(@PathVariable Long id) {
        log.debug("REST request to get WorkPackage : {}", id);
        Optional<WorkPackage> workPackage = workPackageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workPackage);
    }

    /**
     * {@code DELETE  /work-packages/:id} : delete the "id" workPackage.
     *
     * @param id the id of the workPackage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/work-packages/{id}")
    public ResponseEntity<Void> deleteWorkPackage(@PathVariable Long id) {
        log.debug("REST request to delete WorkPackage : {}", id);
        workPackageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
