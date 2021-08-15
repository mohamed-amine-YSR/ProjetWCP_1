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
public class Phase {
    private String idPhase;
    private String titre;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private List<Tache> taches = new ArrayList<>();
    @Transient private int countTaches = 0;

    public Phase(String titre, String description, List<Tache> taches) {
        this.idPhase = new ObjectId().toString();
        this.description = description;
        this.titre = titre;
        this.dateDebut = new Date();
        this.taches = taches;
    }

    public Phase(String idPhase) {
        this.idPhase = idPhase;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Phase phase = (Phase) o;
        return idPhase.equals(phase.idPhase);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPhase);
    }

    public void addTache(Tache tache){
        this.taches.add(tache);
    }

    public void addAllTaches(List<Tache> taches) {
        this.taches.addAll(taches);
    }

    public boolean removeTache(Tache tache){
        return this.taches.removeIf(t -> t.equals(tache));
    }

    public int findTachesCompleted(){
        int c = 0;
        for (Tache t: getTaches()) {
            if(t.getDateRemise() != null)    c++;
        }
        return c;
    }
}
