package at.ac.tuwien.sese.g09.service;

import at.ac.tuwien.sese.g09.domain.Discount;
import at.ac.tuwien.sese.g09.repository.DiscountRepository;
import at.ac.tuwien.sese.g09.service.errors.BadRequestAlertException;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DiscountService {

    private static final String ENTITY_NAME = "discount";
    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    public void addDiscount(String code, Float percentage) {
        if (code.length() < 5 || code.length() > 10) {
            throw new BadRequestAlertException(
                "Discount Code length must be between 5 and 10 characters long",
                ENTITY_NAME,
                "discountCodeWrongLength"
            );
        }
        if (percentage < 0 || percentage > 1) {
            throw new BadRequestAlertException(
                "Discount Percentage must be between 0 and 100 characters long",
                ENTITY_NAME,
                "discountPercentageInvalidSize"
            );
        }

        Discount discount = new Discount();
        discount.setDiscountCode(code);
        discount.setDiscountPercentage(percentage);

        discountRepository.save(discount);
    }

    public Discount getDiscount(String code) {
        Discount discount = discountRepository.findByDiscountCode(code).stream().findFirst().orElse(null);

        if (discount == null) {
            throw new BadRequestAlertException("No Discount with this code found", ENTITY_NAME, "discountNotFound");
        }

        return discount;
    }

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }
}
