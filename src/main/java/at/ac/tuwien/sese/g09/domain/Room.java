package at.ac.tuwien.sese.g09.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Min;
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
    private Set<RoomPrice> prices = new HashSet<>();

    @OneToMany(mappedBy = "room")
    @JsonIgnoreProperties(value = { "room" }, allowSetters = true)
    private Set<RoomPicture> roomPictures = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "rooms" }, allowSetters = true)
    private Invoice invoice;

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

    public Set<RoomPicture> getRoomPictures() {
        return roomPictures;
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
