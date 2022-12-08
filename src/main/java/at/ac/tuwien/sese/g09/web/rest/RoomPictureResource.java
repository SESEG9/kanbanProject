package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.RoomPicture;
import at.ac.tuwien.sese.g09.repository.RoomPictureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
@Transactional
public class RoomPictureResource {

    private final Logger log = LoggerFactory.getLogger(RoomPictureResource.class);

    private final RoomPictureRepository roomPictureRepository;

    public RoomPictureResource(RoomPictureRepository roomPictureRepository) {
        this.roomPictureRepository = roomPictureRepository;
    }

    /**
     * {@code GET  /room-prices/:id} : get the "id" roomPrice.
     *
     * @param id the id of the roomPrice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the roomPrice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/room-pictures/{id}")
    public ResponseEntity<RoomPicture> getRoomPrice(@PathVariable Long id) {
        log.debug("REST request to get RoomPrice : {}", id);
        final var roomPicture = roomPictureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(roomPicture);
    }
}
