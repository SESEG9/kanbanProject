package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.HumanResource;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HumanResource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HumanResourceRepository extends JpaRepository<HumanResource, Long> {}
