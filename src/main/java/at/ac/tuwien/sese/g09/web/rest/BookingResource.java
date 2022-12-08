package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Booking;
import at.ac.tuwien.sese.g09.repository.BookingRepository;
import at.ac.tuwien.sese.g09.service.BookingService;
import at.ac.tuwien.sese.g09.service.dto.BookingDTO;
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
 * REST controller for managing {@link at.ac.tuwien.sese.g09.domain.Booking}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookingResource {

    private final Logger log = LoggerFactory.getLogger(BookingResource.class);

    private static final String ENTITY_NAME = "booking";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public BookingResource(BookingRepository bookingRepository, BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    /**
     * {@code POST  /bookings} : Create a new booking.
     *
     * @param booking the booking to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new booking, or with status {@code 400 (Bad Request)} if the booking has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingDTO booking) throws URISyntaxException {
        log.debug("REST request to save Booking : {}", booking);
        if (booking == null) {
            throw new BadRequestAlertException("Booking can not be null", ENTITY_NAME, "cannotbenull");
        }
        Booking result = bookingService.createBooking(booking);
        return ResponseEntity
            .created(new URI("/api/bookings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bookings/:id} : Updates an existing booking.
     *
     * @param id the id of the booking to save.
     * @param booking the booking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated booking,
     * or with status {@code 400 (Bad Request)} if the booking is not valid,
     * or with status {@code 500 (Internal Server Error)} if the booking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bookings/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable(value = "id", required = false) final Long id, @RequestBody Booking booking)
        throws URISyntaxException {
        throw new BadRequestAlertException("PUT Not implemented", ENTITY_NAME, "notimplemented");
    }

    /**
     * {@code PATCH  /bookings/:id} : Partial updates given fields of an existing booking, field will ignore if it is null
     *
     * @param id the id of the booking to save.
     * @param booking the booking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated booking,
     * or with status {@code 400 (Bad Request)} if the booking is not valid,
     * or with status {@code 404 (Not Found)} if the booking is not found,
     * or with status {@code 500 (Internal Server Error)} if the booking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bookings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Booking> partialUpdateBooking(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Booking booking
    ) throws URISyntaxException {
        log.debug("REST request to partial update Booking partially : {}, {}", id, booking);
        if (booking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, booking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Booking> result = bookingRepository
            .findById(booking.getId())
            .map(existingBooking -> {
                if (booking.getDiscount() != null) {
                    existingBooking.setDiscount(booking.getDiscount());
                }
                if (booking.getPrice() != null) {
                    existingBooking.setPrice(booking.getPrice());
                }
                if (booking.getStartDate() != null) {
                    existingBooking.setStartDate(booking.getStartDate());
                }
                if (booking.getDuration() != null) {
                    existingBooking.setDuration(booking.getDuration());
                }
                if (booking.getCancled() != null) {
                    existingBooking.setCancled(booking.getCancled());
                }

                return existingBooking;
            })
            .map(bookingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, booking.getId().toString())
        );
    }

    /**
     * {@code GET  /bookings} : get all the bookings.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookings in body.
     */
    @GetMapping("/bookings")
    public List<Booking> getAllBookings(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Bookings");
        if (eagerload) {
            return bookingRepository.findAllWithEagerRelationships();
        } else {
            return bookingRepository.findAll();
        }
    }

    /**
     * {@code GET  /bookings/:id} : get the "id" booking.
     *
     * @param id the id of the booking to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the booking, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        log.debug("REST request to get Booking : {}", id);
        Optional<Booking> booking = bookingRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(booking);
    }

    /**
     * {@code DELETE  /bookings/:id} : delete the "id" booking.
     *
     * @param id the id of the booking to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Booking> deleteBooking(@PathVariable Long id, @RequestParam String email, @RequestParam String bookingCode) {
        Booking booking = bookingService.cancelBooking(id, email, bookingCode);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .body(booking);
    }
}
