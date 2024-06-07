package dev.esgi.javaclient.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    private int id;
    private String name;
    private String details;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private List<Member> participants;
    private List<Resource> usedResources;
}
