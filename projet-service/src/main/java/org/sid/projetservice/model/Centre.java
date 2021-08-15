package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Centres")
@Data
@NoArgsConstructor @AllArgsConstructor @ToString
public class Centre {
    @Id private String idCentre;
    private String nom;
    private String cigle;
    private String idResp;

    @Transient private User resp;

    public Centre(String nom, String cigle) {
        this.nom = nom;
        this.cigle = cigle;
    }
}
