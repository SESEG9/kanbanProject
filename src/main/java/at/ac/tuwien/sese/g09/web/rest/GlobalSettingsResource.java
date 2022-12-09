package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.GlobalSettings;
import at.ac.tuwien.sese.g09.repository.GlobalSettingsRepository;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.GlobalSettings}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GlobalSettingsResource {

    private final Logger log = LoggerFactory.getLogger(GlobalSettingsResource.class);

    private static final String ENTITY_NAME = "globalSettings";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GlobalSettingsRepository globalSettingsRepository;

    public GlobalSettingsResource(GlobalSettingsRepository globalSettingsRepository) {
        this.globalSettingsRepository = globalSettingsRepository;
    }

    /**
     * {@code POST  /global-settings} : Create a new globalSettings.
     *
     * @param globalSettings the globalSettings to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new globalSettings, or with status {@code 400 (Bad Request)} if the globalSettings has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/global-settings")
    public ResponseEntity<GlobalSettings> createGlobalSettings(@RequestBody GlobalSettings globalSettings) throws URISyntaxException {
        log.debug("REST request to save GlobalSettings : {}", globalSettings);
        if (globalSettings.getId() != null) {
            throw new BadRequestAlertException("A new globalSettings cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GlobalSettings result = globalSettingsRepository.save(globalSettings);
        return ResponseEntity
            .created(new URI("/api/global-settings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /global-settings/:id} : Updates an existing globalSettings.
     *
     * @param id the id of the globalSettings to save.
     * @param globalSettings the globalSettings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalSettings,
     * or with status {@code 400 (Bad Request)} if the globalSettings is not valid,
     * or with status {@code 500 (Internal Server Error)} if the globalSettings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/global-settings/{id}")
    public ResponseEntity<GlobalSettings> updateGlobalSettings(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GlobalSettings globalSettings
    ) throws URISyntaxException {
        log.debug("REST request to update GlobalSettings : {}, {}", id, globalSettings);
        if (globalSettings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalSettings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalSettingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GlobalSettings result = globalSettingsRepository.save(globalSettings);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, globalSettings.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /global-settings/:id} : Partial updates given fields of an existing globalSettings, field will ignore if it is null
     *
     * @param id the id of the globalSettings to save.
     * @param globalSettings the globalSettings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalSettings,
     * or with status {@code 400 (Bad Request)} if the globalSettings is not valid,
     * or with status {@code 404 (Not Found)} if the globalSettings is not found,
     * or with status {@code 500 (Internal Server Error)} if the globalSettings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/global-settings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GlobalSettings> partialUpdateGlobalSettings(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GlobalSettings globalSettings
    ) throws URISyntaxException {
        log.debug("REST request to partial update GlobalSettings partially : {}, {}", id, globalSettings);
        if (globalSettings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalSettings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalSettingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GlobalSettings> result = globalSettingsRepository
            .findById(globalSettings.getId())
            .map(existingGlobalSettings -> {
                if (globalSettings.getCancelTime() != null) {
                    existingGlobalSettings.setCancelTime(globalSettings.getCancelTime());
                }

                return existingGlobalSettings;
            })
            .map(globalSettingsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, globalSettings.getId().toString())
        );
    }

    /**
     * {@code GET  /global-settings} : get all the globalSettings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of globalSettings in body.
     */
    @GetMapping("/global-settings")
    public List<GlobalSettings> getAllGlobalSettings() {
        log.debug("REST request to get all GlobalSettings");
        return globalSettingsRepository.findAll();
    }

    /**
     * {@code GET  /global-settings/:id} : get the "id" globalSettings.
     *
     * @param id the id of the globalSettings to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the globalSettings, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/global-settings/{id}")
    public ResponseEntity<GlobalSettings> getGlobalSettings(@PathVariable Long id) {
        log.debug("REST request to get GlobalSettings : {}", id);
        Optional<GlobalSettings> globalSettings = globalSettingsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(globalSettings);
    }

    /**
     * {@code DELETE  /global-settings/:id} : delete the "id" globalSettings.
     *
     * @param id the id of the globalSettings to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/global-settings/{id}")
    public ResponseEntity<Void> deleteGlobalSettings(@PathVariable Long id) {
        log.debug("REST request to delete GlobalSettings : {}", id);
        globalSettingsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
