package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;

public class RoomBookingDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long roomID;
    private Long capacityID;

    public RoomBookingDTO() {}

    public RoomBookingDTO(Long roomID, Long capacityID) {
        this.roomID = roomID;
        this.capacityID = capacityID;
    }

    public Long getRoomID() {
        return roomID;
    }

    public void setRoomID(Long roomID) {
        this.roomID = roomID;
    }

    public Long getCapacityID() {
        return capacityID;
    }

    public void setCapacityID(Long capacityID) {
        this.capacityID = capacityID;
    }
}
