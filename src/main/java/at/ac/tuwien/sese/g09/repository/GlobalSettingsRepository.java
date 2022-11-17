package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.GlobalSettings;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GlobalSettings entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GlobalSettingsRepository extends JpaRepository<GlobalSettings, Long> {}
