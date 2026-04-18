package com.freshmart.backend.controller;

import com.freshmart.backend.model.Order;
import com.freshmart.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @PostMapping
    public String placeOrder(@RequestBody Order order) {
        repo.save(order);
        return "Order placed successfully";
    }
}
