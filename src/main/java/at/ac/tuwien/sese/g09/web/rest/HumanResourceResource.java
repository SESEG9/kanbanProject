package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.HumanResource;
import at.ac.tuwien.sese.g09.repository.HumanResourceRepository;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.HumanResource}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HumanResourceResource {

    private final Logger log = LoggerFactory.getLogger(HumanResourceResource.class);

    private static final String ENTITY_NAME = "humanResource";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HumanResourceRepository humanResourceRepository;

    public HumanResourceResource(HumanResourceRepository humanResourceRepository) {
        this.humanResourceRepository = humanResourceRepository;
    }

    /**
     * {@code POST  /human-resources} : Create a new humanResource.
     *
     * @param humanResource the humanResource to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new humanResource, or with status {@code 400 (Bad Request)} if the humanResource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/human-resources")
    public ResponseEntity<HumanResource> createHumanResource(@Valid @RequestBody HumanResource humanResource) throws URISyntaxException {
        log.debug("REST request to save HumanResource : {}", humanResource);
        if (humanResource.getId() != null) {
            throw new BadRequestAlertException("A new humanResource cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HumanResource result = humanResourceRepository.save(humanResource);
        return ResponseEntity
            .created(new URI("/api/human-resources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /human-resources/:id} : Updates an existing humanResource.
     *
     * @param id the id of the humanResource to save.
     * @param humanResource the humanResource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated humanResource,
     * or with status {@code 400 (Bad Request)} if the humanResource is not valid,
     * or with status {@code 500 (Internal Server Error)} if the humanResource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/human-resources/{id}")
    public ResponseEntity<HumanResource> updateHumanResource(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HumanResource humanResource
    ) throws URISyntaxException {
        log.debug("REST request to update HumanResource : {}, {}", id, humanResource);
        if (humanResource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, humanResource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!humanResourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HumanResource result = humanResourceRepository.save(humanResource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, humanResource.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /human-resources/:id} : Partial updates given fields of an existing humanResource, field will ignore if it is null
     *
     * @param id the id of the humanResource to save.
     * @param humanResource the humanResource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated humanResource,
     * or with status {@code 400 (Bad Request)} if the humanResource is not valid,
     * or with status {@code 404 (Not Found)} if the humanResource is not found,
     * or with status {@code 500 (Internal Server Error)} if the humanResource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/human-resources/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HumanResource> partialUpdateHumanResource(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HumanResource humanResource
    ) throws URISyntaxException {
        log.debug("REST request to partial update HumanResource partially : {}, {}", id, humanResource);
        if (humanResource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, humanResource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!humanResourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HumanResource> result = humanResourceRepository
            .findById(humanResource.getId())
            .map(existingHumanResource -> {
                if (humanResource.getType() != null) {
                    existingHumanResource.setType(humanResource.getType());
                }
                if (humanResource.getAbbr() != null) {
                    existingHumanResource.setAbbr(humanResource.getAbbr());
                }
                if (humanResource.getName() != null) {
                    existingHumanResource.setName(humanResource.getName());
                }
                if (humanResource.getBirthday() != null) {
                    existingHumanResource.setBirthday(humanResource.getBirthday());
                }
                if (humanResource.getGender() != null) {
                    existingHumanResource.setGender(humanResource.getGender());
                }
                if (humanResource.getPhone() != null) {
                    existingHumanResource.setPhone(humanResource.getPhone());
                }
                if (humanResource.getEmail() != null) {
                    existingHumanResource.setEmail(humanResource.getEmail());
                }
                if (humanResource.getSsn() != null) {
                    existingHumanResource.setSsn(humanResource.getSsn());
                }
                if (humanResource.getBannking() != null) {
                    existingHumanResource.setBannking(humanResource.getBannking());
                }
                if (humanResource.getRelationshipType() != null) {
                    existingHumanResource.setRelationshipType(humanResource.getRelationshipType());
                }

                return existingHumanResource;
            })
            .map(humanResourceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, humanResource.getId().toString())
        );
    }

    /**
     * {@code GET  /human-resources} : get all the humanResources.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of humanResources in body.
     */
    @GetMapping("/human-resources")
    public List<HumanResource> getAllHumanResources() {
        log.debug("REST request to get all HumanResources");
        return humanResourceRepository.findAll();
    }

    /**
     * {@code GET  /human-resources/:id} : get the "id" humanResource.
     *
     * @param id the id of the humanResource to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the humanResource, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/human-resources/{id}")
    public ResponseEntity<HumanResource> getHumanResource(@PathVariable Long id) {
        log.debug("REST request to get HumanResource : {}", id);
        Optional<HumanResource> humanResource = humanResourceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(humanResource);
    }

    /**
     * {@code DELETE  /human-resources/:id} : delete the "id" humanResource.
     *
     * @param id the id of the humanResource to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/human-resources/{id}")
    public ResponseEntity<Void> deleteHumanResource(@PathVariable Long id) {
        log.debug("REST request to delete HumanResource : {}", id);
        humanResourceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
