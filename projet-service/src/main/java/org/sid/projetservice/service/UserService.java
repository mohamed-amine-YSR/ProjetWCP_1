package org.sid.projetservice.service;

import org.sid.projetservice.model.Skill;
import org.sid.projetservice.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface UserService {
    public Flux<User> findAllByPage(Integer page, Integer size);

    public Mono<Long> countAllUsers();

    public Mono<User> findByEmail(String email);

    public Mono<User> findById(String id);

    public Mono<User> findNotificationsById(String id, Integer skip, Integer limit);

    public Mono<User> findNotificationByIds(String idU, String idN);

    public Mono<User> findAdmin();

    public Mono<User> saveUser(User user);

    public Mono<User> saveUserResp(User user);

    public Mono<User> reInitPassword(User user);

    public Mono<User> saveUserMembreCentre(User user);

    public Mono<User> saveUserInsc(User user);

    public Flux<User> saveUsers(List<User> users);

    public Flux<User> findUserLike(String like);

    public Flux<User> findUserLikeAndCentre(String like, String idCentre, String idUser);

    public Flux<User> findUsersInCentre(String idCentre, String idResp, Integer page, Integer size);

    public Flux<User> findUsersByDemande(int demande, Integer page, Integer size);

    public Mono<Long> countUsersByDemande(int demande);

    public Mono<Long> countUsersInCentre(String idCentre, String idResp);

    public Flux<User> findDecideurs();

    public Flux<User> findAllUsers();

    public Flux<User> getBySkills(List<Skill> skills, String id);

    public Flux<User> filterUsers(String key, boolean etat, String idCentre);
}
