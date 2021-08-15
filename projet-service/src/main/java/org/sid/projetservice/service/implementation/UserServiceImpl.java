package org.sid.projetservice.service.implementation;

import org.sid.projetservice.Security.PBKDF2Encoder;
import org.sid.projetservice.model.Skill;
import org.sid.projetservice.model.User;
import org.sid.projetservice.repository.UserRepository;
import org.sid.projetservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PBKDF2Encoder passwordEncoder;

    @Override
    public Flux<User> findAllByPage(Integer page, Integer size) {
        return userRepository.findAll();
    }

    @Override
    public Mono<Long> countAllUsers() {
        return userRepository.count();
    }

    @Override
    public Mono<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Mono<User> findById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Mono<User> findNotificationsById(String id, Integer skip, Integer limit) {
        return userRepository.findNotificationsById(id,skip,limit);
    }

    @Override
    public Mono<User> findNotificationByIds(String idU, String idN) {
        return userRepository.findNotificationByIds(idU, idN);
    }

    @Override
    public Mono<User> findAdmin() {
        return userRepository.findFirstByRolesIn(Collections.singletonList("ROLE_ADMIN"));
    }

    @Override
    public Mono<User> saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Mono<User> saveUserResp(User user) {
        User us = user;
        us.setActive(true);
        us.setRoles(Arrays.asList("ROLE_MEMBRE", "ROLE_RESP"));
        us.setPassword(passwordEncoder.encode(us.getEmail().substring(0,us.getEmail().indexOf("@"))));
        return userRepository.save(us);
    }

    @Override
    public Mono<User> saveUserInsc(User user) {
        User us = user;
        us.setRoles(Arrays.asList("ROLE_MEMBRE"));
        us.setPassword(passwordEncoder.encode(us.getPassword()));
        return userRepository.save(us);
    }

    @Override
    public Mono<User> reInitPassword(User user) {
        user.setPassword(passwordEncoder.encode(user.getEmail().substring(0,user.getEmail().indexOf("@"))));
        return userRepository.save(user);
    }

    @Override
    public Mono<User> saveUserMembreCentre(User user) {
        User us = user;
        us.setPassword(passwordEncoder.encode(us.getEmail().substring(0,us.getEmail().indexOf("@"))));
        return userRepository.save(us);
    }

    @Override
    public Flux<User> saveUsers(List<User> users) {
        return userRepository.saveAll(users);
    }

    @Override
    public Flux<User> findUserLike(String like) {
        return userRepository.findUsersByNomLikeIgnoreCaseOrPrenomLikeIgnoreCaseAndActive(like, like, true);
    }

    @Override
    public Flux<User> findUserLikeAndCentre(String like, String idCentre, String idUser) {
        return userRepository.findUsersByActiveAndIdCentreAndIdUIsNotAndNomLikeIgnoreCase(true, idCentre, idUser, like);
    }

    @Override
    public Flux<User> findUsersInCentre(String idCentre, String idResp, Integer page, Integer size) {
        return userRepository.findUsersByIdCentreAndIdUIsNot(idCentre, idResp, PageRequest.of(page,size));
    }

    @Override
    public Flux<User> findUsersByDemande(int demande, Integer page, Integer size) {
        return userRepository.findUsersByDemande(demande, PageRequest.of(page,size));
    }

    @Override
    public Mono<Long> countUsersByDemande(int demande) {
        return userRepository.countUsersByDemande(demande);
    }

    @Override
    public Mono<Long> countUsersInCentre(String idCentre, String idResp) {
        return userRepository.countUsersByIdCentreAndIdUIsNot(idCentre, idResp);
    }

    @Override
    public Flux<User> findDecideurs() {
        return userRepository.findUsersByRolesInAndActive(Collections.singletonList("ROLE_JURY"),true);
    }

    @Override
    public Flux<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Flux<User> getBySkills(List<Skill> skills, String id) {
        return userRepository.findUsersBySkillsInAndIdUIsNot(skills, id);
    }

    @Override
    public Flux<User> filterUsers(String key, boolean etat, String idCentre) {
        return userRepository.findUsersByNomLikeIgnoreCaseAndActiveAndIdCentreAndRolesNotContainingOrPrenomLikeIgnoreCaseAndActiveAndIdCentreAndRolesNotContaining(
                key, etat, idCentre, "ROLE_RESP", key, etat, idCentre, "ROLE_RESP");
    }

}
