package at.ac.tuwien.sese.g09.service.dto;

import at.ac.tuwien.sese.g09.domain.enumeration.Gender;
import java.io.Serializable;
import java.time.LocalDate;

public class CustomerDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public CustomerDTO() {}

    public CustomerDTO(String name, LocalDate birthday, Gender gender, String billingAddress, String email, String telephone) {
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
        this.billingAddress = billingAddress;
        this.email = email;
        this.telephone = telephone;
    }

    private String name;
    private LocalDate birthday;
    private Gender gender;
    private String billingAddress;
    private String email;
    private String telephone;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    @Override
    public String toString() {
        return (
            "CustomerDTO{" +
            "name='" +
            name +
            '\'' +
            ", birthday=" +
            birthday +
            ", gender=" +
            gender +
            ", billingAddress='" +
            billingAddress +
            '\'' +
            ", email='" +
            email +
            '\'' +
            ", telephone='" +
            telephone +
            '\'' +
            '}'
        );
    }
}
