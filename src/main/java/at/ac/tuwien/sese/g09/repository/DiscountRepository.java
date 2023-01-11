package at.ac.tuwien.sese.g09.repository;

import at.ac.tuwien.sese.g09.domain.Discount;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    List<Discount> findByDiscountCode(String code);
}
