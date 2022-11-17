package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Deficit;
import at.ac.tuwien.sese.g09.repository.DeficitRepository;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.Deficit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DeficitResource {

    private final Logger log = LoggerFactory.getLogger(DeficitResource.class);

    private static final String ENTITY_NAME = "deficit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DeficitRepository deficitRepository;

    public DeficitResource(DeficitRepository deficitRepository) {
        this.deficitRepository = deficitRepository;
    }

    /**
     * {@code POST  /deficits} : Create a new deficit.
     *
     * @param deficit the deficit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deficit, or with status {@code 400 (Bad Request)} if the deficit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deficits")
    public ResponseEntity<Deficit> createDeficit(@RequestBody Deficit deficit) throws URISyntaxException {
        log.debug("REST request to save Deficit : {}", deficit);
        if (deficit.getId() != null) {
            throw new BadRequestAlertException("A new deficit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Deficit result = deficitRepository.save(deficit);
        return ResponseEntity
            .created(new URI("/api/deficits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deficits/:id} : Updates an existing deficit.
     *
     * @param id the id of the deficit to save.
     * @param deficit the deficit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deficit,
     * or with status {@code 400 (Bad Request)} if the deficit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the deficit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deficits/{id}")
    public ResponseEntity<Deficit> updateDeficit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Deficit deficit)
        throws URISyntaxException {
        log.debug("REST request to update Deficit : {}, {}", id, deficit);
        if (deficit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deficit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deficitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Deficit result = deficitRepository.save(deficit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deficit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deficits/:id} : Partial updates given fields of an existing deficit, field will ignore if it is null
     *
     * @param id the id of the deficit to save.
     * @param deficit the deficit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deficit,
     * or with status {@code 400 (Bad Request)} if the deficit is not valid,
     * or with status {@code 404 (Not Found)} if the deficit is not found,
     * or with status {@code 500 (Internal Server Error)} if the deficit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deficits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Deficit> partialUpdateDeficit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Deficit deficit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Deficit partially : {}, {}", id, deficit);
        if (deficit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deficit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deficitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Deficit> result = deficitRepository
            .findById(deficit.getId())
            .map(existingDeficit -> {
                if (deficit.getDescription() != null) {
                    existingDeficit.setDescription(deficit.getDescription());
                }
                if (deficit.getState() != null) {
                    existingDeficit.setState(deficit.getState());
                }
                if (deficit.getDiscount() != null) {
                    existingDeficit.setDiscount(deficit.getDiscount());
                }

                return existingDeficit;
            })
            .map(deficitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deficit.getId().toString())
        );
    }

    /**
     * {@code GET  /deficits} : get all the deficits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of deficits in body.
     */
    @GetMapping("/deficits")
    public List<Deficit> getAllDeficits() {
        log.debug("REST request to get all Deficits");
        return deficitRepository.findAll();
    }

    /**
     * {@code GET  /deficits/:id} : get the "id" deficit.
     *
     * @param id the id of the deficit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deficit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deficits/{id}")
    public ResponseEntity<Deficit> getDeficit(@PathVariable Long id) {
        log.debug("REST request to get Deficit : {}", id);
        Optional<Deficit> deficit = deficitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(deficit);
    }

    /**
     * {@code DELETE  /deficits/:id} : delete the "id" deficit.
     *
     * @param id the id of the deficit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deficits/{id}")
    public ResponseEntity<Void> deleteDeficit(@PathVariable Long id) {
        log.debug("REST request to delete Deficit : {}", id);
        deficitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
