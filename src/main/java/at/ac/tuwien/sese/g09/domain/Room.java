package at.ac.tuwien.sese.g09.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Room.
 */
@Entity
@Table(name = "room")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Room implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "identifyer", unique = true)
    private String identifyer;

    @Min(value = 1)
    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @OneToMany(mappedBy = "room")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "capacity", "room" }, allowSetters = true)
    private Set<RoomPrice> prices = new HashSet<>();

    @OneToMany(mappedBy = "room")
    private Set<RoomPicture> roomPictures;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rooms" }, allowSetters = true)
    private Invoice invoice;

    @ManyToMany(mappedBy = "rooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customers", "rooms" }, allowSetters = true)
    private Set<Booking> bookings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Room id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentifyer() {
        return this.identifyer;
    }

    public Room identifyer(String identifyer) {
        this.setIdentifyer(identifyer);
        return this;
    }

    public void setIdentifyer(String identifyer) {
        this.identifyer = identifyer;
    }

    public Integer getMaxCapacity() {
        return this.maxCapacity;
    }

    public Room maxCapacity(Integer maxCapacity) {
        this.setMaxCapacity(maxCapacity);
        return this;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Set<RoomPrice> getPrices() {
        return this.prices;
    }

    public void setPrices(Set<RoomPrice> roomPrices) {
        if (this.prices != null) {
            this.prices.forEach(i -> i.setRoom(null));
        }
        if (roomPrices != null) {
            roomPrices.forEach(i -> i.setRoom(this));
        }
        this.prices = roomPrices;
    }

    public Room prices(Set<RoomPrice> roomPrices) {
        this.setPrices(roomPrices);
        return this;
    }

    public Room addPrices(RoomPrice roomPrice) {
        this.prices.add(roomPrice);
        roomPrice.setRoom(this);
        return this;
    }

    public Room removePrices(RoomPrice roomPrice) {
        this.prices.remove(roomPrice);
        roomPrice.setRoom(null);
        return this;
    }

    public Invoice getInvoice() {
        return this.invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Room invoice(Invoice invoice) {
        this.setInvoice(invoice);
        return this;
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

    public Room bookings(Set<Booking> bookings) {
        this.setBookings(bookings);
        return this;
    }

    public Room addBookings(Booking booking) {
        this.bookings.add(booking);
        booking.getRooms().add(this);
        return this;
    }

    public Room removeBookings(Booking booking) {
        this.bookings.remove(booking);
        booking.getRooms().remove(this);
        return this;
    }

    public Set<RoomPicture> getRoomPictures() {
        return roomPictures;
    }

    public Room setRoomPictures(Set<RoomPicture> roomPictures) {
        this.roomPictures = roomPictures;
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Room)) {
            return false;
        }
        return id != null && id.equals(((Room) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Room{" +
            "id=" + getId() +
            ", identifyer='" + getIdentifyer() + "'" +
            ", maxCapacity=" + getMaxCapacity() +
            "}";
    }
}
