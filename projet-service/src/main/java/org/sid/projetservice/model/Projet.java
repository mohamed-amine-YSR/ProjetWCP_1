package org.sid.projetservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "Projets")
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Projet {
    @Id private String idPrj;

    private String idOwner;

    @Transient private User probOwner;

    private String probTitle;
    private String probDesc;
    private Date probDate;
    private List<Commentaire> commentaires;

    //private String titre;
    //private String description;

    private Boolean isPrivate =false;
    private Boolean isPaused = false;
    private Boolean isSubmitted = false;
    private Boolean disableComments = false;
    private int etat = 2;
    private Date dateSoumission;
    private Date dateAffectation;
    //private double budget;

    private List<Phase> phases = new ArrayList<>();
    private Date dateDebut;
    private Date dateFin;

    @DBRef private User chef;
    @DBRef private List<User> membres = new ArrayList<>();
    @DBRef private List<User> likers;
    @DBRef private List<User> dislikers;
    @DBRef private List<User> demandesAdhesion;
    @DBRef private List<Skill> skills;

    private List<DemandeAcces> demandesAcces = new ArrayList<>();
    private List<String> invitations = new ArrayList<>();

    private String idDecideur;
    private String motifsRefus = "";

    /*@DBRef
    private Discipline discipline;*/

    @Transient private int countPhases;
    @Transient private int countMembres;
    @Transient private int countTaches;
    @Transient private int countTachesCompleted;
    @Transient private double pourcentageCompleted;
    @Transient private int countAccessPrj;
    @Transient private int countRequestPrj;
    @Transient private int countAccessPrjAll;
    @Transient private int countRequestPrjAll;
    @Transient private int countLikers ;
    @Transient private int countDislikers ;
    @Transient private int countComments ;
    @Transient private boolean reactAdded = false;
    @Transient private boolean demandeProcessed = false;

    public Projet(/*String titre, String description, Discipline discipline,*/ Boolean isPrivate, List<Phase> phases, Date dateDebut,
                  Date dateFin,User membre, List<User> membres, List<Skill> skills) {
        this.phases = new ArrayList<>();
        this.membres = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.commentaires = new ArrayList<>();

        //this.titre = titre;
        //this.description = description;
        this.isPrivate = isPrivate;
        this.phases = phases;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.chef = membre;
        this.membres = membres;
        this.skills = skills;
        //this.discipline = discipline;
    }

    //Pour le lancement d'une problematique
    public Projet(String idOwner, String probTitle, String probDesc, List<Skill> skills) {
        this.idOwner = idOwner;
        this.probTitle = probTitle;
        this.probDesc = probDesc;
        this.probDate = new Date();
        this.skills = skills;
    }

    public Projet(String idPrj) {
        this.idPrj = idPrj;
    }

    public boolean addSkill(Skill s){
        if(this.skills == null) this.skills = new ArrayList<>();
        return this.skills.add(s);
    }
    public boolean updateSkills() {
        return this.skills.removeIf(skill -> skill.getName()==null || skill.getName().equals(""));
    }

    public boolean addPhase(Phase phase){
        return this.phases.add(phase);
    }

    public boolean removePhase(String idPhase){
        return this.phases.removeIf(phase -> phase.getIdPhase().equals(idPhase));
    }

    public boolean addMembre(User membre){
        return this.membres.add(membre);
    }

    public boolean removeMembre(String ref){
        return this.membres.removeIf(membre -> membre.getIdU().equals(ref));
    }

    public boolean addComment(Commentaire commentaire){
        if(this.commentaires == null) this.commentaires = new ArrayList<>();
        return this.commentaires.add(commentaire);
    }

    public boolean addLiker(User user){
        if(this.likers == null) this.likers = new ArrayList<>();
        return this.likers.add(user);
    }

    public boolean addDemande(User user){
        if(this.demandesAdhesion == null) this.demandesAdhesion = new ArrayList<>();
        return this.demandesAdhesion.add(user);
    }

    public boolean removeDemande(String idU){
        if(this.demandesAdhesion == null) this.demandesAdhesion = new ArrayList<>();
        return this.demandesAdhesion.removeIf(demande -> demande.getIdU().equals(idU));
    }

    public boolean addDisliker(User user){
        if(this.dislikers == null) this.dislikers = new ArrayList<>();
        return this.dislikers.add(user);
    }

    public void updateCounts(){
        this.countMembres = 0;
        this.countTaches = 0;
        this.countTachesCompleted = 0;
        this.countAccessPrj = 0;
        this.countAccessPrjAll = 0;
        this.countRequestPrj = 0;
        this.countRequestPrjAll = 0;

        this.countMembres = this.membres.size();
        for (Phase p: this.phases) {
            this.countTaches += p.getTaches().size();
            this.countTachesCompleted += p.findTachesCompleted();
        }
        if(this.countTaches == 0 || this.countTachesCompleted == 0) this.pourcentageCompleted = 0;
        else this.pourcentageCompleted = (this.countTachesCompleted*100)/this.countTaches;

        for(DemandeAcces d: demandesAcces) {
            if(d.getIdPrj().equals(this.idPrj)) {
                this.countAccessPrjAll ++;
                if(d.getEtat() == 1)  this.countAccessPrj ++;
            }
            else if(d.getIdRequestedPrj().equals(this.idPrj)) {
                this.countRequestPrjAll ++;
                if(d.getEtat() == 1) this.countRequestPrj ++;
            }
        }
    }

    public void updateCountPhases() {
        this.countPhases = 0;
        this.countPhases = this.phases.size();
    }

    public void addDemandeAcces(DemandeAcces d){
        if(this.demandesAcces == null) this.demandesAcces = new ArrayList<>();
        demandesAcces.add(d);
    }

    public void addAllDemandeAcces(List<DemandeAcces> d){
        if(this.demandesAcces == null) this.demandesAcces = new ArrayList<>();
        demandesAcces.addAll(d);
    }

    public Integer sizeIntersection(List<Skill> sks){
        int size = 0;
        for(Skill s: this.skills){
            if(sks.contains(s)) size++;
        }

        return new Integer(size);
    }

    public void justIdAndTitle() {
        this.phases = null;
        this.commentaires = null;
        this.demandesAdhesion = null;
        this.likers = null;
        this.dislikers = null;
        this.idOwner = null;
        this.probDesc = null;
        this.probDate = null;
        this.dateDebut = null;
        this.dateFin = null;
        this.membres = null;
        this.chef = null;
        this.skills = null;
    }


}
