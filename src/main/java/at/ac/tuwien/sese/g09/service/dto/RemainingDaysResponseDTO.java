package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;

public class RemainingDaysResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private int remainingDays;

    public RemainingDaysResponseDTO() {}

    public int getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(int remainingDays) {
        this.remainingDays = remainingDays;
    }

    @Override
    public String toString() {
        return "RemainingDaysResponseDTO{" + "remainingDays=" + remainingDays + '}';
    }
}
