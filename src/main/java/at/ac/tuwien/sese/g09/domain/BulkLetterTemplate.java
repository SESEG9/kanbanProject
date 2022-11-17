package at.ac.tuwien.sese.g09.domain;

import at.ac.tuwien.sese.g09.domain.enumeration.BulkLetterType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A BulkLetterTemplate.
 */
@Entity
@Table(name = "bulk_letter_template")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BulkLetterTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BulkLetterType type;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "subject")
    private String subject;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content")
    private String content;

    @OneToMany(mappedBy = "bulkLetterTemplate")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bulkLetterTemplate" }, allowSetters = true)
    private Set<EmailAttachment> images = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BulkLetterTemplate id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BulkLetterType getType() {
        return this.type;
    }

    public BulkLetterTemplate type(BulkLetterType type) {
        this.setType(type);
        return this;
    }

    public void setType(BulkLetterType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public BulkLetterTemplate date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getSubject() {
        return this.subject;
    }

    public BulkLetterTemplate subject(String subject) {
        this.setSubject(subject);
        return this;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return this.content;
    }

    public BulkLetterTemplate content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Set<EmailAttachment> getImages() {
        return this.images;
    }

    public void setImages(Set<EmailAttachment> emailAttachments) {
        if (this.images != null) {
            this.images.forEach(i -> i.setBulkLetterTemplate(null));
        }
        if (emailAttachments != null) {
            emailAttachments.forEach(i -> i.setBulkLetterTemplate(this));
        }
        this.images = emailAttachments;
    }

    public BulkLetterTemplate images(Set<EmailAttachment> emailAttachments) {
        this.setImages(emailAttachments);
        return this;
    }

    public BulkLetterTemplate addImages(EmailAttachment emailAttachment) {
        this.images.add(emailAttachment);
        emailAttachment.setBulkLetterTemplate(this);
        return this;
    }

    public BulkLetterTemplate removeImages(EmailAttachment emailAttachment) {
        this.images.remove(emailAttachment);
        emailAttachment.setBulkLetterTemplate(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BulkLetterTemplate)) {
            return false;
        }
        return id != null && id.equals(((BulkLetterTemplate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BulkLetterTemplate{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", date='" + getDate() + "'" +
            ", subject='" + getSubject() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
