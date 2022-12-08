package at.ac.tuwien.sese.g09.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RoomPrice.
 */
@Entity
@Table(name = "room_price")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RoomPrice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "price")
    private Integer price;

    @ManyToOne
    private RoomCapacity capacity;

    @ManyToOne
    @JsonIgnoreProperties(value = { "prices", "invoice", "bookings" }, allowSetters = true)
    private Room room;

    @ManyToMany(mappedBy = "rooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customers", "rooms" }, allowSetters = true)
    private Set<Booking> bookings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RoomPrice id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPrice() {
        return this.price;
    }

    public RoomPrice price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public RoomCapacity getCapacity() {
        return this.capacity;
    }

    public void setCapacity(RoomCapacity roomCapacity) {
        this.capacity = roomCapacity;
    }

    public RoomPrice capacity(RoomCapacity roomCapacity) {
        this.setCapacity(roomCapacity);
        return this;
    }

    public Room getRoom() {
        return this.room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public RoomPrice room(Room room) {
        this.setRoom(room);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RoomPrice)) {
            return false;
        }
        return id != null && id.equals(((RoomPrice) o).id);
    }

    public Set<Booking> getBookings() {
        return this.bookings;
    }

    public void setBookings(Set<Booking> bookings) {
        if (this.bookings != null) {
            this.bookings.forEach(i -> i.removeRooms(this));
        }
        if (bookings != null) {
            bookings.forEach(i -> i.addRooms(this));
        }
        this.bookings = bookings;
    }

    public RoomPrice bookings(Set<Booking> bookings) {
        this.setBookings(bookings);
        return this;
    }

    public RoomPrice addBookings(Booking booking) {
        this.bookings.add(booking);
        booking.getRooms().add(this);
        return this;
    }

    public RoomPrice removeBookings(Booking booking) {
        this.bookings.remove(booking);
        booking.getRooms().remove(this);
        return this;
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RoomPrice{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            "}";
    }
}
