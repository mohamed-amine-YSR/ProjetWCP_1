package org.sid.projetservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;

import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Reponse {
    private String IdRep;
    private User user;
    private Date dateRep;
    private String response;

    public Reponse(User user, String response) {
        this.IdRep = new ObjectId().toString();
        this.dateRep = new Date();
        this.user = user;
        this.response = response;
    }
}
