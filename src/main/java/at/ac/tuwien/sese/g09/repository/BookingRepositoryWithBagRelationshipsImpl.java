package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Booking;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class BookingRepositoryWithBagRelationshipsImpl implements BookingRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Booking> fetchBagRelationships(Optional<Booking> booking) {
        return booking.map(this::fetchCustomers).map(this::fetchRooms);
    }

    @Override
    public Page<Booking> fetchBagRelationships(Page<Booking> bookings) {
        return new PageImpl<>(fetchBagRelationships(bookings.getContent()), bookings.getPageable(), bookings.getTotalElements());
    }

    @Override
    public List<Booking> fetchBagRelationships(List<Booking> bookings) {
        return Optional.of(bookings).map(this::fetchCustomers).map(this::fetchRooms).orElse(Collections.emptyList());
    }

    Booking fetchCustomers(Booking result) {
        return entityManager
            .createQuery("select booking from Booking booking left join fetch booking.customers where booking is :booking", Booking.class)
            .setParameter("booking", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Booking> fetchCustomers(List<Booking> bookings) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, bookings.size()).forEach(index -> order.put(bookings.get(index).getId(), index));
        List<Booking> result = entityManager
            .createQuery(
                "select distinct booking from Booking booking left join fetch booking.customers where booking in :bookings",
                Booking.class
            )
            .setParameter("bookings", bookings)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Booking fetchRooms(Booking result) {
        return entityManager
            .createQuery("select booking from Booking booking left join fetch booking.rooms where booking is :booking", Booking.class)
            .setParameter("booking", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Booking> fetchRooms(List<Booking> bookings) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, bookings.size()).forEach(index -> order.put(bookings.get(index).getId(), index));
        List<Booking> result = entityManager
            .createQuery(
                "select distinct booking from Booking booking left join fetch booking.rooms where booking in :bookings",
                Booking.class
            )
            .setParameter("bookings", bookings)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
