package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Booking;
import at.ac.tuwien.sese.g09.domain.Invoice;
import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.repository.BookingRepository;
import at.ac.tuwien.sese.g09.repository.InvoiceRepository;
import at.ac.tuwien.sese.g09.service.dto.InvoiceDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import at.ac.tuwien.sese.g09.service.errors.PDFGenerationFailureException;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import javax.transaction.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.vandeseer.easytable.TableDrawer;
import org.vandeseer.easytable.settings.BorderStyle;
import org.vandeseer.easytable.settings.HorizontalAlignment;
import org.vandeseer.easytable.structure.Row;
import org.vandeseer.easytable.structure.Table;
import org.vandeseer.easytable.structure.cell.TextCell;

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

        Float discountFactor = (b.get().getDiscount() != null) ? (100f - b.get().getDiscount()) / 100f : 1f;
        invoice.setDiscount(discountFactor);
        invoice.setDuration(newInvoice.getDuration());
        invoice.setBillingDate(newInvoice.getBillingDate());
        invoice.setPrice(b.get().getPrice());
        invoice.setCustomerAddress(newInvoice.getCustomerAddress());
        invoice.setHotelAddress(newInvoice.getHotelAddress());

        invoiceRepository.save(invoice);
        return invoice;
    }

    public Optional<byte[]> generatePdf(Long id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);

        if (invoice.isEmpty()) {
            return Optional.empty();
        }

        try (ByteArrayOutputStream out = new ByteArrayOutputStream(); PDDocument document = new PDDocument()) {
            document.setDocumentInformation(createPDFInfo(invoice.get()));
            generateInvoicePage(document, invoice.get());

            document.save(out);
            return Optional.of(out.toByteArray());
        } catch (IOException ex) {
            throw new PDFGenerationFailureException(ex);
        }
    }

    private PDDocumentInformation createPDFInfo(Invoice invoice) {
        PDDocumentInformation information = new PDDocumentInformation();
        information.setCreator("Hotel: Zum goldenen Löwen");
        information.setTitle("Rechnung Nr. " + invoice.getId());
        information.setSubject(invoice.getBooking().getBillingCustomer().getName());
        information.setKeywords("Rechnung, Hotel, Zum goldenen Löwen");

        ZoneId zoneId = ZoneId.systemDefault();
        Calendar billingDay = Calendar.getInstance();
        Date billingDate = Date.from(invoice.getBillingDate().atStartOfDay(zoneId).toInstant());
        billingDay.setTime(billingDate);

        information.setCreationDate(billingDay);
        information.setModificationDate(billingDay);
        return information;
    }

    private void generateInvoicePage(PDDocument doc, Invoice invoice) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);

        try (PDPageContentStream contentStream = new PDPageContentStream(doc, page)) {
            // set title
            int titlesize = 24;
            PDFont titlefont = PDType1Font.HELVETICA_BOLD;
            contentStream.moveTo(0, 0);
            contentStream.beginText();
            String title = "Rechnung Nr. " + invoice.getId();
            if (Boolean.TRUE.equals(invoice.getCancled())) {
                title += " - storniert";
                // make storno red
                contentStream.setStrokingColor(Color.RED);
                contentStream.setNonStrokingColor(Color.RED);
            }
            float titleWidth = (titlefont.getStringWidth(title) / 1000f) * titlesize;
            contentStream.setFont(titlefont, titlesize);
            contentStream.newLineAtOffset((page.getMediaBox().getWidth() - titleWidth) / 2, page.getMediaBox().getUpperRightY() - 90);
            contentStream.showText(title);
            contentStream.endText();

            // draw table
            contentStream.moveTo(0, 0);
            Table invoiceTable = getInvoiceTable(invoice);
            TableDrawer tableDrawer = TableDrawer
                .builder()
                .contentStream(contentStream)
                .startX((page.getMediaBox().getWidth() - invoiceTable.getWidth()) / 2)
                .startY(page.getMediaBox().getUpperRightY() - 300)
                .table(invoiceTable)
                .build();
            tableDrawer.draw();

            // write hotel name
            contentStream.moveTo(0, 0);
            int textsize = 14;
            PDFont textfont = PDType1Font.HELVETICA;
            contentStream.beginText();
            contentStream.setFont(textfont, textsize);
            contentStream.newLineAtOffset(page.getMediaBox().getUpperRightX() - 150, page.getMediaBox().getUpperRightY() - 30);
            contentStream.showText("Zum goldenen Löwen");
            contentStream.endText();

            float linespace = -18;

            // hotel information
            contentStream.moveTo(0, 0);
            contentStream.beginText();
            contentStream.setFont(textfont, 12);
            contentStream.newLineAtOffset(page.getMediaBox().getLowerLeftX() + 40, page.getMediaBox().getUpperRightY() - 180);
            contentStream.showText("Hotel - Zum goldenen Löwen");
            contentStream.newLineAtOffset(0, linespace);
            contentStream.showText(invoice.getHotelAddress());
            contentStream.endText();

            // customer information
            contentStream.moveTo(0, 0);
            contentStream.beginText();
            contentStream.setFont(textfont, 12);
            contentStream.newLineAtOffset(page.getMediaBox().getUpperRightX() - 200, page.getMediaBox().getUpperRightY() - 180);
            contentStream.showText(invoice.getBooking().getBillingCustomer().getName());
            contentStream.newLineAtOffset(0, linespace);
            contentStream.showText(invoice.getBooking().getBillingCustomer().getEmail());
            contentStream.newLineAtOffset(0, linespace);
            contentStream.showText(invoice.getCustomerAddress());
            contentStream.endText();

            // date + booking
            contentStream.moveTo(0, 0);
            contentStream.beginText();
            contentStream.setFont(titlefont, textsize);
            contentStream.newLineAtOffset(page.getMediaBox().getLowerLeftX() + 40, page.getMediaBox().getUpperRightY() - 260);
            contentStream.showText("Rechnungsdatum: " + invoice.getBillingDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
            contentStream.newLineAtOffset(0, linespace);
            contentStream.showText("Buchungsnummer: " + invoice.getBooking().getBookingCode());
            contentStream.endText();

            doc.addPage(page);
        }
    }

    private Table getInvoiceTable(Invoice invoice) {
        // column titles
        Table.TableBuilder tableBuilder = Table
            .builder()
            .addColumnsOfWidth(25, 80, 80, 60, 60, 60, 75, 75)
            .padding(2)
            .addRow(
                Row
                    .builder()
                    .fontSize(11)
                    .font(PDType1Font.HELVETICA_BOLD)
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Nr.")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.LEFT)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Zimmer")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.LEFT)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Art")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Anreise")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Abreise")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Anzahl")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Einzelpreis")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .borderStyleBottom(BorderStyle.SOLID)
                            .borderWidthBottom(1f)
                            .text("Gesamtpreis")
                            .build()
                    )
                    .build()
            );

        // rows of booked rooms
        int count = 1;
        Booking booking = invoice.getBooking();
        for (RoomPrice roomPrice : invoice.getBooking().getRooms()) {
            tableBuilder.addRow(
                Row
                    .builder()
                    .padding(3)
                    .fontSize(9)
                    .font(PDType1Font.HELVETICA)
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(Integer.toString(count))
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.LEFT)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(roomPrice.getRoom().getIdentifyer())
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.LEFT)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(roomPrice.getCapacity().getName())
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(booking.getStartDate().format(DateTimeFormatter.ISO_LOCAL_DATE))
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(
                                booking.getStartDate().plusDays(invoice.getBooking().getDuration()).format(DateTimeFormatter.ISO_LOCAL_DATE)
                            )
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.CENTER)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(booking.getDuration() + " " + (invoice.getBooking().getDuration() > 1 ? "Nächte" : "Nacht"))
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(String.format("%.2f €", roomPrice.getPrice() / 100.))
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .borderStyleBottom(BorderStyle.DASHED)
                            .borderWidthBottom(.5f)
                            .text(String.format("%.2f €", (roomPrice.getPrice() / 100.) * booking.getDuration()))
                            .build()
                    )
                    .build()
            );
            count++;
        }

        float lastBorderWidth = 1f;
        if (invoice.getDiscount() != 1) {
            // row for total sum without discount
            tableBuilder.addRow(
                Row
                    .builder()
                    .padding(3)
                    .fontSize(9)
                    .font(PDType1Font.HELVETICA_BOLD)
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(1f).text("").build())
                    .add(
                        TextCell
                            .builder()
                            .borderStyleTop(BorderStyle.SOLID)
                            .borderWidthTop(1f)
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .text("Summe")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .borderStyleTop(BorderStyle.SOLID)
                            .borderWidthTop(1f)
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .text(String.format("%.0f €", (invoice.getPrice() / invoice.getDiscount()) / 100.))
                            .build()
                    )
                    .build()
            );

            // row for discount
            tableBuilder.addRow(
                Row
                    .builder()
                    .padding(3)
                    .fontSize(9)
                    .font(PDType1Font.HELVETICA)
                    .add(TextCell.builder().text("").build())
                    .add(TextCell.builder().text("").build())
                    .add(TextCell.builder().text("").build())
                    .add(TextCell.builder().text("").build())
                    .add(TextCell.builder().text("").build())
                    .add(TextCell.builder().text("").build())
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .text(invoice.getDiscount() > 1 ? "Aufschlag" : "Rabatt")
                            .build()
                    )
                    .add(
                        TextCell
                            .builder()
                            .horizontalAlignment(HorizontalAlignment.RIGHT)
                            .text(String.format("%+.0f %%", (invoice.getDiscount() - 1) * 100))
                            .build()
                    )
                    .build()
            );
            lastBorderWidth = 0f;
        }

        // row for total sum
        tableBuilder.addRow(
            Row
                .builder()
                .padding(3)
                .fontSize(9)
                .font(PDType1Font.HELVETICA_BOLD)
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(TextCell.builder().borderStyleTop(BorderStyle.SOLID).borderWidthTop(lastBorderWidth).text("").build())
                .add(
                    TextCell
                        .builder()
                        .borderStyleTop(BorderStyle.SOLID)
                        .borderWidthTop(1f)
                        .horizontalAlignment(HorizontalAlignment.RIGHT)
                        .text("Gesamtsumme")
                        .build()
                )
                .add(
                    TextCell
                        .builder()
                        .borderStyleTop(BorderStyle.SOLID)
                        .borderWidthTop(1f)
                        .horizontalAlignment(HorizontalAlignment.RIGHT)
                        .text(String.format("%.2f €", invoice.getPrice() / 100.))
                        .build()
                )
                .build()
        );

        return tableBuilder.build();
    }

    public Invoice cancelInvoice(Long id) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);
        if (optionalInvoice.isPresent()) {
            Invoice invoice = optionalInvoice.get();
            invoice.setCancled(true);

            return invoiceRepository.save(invoice);
        } else {
            throw new BadRequestAlertException("Invoice with id " + id + " not found", ENTITY_NAME, "invoiceNotFound");
        }
    }
}
