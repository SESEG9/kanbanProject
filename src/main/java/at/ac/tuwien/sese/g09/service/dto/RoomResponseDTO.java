package at.ac.tuwien.sese.g09.service.dto;

import java.util.Set;

public class RoomResponseDTO {

    private final Long id;
    private final String identifyer;
    private final Integer maxCapacity;
    private final Set<RoomPriceResponseDTO> prices;
    private final Set<Long> pictureIDs;

    public Long getId() {
        return id;
    }

    public String getIdentifyer() {
        return identifyer;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public Set<RoomPriceResponseDTO> getPrices() {
        return prices;
    }

    public Set<Long> getPictureIDs() {
        return pictureIDs;
    }

    public RoomResponseDTO(Long id, String identifyer, Integer maxCapacity, Set<RoomPriceResponseDTO> prices, Set<Long> pictureIDs) {
        this.id = id;
        this.identifyer = identifyer;
        this.maxCapacity = maxCapacity;
        this.prices = prices;
        this.pictureIDs = pictureIDs;
    }

    public static class RoomPriceResponseDTO {

        private final Long id;
        private final Integer price;
        private final RoomCapacityResponseDTO capacity;

        public RoomPriceResponseDTO(Long id, Integer price, RoomCapacityResponseDTO capacity) {
            this.id = id;
            this.price = price;
            this.capacity = capacity;
        }

        public Long getId() {
            return id;
        }

        public Integer getPrice() {
            return price;
        }

        public RoomCapacityResponseDTO getCapacity() {
            return capacity;
        }
    }

    public static class RoomCapacityResponseDTO {

        private final Long id;
        private final String name;
        private final Integer capacity;

        public RoomCapacityResponseDTO(Long id, String name, Integer capacity) {
            this.id = id;
            this.name = name;
            this.capacity = capacity;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public Integer getCapacity() {
            return capacity;
        }
    }
}
