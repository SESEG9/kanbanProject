package at.ac.tuwien.sese.g09.service.dto;

import at.ac.tuwien.sese.g09.domain.enumeration.VacationState;
import java.io.Serializable;
import java.time.LocalDate;

public class VacationUpdateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private VacationState state;

    public VacationUpdateDTO() {}

    public VacationUpdateDTO(VacationState state) {
        this.state = state;
    }

    public VacationState getState() {
        return state;
    }

    public void setState(VacationState state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "VacationUpdateDTO{" + "state=" + state + '}';
    }
}
