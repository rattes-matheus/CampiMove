package com.campimove.backend.services;

import com.campimove.backend.entities.Driver;
import com.campimove.backend.entities.Transport;
import com.campimove.backend.entities.User;
import com.campimove.backend.enums.Role;
import com.campimove.backend.repositories.TransportRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class DriverService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransportRepository transportRepository;

    public List<Driver> generate() {

        List<Driver> drivers = new LinkedList<>();

        List<User> users = userRepository.findByRole(Role.DRIVER);

        for (User user : users) {
            Transport transport = transportRepository.findByMotorist(user.getEmail());
            if (transport != null) {
                drivers.add(new Driver(user.getId(), user.getRating(), user.getProfilePictureUrl(), transport.getType(), user.getName(), transport.getModel(), transport.getContact()));
            }
        }

        return drivers;
    }

}
