package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

public class BookingDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String discountCode;
    private LocalDate startDate;
    private Integer duration;
    private CustomerDTO billingCustomer;
    private List<CustomerDTO> customers;
    private List<RoomBookingDTO> rooms;

    public BookingDTO() {
        // Empty constructor needed for Jackson.
    }

    public BookingDTO(
        String discountCode,
        LocalDate startDate,
        Integer duration,
        CustomerDTO billingCustomer,
        List<CustomerDTO> customers,
        List<RoomBookingDTO> rooms
    ) {
        this.discountCode = discountCode;
        this.startDate = startDate;
        this.duration = duration;
        this.billingCustomer = billingCustomer;
        this.customers = customers;
        this.rooms = rooms;
    }

    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public CustomerDTO getBillingCustomer() {
        return billingCustomer;
    }

    public void setBillingCustomer(CustomerDTO billingCustomer) {
        this.billingCustomer = billingCustomer;
    }

    public List<CustomerDTO> getCustomers() {
        return customers;
    }

    public void setCustomers(List<CustomerDTO> customers) {
        this.customers = customers;
    }

    public List<RoomBookingDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomBookingDTO> rooms) {
        this.rooms = rooms;
    }

    @Override
    public String toString() {
        return (
            "BookingDTO{" +
            "discountCode='" +
            discountCode +
            '\'' +
            ", startDate=" +
            startDate +
            ", duration=" +
            duration +
            ", billingCustomer=" +
            billingCustomer +
            ", customers=" +
            customers +
            ", rooms=" +
            rooms +
            '}'
        );
    }
}
