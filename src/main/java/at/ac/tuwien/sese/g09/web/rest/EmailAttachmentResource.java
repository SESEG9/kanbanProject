package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.EmailAttachment;
import at.ac.tuwien.sese.g09.repository.EmailAttachmentRepository;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.EmailAttachment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmailAttachmentResource {

    private final Logger log = LoggerFactory.getLogger(EmailAttachmentResource.class);

    private static final String ENTITY_NAME = "emailAttachment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmailAttachmentRepository emailAttachmentRepository;

    public EmailAttachmentResource(EmailAttachmentRepository emailAttachmentRepository) {
        this.emailAttachmentRepository = emailAttachmentRepository;
    }

    /**
     * {@code POST  /email-attachments} : Create a new emailAttachment.
     *
     * @param emailAttachment the emailAttachment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emailAttachment, or with status {@code 400 (Bad Request)} if the emailAttachment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/email-attachments")
    public ResponseEntity<EmailAttachment> createEmailAttachment(@RequestBody EmailAttachment emailAttachment) throws URISyntaxException {
        log.debug("REST request to save EmailAttachment : {}", emailAttachment);
        if (emailAttachment.getId() != null) {
            throw new BadRequestAlertException("A new emailAttachment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmailAttachment result = emailAttachmentRepository.save(emailAttachment);
        return ResponseEntity
            .created(new URI("/api/email-attachments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /email-attachments/:id} : Updates an existing emailAttachment.
     *
     * @param id the id of the emailAttachment to save.
     * @param emailAttachment the emailAttachment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emailAttachment,
     * or with status {@code 400 (Bad Request)} if the emailAttachment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emailAttachment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/email-attachments/{id}")
    public ResponseEntity<EmailAttachment> updateEmailAttachment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmailAttachment emailAttachment
    ) throws URISyntaxException {
        log.debug("REST request to update EmailAttachment : {}, {}", id, emailAttachment);
        if (emailAttachment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emailAttachment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emailAttachmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmailAttachment result = emailAttachmentRepository.save(emailAttachment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emailAttachment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /email-attachments/:id} : Partial updates given fields of an existing emailAttachment, field will ignore if it is null
     *
     * @param id the id of the emailAttachment to save.
     * @param emailAttachment the emailAttachment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emailAttachment,
     * or with status {@code 400 (Bad Request)} if the emailAttachment is not valid,
     * or with status {@code 404 (Not Found)} if the emailAttachment is not found,
     * or with status {@code 500 (Internal Server Error)} if the emailAttachment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/email-attachments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmailAttachment> partialUpdateEmailAttachment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmailAttachment emailAttachment
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmailAttachment partially : {}, {}", id, emailAttachment);
        if (emailAttachment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emailAttachment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emailAttachmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmailAttachment> result = emailAttachmentRepository
            .findById(emailAttachment.getId())
            .map(existingEmailAttachment -> {
                if (emailAttachment.getImage() != null) {
                    existingEmailAttachment.setImage(emailAttachment.getImage());
                }
                if (emailAttachment.getImageContentType() != null) {
                    existingEmailAttachment.setImageContentType(emailAttachment.getImageContentType());
                }

                return existingEmailAttachment;
            })
            .map(emailAttachmentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emailAttachment.getId().toString())
        );
    }

    /**
     * {@code GET  /email-attachments} : get all the emailAttachments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emailAttachments in body.
     */
    @GetMapping("/email-attachments")
    public List<EmailAttachment> getAllEmailAttachments() {
        log.debug("REST request to get all EmailAttachments");
        return emailAttachmentRepository.findAll();
    }

    /**
     * {@code GET  /email-attachments/:id} : get the "id" emailAttachment.
     *
     * @param id the id of the emailAttachment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emailAttachment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/email-attachments/{id}")
    public ResponseEntity<EmailAttachment> getEmailAttachment(@PathVariable Long id) {
        log.debug("REST request to get EmailAttachment : {}", id);
        Optional<EmailAttachment> emailAttachment = emailAttachmentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emailAttachment);
    }

    /**
     * {@code DELETE  /email-attachments/:id} : delete the "id" emailAttachment.
     *
     * @param id the id of the emailAttachment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/email-attachments/{id}")
    public ResponseEntity<Void> deleteEmailAttachment(@PathVariable Long id) {
        log.debug("REST request to delete EmailAttachment : {}", id);
        emailAttachmentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
