package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Tache {
    private String ref;
    private String title;
    private String idMembre;
    private String livrable;
    private Date dateRemise;
    private Date dateLimite;
    private List<Date> modifications = new ArrayList<>();
    @Transient User user;

    public Tache(String title, String idmembre, Date dateLimite) {
        this.ref = new ObjectId().toString();
        this.title = title;
        this.idMembre = idmembre;
        this.dateLimite = dateLimite;
    }

    public void addLivrable(String livrable){
        this.livrable = livrable;
        this.dateRemise = new Date();
    }

    public void updateLivrable(String livrable){
        this.livrable = livrable;
        this.modifications.add(new Date());
    }

    public void updateTache(Tache tache){
        this.title = tache.getTitle();
        this.idMembre = tache.getIdMembre();
        this.dateLimite = tache.getDateLimite();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tache tache = (Tache) o;
        return ref.equals(tache.ref);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ref);
    }
}
