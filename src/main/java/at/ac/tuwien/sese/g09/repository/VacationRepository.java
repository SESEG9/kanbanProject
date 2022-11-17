package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Vacation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vacation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VacationRepository extends JpaRepository<Vacation, Long> {}
