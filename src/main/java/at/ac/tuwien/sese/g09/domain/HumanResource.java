package at.ac.tuwien.sese.g09.domain;

import at.ac.tuwien.sese.g09.domain.enumeration.Gender;
import at.ac.tuwien.sese.g09.domain.enumeration.HumanResourceType;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HumanResource.
 */
@Entity
@Table(name = "human_resource")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HumanResource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private HumanResourceType type;

    @NotNull
    @Column(name = "abbr", nullable = false, unique = true)
    private String abbr;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "ssn")
    private String ssn;

    @Column(name = "bannking")
    private String bannking;

    @Column(name = "relationship_type")
    private String relationshipType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HumanResource id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HumanResourceType getType() {
        return this.type;
    }

    public HumanResource type(HumanResourceType type) {
        this.setType(type);
        return this;
    }

    public void setType(HumanResourceType type) {
        this.type = type;
    }

    public String getAbbr() {
        return this.abbr;
    }

    public HumanResource abbr(String abbr) {
        this.setAbbr(abbr);
        return this;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }

    public String getName() {
        return this.name;
    }

    public HumanResource name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return this.birthday;
    }

    public HumanResource birthday(LocalDate birthday) {
        this.setBirthday(birthday);
        return this;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public Gender getGender() {
        return this.gender;
    }

    public HumanResource gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return this.phone;
    }

    public HumanResource phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return this.email;
    }

    public HumanResource email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSsn() {
        return this.ssn;
    }

    public HumanResource ssn(String ssn) {
        this.setSsn(ssn);
        return this;
    }

    public void setSsn(String ssn) {
        this.ssn = ssn;
    }

    public String getBannking() {
        return this.bannking;
    }

    public HumanResource bannking(String bannking) {
        this.setBannking(bannking);
        return this;
    }

    public void setBannking(String bannking) {
        this.bannking = bannking;
    }

    public String getRelationshipType() {
        return this.relationshipType;
    }

    public HumanResource relationshipType(String relationshipType) {
        this.setRelationshipType(relationshipType);
        return this;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HumanResource)) {
            return false;
        }
        return id != null && id.equals(((HumanResource) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HumanResource{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", abbr='" + getAbbr() + "'" +
            ", name='" + getName() + "'" +
            ", birthday='" + getBirthday() + "'" +
            ", gender='" + getGender() + "'" +
            ", phone='" + getPhone() + "'" +
            ", email='" + getEmail() + "'" +
            ", ssn='" + getSsn() + "'" +
            ", bannking='" + getBannking() + "'" +
            ", relationshipType='" + getRelationshipType() + "'" +
            "}";
    }
}
