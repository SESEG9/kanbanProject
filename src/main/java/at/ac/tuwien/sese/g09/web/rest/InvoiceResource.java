package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Invoice;
import at.ac.tuwien.sese.g09.repository.InvoiceRepository;
import at.ac.tuwien.sese.g09.service.InvoiceService;
import at.ac.tuwien.sese.g09.service.dto.InvoiceDTO;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.Invoice}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InvoiceResource {

    private final Logger log = LoggerFactory.getLogger(InvoiceResource.class);

    private static final String ENTITY_NAME = "invoice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InvoiceRepository invoiceRepository;
    private final InvoiceService invoiceService;

    public InvoiceResource(InvoiceRepository invoiceRepository, InvoiceService invoiceService) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceService = invoiceService;
    }

    /**
     * {@code POST  /invoices} : Create a new invoice.
     *
     * @param invoice the invoice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new invoice, or with status {@code 400 (Bad Request)} if the invoice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/invoices")
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceDTO invoice) throws URISyntaxException {
        log.debug("REST request to save Invoice : {}", invoice);
        Invoice result = invoiceService.save(invoice);
        return ResponseEntity
            .created(new URI("/api/invoices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /invoices/:id} : Updates an existing invoice.
     *
     * @param id the id of the invoice to save.
     * @param invoice the invoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invoice,
     * or with status {@code 400 (Bad Request)} if the invoice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the invoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/invoices/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable(value = "id", required = false) final Long id, @RequestBody Invoice invoice)
        throws URISyntaxException {
        log.debug("REST request to update Invoice : {}, {}", id, invoice);
        if (invoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, invoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!invoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Invoice result = invoiceRepository.save(invoice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invoice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /invoices/:id} : Partial updates given fields of an existing invoice, field will ignore if it is null
     *
     * @param id the id of the invoice to save.
     * @param invoice the invoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invoice,
     * or with status {@code 400 (Bad Request)} if the invoice is not valid,
     * or with status {@code 404 (Not Found)} if the invoice is not found,
     * or with status {@code 500 (Internal Server Error)} if the invoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/invoices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Invoice> partialUpdateInvoice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Invoice invoice
    ) throws URISyntaxException {
        log.debug("REST request to partial update Invoice partially : {}, {}", id, invoice);
        if (invoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, invoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!invoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Invoice> result = invoiceRepository
            .findById(invoice.getId())
            .map(existingInvoice -> {
                if (invoice.getHotelAddress() != null) {
                    existingInvoice.setHotelAddress(invoice.getHotelAddress());
                }
                if (invoice.getCustomerAddress() != null) {
                    existingInvoice.setCustomerAddress(invoice.getCustomerAddress());
                }
                if (invoice.getDiscount() != null) {
                    existingInvoice.setDiscount(invoice.getDiscount());
                }
                if (invoice.getPrice() != null) {
                    existingInvoice.setPrice(invoice.getPrice());
                }
                if (invoice.getDuration() != null) {
                    existingInvoice.setDuration(invoice.getDuration());
                }
                if (invoice.getBillingDate() != null) {
                    existingInvoice.setBillingDate(invoice.getBillingDate());
                }
                if (invoice.getCancled() != null) {
                    existingInvoice.setCancled(invoice.getCancled());
                }
                if (invoice.getBooking() != null) {
                    existingInvoice.setBooking(invoice.getBooking());
                }

                return existingInvoice;
            })
            .map(invoiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invoice.getId().toString())
        );
    }

    /**
     * {@code GET  /invoices} : get all the invoices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of invoices in body.
     */
    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        log.debug("REST request to get all Invoices");
        return invoiceRepository.findAll();
    }

    /**
     * {@code GET  /invoices/:id} : get the "id" invoice.
     *
     * @param id the id of the invoice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the invoice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/invoices/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        log.debug("REST request to get Invoice : {}", id);
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(invoice);
    }

    /**
     * {@code DELETE  /invoices/:id} : delete the "id" invoice.
     *
     * @param id the id of the invoice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/invoices/{id}")
    public ResponseEntity<Invoice> deleteInvoice(@PathVariable Long id) {
        log.debug("REST request to delete Invoice : {}", id);
        //invoiceRepository.deleteById(id);
        Invoice invoice = invoiceService.cancelInvoice(id);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .body(invoice);
    }
}
