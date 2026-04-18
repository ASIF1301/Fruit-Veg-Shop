package com.freshmart.backend.controller;

import com.freshmart.backend.model.CartItem;
import com.freshmart.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartRepository repo;

    // ADD TO CART
    @PostMapping("/add")
    public String addToCart(@RequestBody CartItem item) {

        List<CartItem> existing = repo.findByUserEmail(item.getUserEmail());

        for (CartItem c : existing) {
            if (c.getProductId().equals(item.getProductId())) {
                c.setQuantity(c.getQuantity() + 1);
                repo.save(c);
                return "Updated quantity";
            }
        }

        repo.save(item);
        return "Added to cart";
    }

    // GET CART
    @GetMapping("/{email}")
    public List<CartItem> getCart(@PathVariable String email) {
        return repo.findByUserEmail(email);
    }

    // REMOVE ITEM
    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // CLEAR CART
    @DeleteMapping("/clear/{email}")
    public void clearCart(@PathVariable String email) {
        List<CartItem> items = repo.findByUserEmail(email);
        repo.deleteAll(items);
    }
}