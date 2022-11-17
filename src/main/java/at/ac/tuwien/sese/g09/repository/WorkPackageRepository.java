package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.WorkPackage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WorkPackage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkPackageRepository extends JpaRepository<WorkPackage, Long> {}
