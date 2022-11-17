package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.EmailAttachment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EmailAttachment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmailAttachmentRepository extends JpaRepository<EmailAttachment, Long> {}
