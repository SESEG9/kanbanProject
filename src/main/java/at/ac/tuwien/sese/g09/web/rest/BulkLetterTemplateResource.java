package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.BulkLetterTemplate;
import at.ac.tuwien.sese.g09.repository.BulkLetterTemplateRepository;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.BulkLetterTemplate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BulkLetterTemplateResource {

    private final Logger log = LoggerFactory.getLogger(BulkLetterTemplateResource.class);

    private static final String ENTITY_NAME = "bulkLetterTemplate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BulkLetterTemplateRepository bulkLetterTemplateRepository;

    public BulkLetterTemplateResource(BulkLetterTemplateRepository bulkLetterTemplateRepository) {
        this.bulkLetterTemplateRepository = bulkLetterTemplateRepository;
    }

    /**
     * {@code POST  /bulk-letter-templates} : Create a new bulkLetterTemplate.
     *
     * @param bulkLetterTemplate the bulkLetterTemplate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bulkLetterTemplate, or with status {@code 400 (Bad Request)} if the bulkLetterTemplate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bulk-letter-templates")
    public ResponseEntity<BulkLetterTemplate> createBulkLetterTemplate(@RequestBody BulkLetterTemplate bulkLetterTemplate)
        throws URISyntaxException {
        log.debug("REST request to save BulkLetterTemplate : {}", bulkLetterTemplate);
        if (bulkLetterTemplate.getId() != null) {
            throw new BadRequestAlertException("A new bulkLetterTemplate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BulkLetterTemplate result = bulkLetterTemplateRepository.save(bulkLetterTemplate);
        return ResponseEntity
            .created(new URI("/api/bulk-letter-templates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bulk-letter-templates/:id} : Updates an existing bulkLetterTemplate.
     *
     * @param id the id of the bulkLetterTemplate to save.
     * @param bulkLetterTemplate the bulkLetterTemplate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bulkLetterTemplate,
     * or with status {@code 400 (Bad Request)} if the bulkLetterTemplate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bulkLetterTemplate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bulk-letter-templates/{id}")
    public ResponseEntity<BulkLetterTemplate> updateBulkLetterTemplate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BulkLetterTemplate bulkLetterTemplate
    ) throws URISyntaxException {
        log.debug("REST request to update BulkLetterTemplate : {}, {}", id, bulkLetterTemplate);
        if (bulkLetterTemplate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bulkLetterTemplate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bulkLetterTemplateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BulkLetterTemplate result = bulkLetterTemplateRepository.save(bulkLetterTemplate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bulkLetterTemplate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bulk-letter-templates/:id} : Partial updates given fields of an existing bulkLetterTemplate, field will ignore if it is null
     *
     * @param id the id of the bulkLetterTemplate to save.
     * @param bulkLetterTemplate the bulkLetterTemplate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bulkLetterTemplate,
     * or with status {@code 400 (Bad Request)} if the bulkLetterTemplate is not valid,
     * or with status {@code 404 (Not Found)} if the bulkLetterTemplate is not found,
     * or with status {@code 500 (Internal Server Error)} if the bulkLetterTemplate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bulk-letter-templates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BulkLetterTemplate> partialUpdateBulkLetterTemplate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BulkLetterTemplate bulkLetterTemplate
    ) throws URISyntaxException {
        log.debug("REST request to partial update BulkLetterTemplate partially : {}, {}", id, bulkLetterTemplate);
        if (bulkLetterTemplate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bulkLetterTemplate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bulkLetterTemplateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BulkLetterTemplate> result = bulkLetterTemplateRepository
            .findById(bulkLetterTemplate.getId())
            .map(existingBulkLetterTemplate -> {
                if (bulkLetterTemplate.getType() != null) {
                    existingBulkLetterTemplate.setType(bulkLetterTemplate.getType());
                }
                if (bulkLetterTemplate.getDate() != null) {
                    existingBulkLetterTemplate.setDate(bulkLetterTemplate.getDate());
                }
                if (bulkLetterTemplate.getSubject() != null) {
                    existingBulkLetterTemplate.setSubject(bulkLetterTemplate.getSubject());
                }
                if (bulkLetterTemplate.getContent() != null) {
                    existingBulkLetterTemplate.setContent(bulkLetterTemplate.getContent());
                }

                return existingBulkLetterTemplate;
            })
            .map(bulkLetterTemplateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bulkLetterTemplate.getId().toString())
        );
    }

    /**
     * {@code GET  /bulk-letter-templates} : get all the bulkLetterTemplates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bulkLetterTemplates in body.
     */
    @GetMapping("/bulk-letter-templates")
    public List<BulkLetterTemplate> getAllBulkLetterTemplates() {
        log.debug("REST request to get all BulkLetterTemplates");
        return bulkLetterTemplateRepository.findAll();
    }

    /**
     * {@code GET  /bulk-letter-templates/:id} : get the "id" bulkLetterTemplate.
     *
     * @param id the id of the bulkLetterTemplate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bulkLetterTemplate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bulk-letter-templates/{id}")
    public ResponseEntity<BulkLetterTemplate> getBulkLetterTemplate(@PathVariable Long id) {
        log.debug("REST request to get BulkLetterTemplate : {}", id);
        Optional<BulkLetterTemplate> bulkLetterTemplate = bulkLetterTemplateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bulkLetterTemplate);
    }

    /**
     * {@code DELETE  /bulk-letter-templates/:id} : delete the "id" bulkLetterTemplate.
     *
     * @param id the id of the bulkLetterTemplate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bulk-letter-templates/{id}")
    public ResponseEntity<Void> deleteBulkLetterTemplate(@PathVariable Long id) {
        log.debug("REST request to delete BulkLetterTemplate : {}", id);
        bulkLetterTemplateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
