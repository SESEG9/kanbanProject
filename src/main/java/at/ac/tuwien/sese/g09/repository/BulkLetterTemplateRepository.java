package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.BulkLetterTemplate;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BulkLetterTemplate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BulkLetterTemplateRepository extends JpaRepository<BulkLetterTemplate, Long> {}
