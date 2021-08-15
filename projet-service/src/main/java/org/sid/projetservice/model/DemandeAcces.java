package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.Date;
import java.util.Objects;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class DemandeAcces {
    private String idD;
    private String idPrj;
    private String idRequestedPrj;
    private Date dateDemande;
    private Date dateDecision;
    private int etat = 2;

    @Transient private Projet projet;

    public DemandeAcces(String idPrj, String idRequestedPrj){
        this.idD = new ObjectId().toString();
        this.idPrj = idPrj;
        this.idRequestedPrj = idRequestedPrj;
        this.dateDemande = new Date();
    }

    public void decisionDemande(boolean d) {
        this.dateDecision = new Date();
        this.setEtat(d ? 1 : 0);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DemandeAcces that = (DemandeAcces) o;
        return idPrj.equals(that.idPrj) &&
                idRequestedPrj.equals(that.idRequestedPrj);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPrj, idRequestedPrj);
    }
}
