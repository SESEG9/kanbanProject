package at.ac.tuwien.sese.g09.domain;

import static org.assertj.core.api.Assertions.assertThat;

import at.ac.tuwien.sese.g09.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RoomCapacityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RoomCapacity.class);
        RoomCapacity roomCapacity1 = new RoomCapacity();
        roomCapacity1.setId(1L);
        RoomCapacity roomCapacity2 = new RoomCapacity();
        roomCapacity2.setId(roomCapacity1.getId());
        assertThat(roomCapacity1).isEqualTo(roomCapacity2);
        roomCapacity2.setId(2L);
        assertThat(roomCapacity1).isNotEqualTo(roomCapacity2);
        roomCapacity1.setId(null);
        assertThat(roomCapacity1).isNotEqualTo(roomCapacity2);
    }
}
