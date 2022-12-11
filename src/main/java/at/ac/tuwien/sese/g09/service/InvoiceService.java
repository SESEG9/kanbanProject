package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Booking;
import at.ac.tuwien.sese.g09.domain.Invoice;
import at.ac.tuwien.sese.g09.repository.BookingRepository;
import at.ac.tuwien.sese.g09.repository.InvoiceRepository;
import at.ac.tuwien.sese.g09.service.dto.InvoiceDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.util.Optional;
import javax.persistence.criteria.CriteriaBuilder;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class InvoiceService {

    private static final String ENTITY_NAME = "invoice";

    private final BookingRepository bookingRepository;
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(BookingRepository bookingRepository, InvoiceRepository invoiceRepository) {
        this.bookingRepository = bookingRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice save(InvoiceDTO newInvoice) {
        // check if bookingId exists
        Optional<Booking> b = bookingRepository.findOneWithEagerRelationships(newInvoice.getBookingId());

        if (b.isEmpty()) {
            throw new BadRequestAlertException(
                "Booking with ID " + newInvoice.getBookingId() + " does not exist!",
                ENTITY_NAME,
                "bookingNotFound"
            );
        }
        // create Invoice and save
        Invoice invoice = new Invoice();
        invoice.setBooking(b.get());
        invoice.setCancled(newInvoice.getCancled());
        invoice.setDiscount(newInvoice.getDiscount());
        invoice.setDuration(newInvoice.getDuration());
        invoice.setBillingDate(newInvoice.getBillingDate());
        invoice.setPrice(newInvoice.getPrice());
        invoice.setCustomerAddress(newInvoice.getCustomerAddress());
        invoice.setHotelAddress(newInvoice.getHotelAddress());

        invoiceRepository.save(invoice);
        return invoice;
    }
}
