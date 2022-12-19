package at.ac.tuwien.sese.g09.domain;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "discount")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Discount {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "discount_code", unique = true)
    private String discountCode;

    @Column(name = "discount_percentage")
    private Float discountPercentage;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
    }

    public Float getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Float discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Discount discount = (Discount) o;
        return (
            Objects.equals(id, discount.id) &&
            Objects.equals(discountCode, discount.discountCode) &&
            Objects.equals(discountPercentage, discount.discountPercentage)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, discountCode, discountPercentage);
    }

    @Override
    public String toString() {
        return (
            "Discount{" + "id=" + id + ", discountCode='" + discountCode + '\'' + ", discountPercentage='" + discountPercentage + '\'' + '}'
        );
    }
}
