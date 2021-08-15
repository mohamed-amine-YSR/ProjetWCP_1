package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;

import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Notification {
    private String idNotif;
    private Date dateNotif;
    // 1:react; 2:comment; 3:adh;
    // 4:DdePrj; 5:DdePrj affected to decideur, 6:DdePrjAccepted; 7:DdePrjRefused;
    // 8:accessPrj; 9:accessPrjAccept; 10: accessPrjRefused
    // 11:invitPrj; 12:invitPrjChef
    // 13:affectTache; 14:livrable
    private int type;
    private int etat = 2;
    private String content;
    private String idPrj;
    private String idPrjRequested;
    private String idUser;
    @Transient private User user;
    @Transient private Projet projet;

    public Notification(int type, String idPrj, String idPrjReq, String idUser) {
        this.idNotif = new ObjectId().toString();
        this.dateNotif = new Date();
        this.type = type;
        this.idPrj = idPrj;
        this.idPrjRequested = idPrjReq;
        this.idUser = idUser;
        this.etat = 2;
    }

    public Notification(int type, String idPrj, String content) {
        this.idNotif = new ObjectId().toString();
        this.dateNotif = new Date();
        this.etat = 2;
        this.type = type;
        this.idPrj = idPrj;
        this.content = content;
    }
}
