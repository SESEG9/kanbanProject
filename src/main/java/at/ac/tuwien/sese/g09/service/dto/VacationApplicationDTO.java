package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

public class VacationApplicationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private LocalDate start;

    private LocalDate end;

    public VacationApplicationDTO() {}

    public VacationApplicationDTO(LocalDate start, LocalDate end) {
        this.start = start;
        this.end = end;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return "VacationApplicationDTO{" + "start=" + start + ", end=" + end + '}';
    }
}
