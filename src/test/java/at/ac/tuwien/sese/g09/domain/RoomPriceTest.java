package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RoomPriceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RoomPrice.class);
        RoomPrice roomPrice1 = new RoomPrice();
        roomPrice1.setId(1L);
        RoomPrice roomPrice2 = new RoomPrice();
        roomPrice2.setId(roomPrice1.getId());
        assertThat(roomPrice1).isEqualTo(roomPrice2);
        roomPrice2.setId(2L);
        assertThat(roomPrice1).isNotEqualTo(roomPrice2);
        roomPrice1.setId(null);
        assertThat(roomPrice1).isNotEqualTo(roomPrice2);
    }
}
