package com.campimove.backend.controllers;


import com.campimove.backend.entities.User;
import com.campimove.backend.services.ShowUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/show-users")
public class ShowUsersController {
    @Autowired
    private ShowUsersService showUsersService;

    @GetMapping
    public ResponseEntity<List<User>> showUsers() {
        return ResponseEntity.status(200).body(showUsersService.listUsers());
    }
}
