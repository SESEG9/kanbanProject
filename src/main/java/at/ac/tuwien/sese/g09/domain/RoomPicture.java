package at.ac.tuwien.sese.g09.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "room_picture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RoomPicture {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "image")
    private String image;

    @Column(name = "weight")
    private Long weight;

    @Column(name = "description")
    private String description;

    @ManyToOne
    private Room room;

    public Long getId() {
        return id;
    }

    public RoomPicture setId(Long id) {
        this.id = id;
        return this;
    }

    public String getImage() {
        return image;
    }

    public RoomPicture setImage(String image) {
        this.image = image;
        return this;
    }

    public Long getWeight() {
        return weight;
    }

    public RoomPicture setWeight(Long weight) {
        this.weight = weight;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public RoomPicture setDescription(String description) {
        this.description = description;
        return this;
    }

    public Room getRoom() {
        return room;
    }

    public RoomPicture setRoom(Room room) {
        this.room = room;
        return this;
    }
}
