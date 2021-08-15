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

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Commentaire {
    private String IdCom;
    private String idUser;

    @Transient
    private User user;
    private Date dateCom;
    private String comment;
    //private List<Reponse> reponses;

    /*@Transient
    private int countResponses = reponses!=null ? reponses.size() : 0;*/

    public Commentaire(String idUser, String comment) {
        //this.reponses = new ArrayList<>();
        this.IdCom = new ObjectId().toString();
        this.dateCom = new Date();
        this.idUser = idUser;
        this.comment = comment;
    }

   /* public void addReponse(Reponse rep){
        this.reponses.add(rep);
    }*/
}
