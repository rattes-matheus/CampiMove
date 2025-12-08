package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "forgot_passwords")
public class ForgotPassword {
  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "email")
  private String email;

  @Column(name = "token")
  private String token;

  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  public Boolean isExpired() {
    return LocalDateTime.now().isAfter(this.expiresAt);
  }
}
