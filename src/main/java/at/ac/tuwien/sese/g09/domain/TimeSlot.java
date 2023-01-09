package at.ac.tuwien.sese.g09.domain;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "time_slots")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TimeSlot {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "timeSlot")
    private Set<TimeManagement> timeManagements = new HashSet<>();

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TimeSlot)) return false;
        TimeSlot timeSlot = (TimeSlot) o;
        return (
            Objects.equals(getName(), timeSlot.getName()) &&
            Objects.equals(getStartTime(), timeSlot.getStartTime()) &&
            Objects.equals(getEndTime(), timeSlot.getEndTime())
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getStartTime(), getEndTime());
    }

    @Override
    public String toString() {
        return "TimeSlot{" + "name='" + name + '\'' + ", startTime=" + startTime + ", endTime=" + endTime + '}';
    }
}
