package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Deficit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Deficit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeficitRepository extends JpaRepository<Deficit, Long> {}
