package org.sid.projetservice.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.sid.projetservice.Security.PBKDF2Encoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class User implements UserDetails {

    @Id
    private String idU;
    private String nom;
    private String prenom;
    private String genre;
    private String idCentre;

    private String centre;

    private String email;

    private String password;

    private boolean active;

    private int demande; //1: en cours, 2: accept, 3: refuse

    @DBRef
    private List<Skill> skills;

    private List<String> roles = new ArrayList<>();

    private List<Notification> notifications = new ArrayList<>();

    public User(String nom, String prenom, String genre, String email, String password, boolean active, List<String> roles) {
        this.nom = nom;
        this.prenom = prenom;
        this.genre = genre;
        this.email = email;
        this.password = password;
        this.active = active;
        this.roles = roles;
    }

    public User(String idU) {
        this.idU = idU;
    }

    //for Invited users
    public User(String email, String str, String pass){
        //String str = email.substring(0,email.indexOf("@"));
        //System.out.println(str);
        this.nom = "";
        this.prenom = str;
        this.genre = "n";
        this.email = email;
        this.active = true;
        this.roles = Arrays.asList("ROLE_INVITED");
        this.password = pass;
        //System.out.println("pass: "+this.password);
    }

    //for returns in controller


    public User(String idU, String nom, String prenom, String genre) {
        this.idU = idU;
        this.nom = nom;
        this.prenom = prenom;
        this.genre = genre;
        this.roles = new ArrayList<>();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return idU.equals(user.idU);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idU);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }


    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !active;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    public Integer sizeIntersection(List<Skill> sks){
        int size = 0;
        for(Skill s: this.skills){
            if(sks.contains(s)) size++;
        }

        return new Integer(size);
    }

    public void addNotification(Notification n){
        this.notifications.add(n);
    }

    public void addRole(String role) {
        this.roles.add(role);
    }

    public void removeRole(String role) {
        this.roles.removeIf(r -> r.equals(role));
    }
}
