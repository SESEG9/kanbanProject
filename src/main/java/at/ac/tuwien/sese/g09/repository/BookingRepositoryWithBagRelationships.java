package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Booking;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface BookingRepositoryWithBagRelationships {
    Optional<Booking> fetchBagRelationships(Optional<Booking> booking);

    List<Booking> fetchBagRelationships(List<Booking> bookings);

    Page<Booking> fetchBagRelationships(Page<Booking> bookings);
}
