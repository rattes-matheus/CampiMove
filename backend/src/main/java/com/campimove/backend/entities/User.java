package com.campimove.backend.entities;

import com.campimove.backend.enums.Role;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean verified;
    private boolean active;

    @Column(name = "phone")
    private String phone;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "license_category")
    private String licenseCategory;

    private Integer age;
    private Double rating;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;
}