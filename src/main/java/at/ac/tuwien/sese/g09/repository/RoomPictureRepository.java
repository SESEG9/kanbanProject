package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.RoomPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RoomPicture entity.
 *
 * When extending this class, extend BookingRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface RoomPictureRepository extends BookingRepositoryWithBagRelationships, JpaRepository<RoomPicture, Long> {}
