package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "active")
    private boolean active;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    public User(String email, String password, Role role) {
        this.name = email.split("@")[0];
        this.email = email;
        this.password = password;
        this.role = role;
        this.verified = false;
        this.active = true;
    }
}


