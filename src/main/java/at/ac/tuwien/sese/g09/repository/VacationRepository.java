package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.User;
import at.ac.tuwien.sese.g09.domain.Vacation;
import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import java.time.LocalDate;
import java.util.List;
import net.bytebuddy.asm.Advice;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vacation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VacationRepository extends JpaRepository<Vacation, Long> {
    @Query("select v from Vacation v where v.start <= :end and v.end >= :start")
    List<Vacation> findAllVacationsOverlapping(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("select v from Vacation v where v.start <= :end and v.end >= :start and v.user = :user")
    List<Vacation> findAllVacationsOverlappingWithUser(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end,
        @Param("user") User user
    );

    @Query("select v from Vacation v where v.start <= :end and v.end >= :start and v.state = :state")
    List<Vacation> findAllVacationsOverlappingWithState(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end,
        @Param("state") VacationState state
    );

    @Query("select v from Vacation v where v.start <= :end and v.end >= :start and v.state = :state and v.user = :user")
    List<Vacation> findAllVacationsOverlappingWithStateAndUser(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end,
        @Param("state") VacationState state,
        @Param("user") User user
    );
}
