package org.sid.projetservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Membres")
@Data
@NoArgsConstructor
//@AllArgsConstructor
@ToString
@Builder
public class Membre {
    @Id
    private String refM;
    private String nom;

    public Membre(String refM, String nom) {
        this.refM = refM;
        this.nom = nom;
    }
}
