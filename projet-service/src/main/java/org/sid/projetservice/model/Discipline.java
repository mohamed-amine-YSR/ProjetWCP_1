package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Disciplines")
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Discipline {
    @Id
    private String id;
    private String name;
    @DBRef
    List<Skill> skills;

    public Discipline(String name, List<Skill> skills) {
        this.name = name;
        this.skills = skills;
    }
}
