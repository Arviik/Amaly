package dev.esgi.javaclient.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String type;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime membershipDate;
    private int organizationID;
    private int userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
