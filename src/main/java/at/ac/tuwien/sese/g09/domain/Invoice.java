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
 * An Invoice.
 */
@Entity
@Table(name = "invoice")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Invoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "hotel_address")
    private String hotelAddress;

    @Column(name = "customer_address")
    private String customerAddress;

    @Column(name = "discount")
    private Float discount;

    @Column(name = "price")
    private Integer price;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "billing_date")
    private LocalDate billingDate;

    @Column(name = "cancled")
    private Boolean cancled;

    @ManyToOne
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Booking booking;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Invoice id(Long id) {
        this.setId(id);
        return this;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHotelAddress() {
        return this.hotelAddress;
    }

    public Invoice hotelAddress(String hotelAddress) {
        this.setHotelAddress(hotelAddress);
        return this;
    }

    public void setHotelAddress(String hotelAddress) {
        this.hotelAddress = hotelAddress;
    }

    public String getCustomerAddress() {
        return this.customerAddress;
    }

    public Invoice customerAddress(String customerAddress) {
        this.setCustomerAddress(customerAddress);
        return this;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Float getDiscount() {
        return this.discount;
    }

    public Invoice discount(Float discount) {
        this.setDiscount(discount);
        return this;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Invoice price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Invoice duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDate getBillingDate() {
        return this.billingDate;
    }

    public Invoice billingDate(LocalDate billingDate) {
        this.setBillingDate(billingDate);
        return this;
    }

    public void setBillingDate(LocalDate billingDate) {
        this.billingDate = billingDate;
    }

    public Boolean getCancled() {
        return this.cancled;
    }

    public Invoice cancled(Boolean cancled) {
        this.setCancled(cancled);
        return this;
    }

    public void setCancled(Boolean cancled) {
        this.cancled = cancled;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invoice)) {
            return false;
        }
        return id != null && id.equals(((Invoice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Invoice{" +
            "id=" + getId() +
            ", hotelAddress='" + getHotelAddress() + "'" +
            ", customerAddress='" + getCustomerAddress() + "'" +
            ", discount=" + getDiscount() +
            ", price=" + getPrice() +
            ", duration=" + getDuration() +
            ", billingDate='" + getBillingDate() + "'" +
            ", cancled='" + getCancled() + "'" +
            "}";
    }
}
