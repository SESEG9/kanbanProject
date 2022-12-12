package at.ac.tuwien.sese.g09.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

public class InvoiceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String hotelAddress;
    private String customerAddress;
    private Float discount;
    private Integer price;
    private Integer duration;
    private LocalDate billingDate;
    private Boolean cancled;
    private Long bookingId;

    public InvoiceDTO(
        String hotelAddress,
        String customerAddress,
        Float discount,
        Integer price,
        Integer duration,
        LocalDate billingDate,
        Boolean cancled,
        Long bookingId
    ) {
        this.hotelAddress = hotelAddress;
        this.customerAddress = customerAddress;
        this.discount = discount;
        this.price = price;
        this.duration = duration;
        this.billingDate = billingDate;
        this.cancled = cancled;
        this.bookingId = bookingId;
    }

    public InvoiceDTO() {}

    public String getHotelAddress() {
        return hotelAddress;
    }

    public void setHotelAddress(String hotelAddress) {
        this.hotelAddress = hotelAddress;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDate getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(LocalDate billingDate) {
        this.billingDate = billingDate;
    }

    public Boolean getCancled() {
        return cancled;
    }

    public void setCancled(Boolean cancled) {
        this.cancled = cancled;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
}
