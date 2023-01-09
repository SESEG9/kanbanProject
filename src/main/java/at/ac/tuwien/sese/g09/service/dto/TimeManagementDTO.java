package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

public class TimeManagementDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private LocalDate workday;
    private String timeSlot;

    public TimeManagementDTO() {}

    public TimeManagementDTO(Long userId, LocalDate workday, String timeSlot) {
        this.userId = userId;
        this.workday = workday;
        this.timeSlot = timeSlot;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getWorkday() {
        return workday;
    }

    public void setWorkday(LocalDate workday) {
        this.workday = workday;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    @Override
    public String toString() {
        return "TimeManagementDTO{" + "userId=" + userId + ", workday=" + workday + ", timeSlot='" + timeSlot + '\'' + '}';
    }
}
