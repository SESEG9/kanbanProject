package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Booking;
import at.ac.tuwien.sese.g09.repository.BookingRepository;
import at.ac.tuwien.sese.g09.service.BookingService;
import at.ac.tuwien.sese.g09.service.MailService;
import at.ac.tuwien.sese.g09.service.dto.BookingDTO;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public class MailResource {

    private final Logger log = LoggerFactory.getLogger(BookingResource.class);

    private static final String ENTITY_NAME = "mail";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MailService mailService;

    public MailResource(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/public/mail")
    public void createMail(@RequestParam String subject, @RequestParam String text, String contactMail) {
        mailService.sendEmailToSelf(contactMail, subject, text, false, false);
    }
}
