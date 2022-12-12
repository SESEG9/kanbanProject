package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Booking;
import at.ac.tuwien.sese.g09.domain.Customer;
import at.ac.tuwien.sese.g09.domain.Room;
import at.ac.tuwien.sese.g09.domain.RoomPrice;
import at.ac.tuwien.sese.g09.repository.BookingRepository;
import at.ac.tuwien.sese.g09.repository.CustomerRepository;
import at.ac.tuwien.sese.g09.repository.RoomPriceRepository;
import at.ac.tuwien.sese.g09.repository.RoomRepository;
import at.ac.tuwien.sese.g09.service.dto.BookingDTO;
import at.ac.tuwien.sese.g09.service.dto.CustomerDTO;
import at.ac.tuwien.sese.g09.service.dto.RoomBookingDTO;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BookingService {

    private static final String ENTITY_NAME = "booking";

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final RoomPriceRepository roomPriceRepository;
    private final CustomerRepository customerRepository;
    private final MailService mailService;

    public BookingService(
        BookingRepository bookingRepository,
        RoomRepository roomRepository,
        CustomerRepository customerRepository,
        RoomPriceRepository roomPriceRepository,
        MailService mailService
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.roomPriceRepository = roomPriceRepository;
        this.mailService = mailService;
    }

    public Booking createBooking(BookingDTO bookingDTO) {
        validateBooking(bookingDTO);

        List<Room> rooms = new ArrayList<>();
        Set<RoomPrice> roomPrices = new HashSet<>();
        Set<Customer> customers = new HashSet<>();

        // fetch rooms and prices
        for (RoomBookingDTO roomBooking : bookingDTO.getRooms()) {
            Optional<Room> foundRoom = roomRepository.findById(roomBooking.getRoomID());
            if (foundRoom.isPresent()) {
                rooms.add(foundRoom.get());
            } else {
                throw new BadRequestAlertException(
                    "Room with ID " + roomBooking.getRoomID() + " does not exist!",
                    ENTITY_NAME,
                    "roomNotFound"
                );
            }

            RoomPrice rp = roomPriceRepository.findByCapacity_IdAndRoom_Id(roomBooking.getCapacityID(), roomBooking.getRoomID());
            if (rp != null) {
                roomPrices.add(rp);
            } else {
                throw new BadRequestAlertException(
                    "Room with ID " +
                    roomBooking.getRoomID() +
                    " does not have a price for provided capacity id " +
                    roomBooking.getCapacityID(),
                    ENTITY_NAME,
                    "roomNotFound"
                );
            }
        }
        // create customer
        Customer billingCustomer = customerRepository.findByEmail(bookingDTO.getBillingCustomer().getEmail());
        if (billingCustomer == null) {
            billingCustomer = customerRepository.save(mapCustomer(bookingDTO.getBillingCustomer()));
        }
        for (CustomerDTO customerDTO : bookingDTO.getCustomers()) {
            Customer foundCustomer = customerRepository.findByEmail(customerDTO.getEmail());
            if (foundCustomer == null) {
                foundCustomer = customerRepository.save(mapCustomer(customerDTO));
            }
            customers.add(foundCustomer);
        }

        LocalDate startDate = bookingDTO.getStartDate();
        Integer duration = bookingDTO.getDuration();
        LocalDate endDate = startDate.plusDays(duration);
        // check if room is free
        for (Room r : rooms) {
            List<Booking> roomBookings = bookingRepository.findByRoomsRoomAndCancled(r, false);
            for (Booking b : roomBookings) {
                if ((!b.getStartDate().isAfter(endDate)) && (!b.getStartDate().plusDays(b.getDuration()).isBefore(startDate))) {
                    throw new BadRequestAlertException("Room with ID is occupied for the given duration", ENTITY_NAME, "roomOccupied");
                }
            }
        }

        if (roomPrices.stream().mapToInt(rp -> rp.getCapacity().getCapacity()).sum() < (customers.size() + 1)) {
            throw new BadRequestAlertException("Room capacities and number of customers don't match", ENTITY_NAME, "tooFewRooms");
        }

        // create booking
        Booking booking = new Booking();
        Float totalPrice = calculatePrice(roomPrices, duration, bookingDTO.getDiscountCode());
        booking.setPrice(totalPrice.intValue());
        booking.setBookingCode(generateRandomBookingCode());
        booking.setRooms(roomPrices);
        booking.setBillingCustomer(billingCustomer);
        booking.setCustomers(customers);
        booking.setDiscount(0.9f);
        booking.setCancled(false);
        booking.setDuration(duration);
        booking.setStartDate(startDate);

        Booking retVal = bookingRepository.save(booking);

        // email
        mailService.sendEmailWithCCs(
            retVal.getBillingCustomer().getEmail(),
            retVal.getCustomers().stream().map(Customer::getEmail).collect(Collectors.toList()),
            "Confirmation of your reservation",
            "Confirmation of your reservation, cancel code is " + retVal.getBookingCode(),
            false,
            false
        );

        return retVal;
    }

    public Booking cancelBooking(Long id, String email, String bookingCode) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            if (booking.getBillingCustomer().getEmail().equals(email) && booking.getBookingCode().equals(bookingCode)) {
                if (Period.between(LocalDate.now(), booking.getStartDate()).getDays() > 1) {
                    booking.setCancled(true);

                    Booking retVal = bookingRepository.save(booking);

                    // email
                    mailService.sendEmailWithCCs(
                        retVal.getBillingCustomer().getEmail(),
                        retVal.getCustomers().stream().map(Customer::getEmail).collect(Collectors.toList()),
                        "Confirmation of your canceled reservation",
                        "Confirmation of your canceled reservation",
                        false,
                        false
                    );

                    return retVal;
                } else {
                    throw new BadRequestAlertException("Booking start date too close", ENTITY_NAME, "bookingCancelError");
                }
            } else {
                throw new BadRequestAlertException("Booking email or booking code wrong", ENTITY_NAME, "bookingCancelError");
            }
        } else {
            throw new BadRequestAlertException("Booking with id " + id + " not found", ENTITY_NAME, "bookingNotFound");
        }
    }

    private String generateRandomBookingCode() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        return random
            .ints(leftLimit, rightLimit + 1)
            .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
            .limit(targetStringLength)
            .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
            .toString();
    }

    private Float calculatePrice(Set<RoomPrice> rooms, Integer duration, String discountCode) {
        Float multiplier = 1.0f;
        Float totalPrice = 0f;

        // TODO differntiate based on discountCode
        if (discountCode != null) {
            multiplier = 0.9f;
        }

        for (RoomPrice r : rooms) {
            totalPrice += r.getPrice();
        }
        totalPrice *= duration;
        totalPrice *= multiplier;

        return totalPrice;
    }

    private Customer mapCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setEmail(customerDTO.getEmail());
        customer.setName(customerDTO.getName());
        customer.setBirthday(customerDTO.getBirthday());
        customer.setGender(customerDTO.getGender());
        customer.setTelephone(customerDTO.getTelephone());
        customer.setBillingAddress(customerDTO.getBillingAddress());
        return customer;
    }

    private void validateBooking(BookingDTO bookingDTO) {
        if (bookingDTO.getStartDate() == null) {
            throw new BadRequestAlertException("StartDate needs to be set", ENTITY_NAME, "StartDateNotPresent");
        }
        if (bookingDTO.getDuration() == null || bookingDTO.getDuration() <= 0) {
            throw new BadRequestAlertException("Duration needs to be set and greater than 0", ENTITY_NAME, "durationNotPresent");
        }
        if (bookingDTO.getBillingCustomer() == null) {
            throw new BadRequestAlertException("At least the billing Customer needs to be set", ENTITY_NAME, "billingCustomerNotSet");
        }
        if (bookingDTO.getRooms() == null || bookingDTO.getRooms().isEmpty()) {
            throw new BadRequestAlertException("At least one room needs to be provided", ENTITY_NAME, "roomNotSet");
        }
    }
}
