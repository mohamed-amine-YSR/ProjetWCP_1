package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

@Document(collection = "Competences")
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Skill {
    @Id
    private String ref;
    private String name;

    public Skill(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Skill skill = (Skill) o;
        return ref.equals(skill.ref);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ref);
    }
}
