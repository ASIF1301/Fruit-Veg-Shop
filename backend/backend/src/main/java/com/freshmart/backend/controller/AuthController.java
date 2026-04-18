package com.freshmart.backend.controller;

import com.freshmart.backend.model.User;
import com.freshmart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository repo;

    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        Optional<User> existing = repo.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            return "User already exists";
        }

        repo.save(user);
        return "Registration successful";
    }

    // LOGIN
    @PostMapping("/login")
    public Object login(@RequestBody User user) {

        Optional<User> existing = repo.findByEmail(user.getEmail());

        if (existing.isEmpty()) {
            return "User not found";
        }

        if (!existing.get().getPassword().equals(user.getPassword())) {
            return "Invalid password";
        }

        return existing.get(); // only if correct
    }
}
