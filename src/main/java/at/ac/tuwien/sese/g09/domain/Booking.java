package at.ac.tuwien.sese.g09.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Booking.
 */
@Entity
@Table(name = "booking")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Booking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "booking_code")
    private String bookingCode;

    @Column(name = "discount")
    private Float discount;

    @Column(name = "price")
    private Integer price;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "cancled")
    private Boolean cancled;

    @ManyToMany
    @JoinTable(
        name = "rel_booking__customers",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "customers_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bookings" }, allowSetters = true)
    private Set<Customer> customers = new HashSet<>();

    @ManyToOne
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Customer billingCustomer;

    @ManyToMany
    @JoinTable(
        name = "rel_booking__rooms",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "room_price_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "prices", "invoice", "bookings" }, allowSetters = true)
    private Set<RoomPrice> rooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Booking id(Long id) {
        this.setId(id);
        return this;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public Customer getBillingCustomer() {
        return billingCustomer;
    }

    public void setBillingCustomer(Customer billingCustomer) {
        this.billingCustomer = billingCustomer;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getDiscount() {
        return this.discount;
    }

    public Booking discount(Float discount) {
        this.setDiscount(discount);
        return this;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Booking price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Booking startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Booking duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Boolean getCancled() {
        return this.cancled;
    }

    public Booking cancled(Boolean cancled) {
        this.setCancled(cancled);
        return this;
    }

    public void setCancled(Boolean cancled) {
        this.cancled = cancled;
    }

    public Set<Customer> getCustomers() {
        return this.customers;
    }

    public void setCustomers(Set<Customer> customers) {
        this.customers = customers;
    }

    public Booking customers(Set<Customer> customers) {
        this.setCustomers(customers);
        return this;
    }

    public Booking addCustomers(Customer customer) {
        this.customers.add(customer);
        customer.getBookings().add(this);
        return this;
    }

    public Booking removeCustomers(Customer customer) {
        this.customers.remove(customer);
        customer.getBookings().remove(this);
        return this;
    }

    public Set<RoomPrice> getRooms() {
        return this.rooms;
    }

    public void setRooms(Set<RoomPrice> rooms) {
        this.rooms = rooms;
    }

    public Booking rooms(Set<RoomPrice> rooms) {
        this.setRooms(rooms);
        return this;
    }

    public Booking addRooms(RoomPrice room) {
        this.rooms.add(room);
        room.getBookings().add(this);
        return this;
    }

    public Booking removeRooms(RoomPrice room) {
        this.rooms.remove(room);
        room.getBookings().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Booking)) {
            return false;
        }
        return id != null && id.equals(((Booking) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Booking{" +
            "id=" + getId() +
            ", discount=" + getDiscount() +
            ", price=" + getPrice() +
            ", startDate='" + getStartDate() + "'" +
            ", duration=" + getDuration() +
            ", cancled='" + getCancled() + "'" +
            "}";
    }
}
