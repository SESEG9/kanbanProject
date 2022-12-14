package at.ac.tuwien.sese.g09.web.rest;

import at.ac.tuwien.sese.g09.domain.Discount;
import at.ac.tuwien.sese.g09.service.DiscountService;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Transactional
public class DiscountResource {

    private final DiscountService discountService;

    public DiscountResource(DiscountService discountService) {
        this.discountService = discountService;
    }

    @PostMapping("/discount")
    public void createBooking(@RequestParam String discountCode, @RequestParam Float discountPercentage) {
        discountService.addDiscount(discountCode, discountPercentage);
    }

    @GetMapping("/public/discount")
    public Discount getDiscountPercentage(@RequestParam String discountCode) {
        return discountService.getDiscount(discountCode);
    }

    @GetMapping("/discount")
    public List<Discount> getAllDiscounts(@RequestParam String discountCode) {
        return discountService.getAllDiscounts();
    }
}
