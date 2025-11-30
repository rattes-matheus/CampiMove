package com.campimove.backend.services;

import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowUsersService {
    @Autowired
    UserRepository userRepository;

    public List<User> listUsers(){
        return userRepository.findAll();
    }
}
