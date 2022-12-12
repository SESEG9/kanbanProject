package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.service.MailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
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
    public void createMail(@RequestParam String subject, @RequestParam String text, @RequestParam String contactMail) {
        mailService.sendEmailToSelf(contactMail, subject, text, false, false);
    }
}
