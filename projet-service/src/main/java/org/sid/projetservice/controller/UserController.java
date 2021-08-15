package org.sid.projetservice.controller;

import org.sid.projetservice.config.EmailConfig;
import org.sid.projetservice.events.ProbEvent;
import org.sid.projetservice.model.Centre;
import org.sid.projetservice.model.Notification;
import org.sid.projetservice.model.User;
import org.sid.projetservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/byEmail/{email}")
    public Mono<User> getUserByEmail(@PathVariable(value = "email") String email) {
        return userService.findByEmail(email)
                .map(user -> {
                    user.setNotifications(null);
                    return user;
                });
    }

    @GetMapping("/byId/{id}")
    public Mono<User> getUserById(@PathVariable(value = "id") String id) {
        return userService.findById(id);
    }

    @GetMapping("/countUsersInCentre/{idCentre}")
    public Mono<Long> countUsersInCentre(@PathVariable(value = "idCentre") String idCentre, @RequestParam(name = "idResp") String idResp){
        return userService.countUsersInCentre(idCentre, idResp);
    }

    @GetMapping("/countUsersByDemande/{demande}")
    public Mono<Long> countUsersByDemande(@PathVariable(value = "demande") int demande){
        return userService.countUsersByDemande(demande);
    }

    @GetMapping("/like/{str}")
    public Flux<User> getUserLike(@PathVariable(value = "str") String str) {
        return userService.findUserLike(str)
                .map(user -> {
                    User mem = new User();
                    mem.setIdU(user.getIdU());
                    mem.setNom(user.getNom().toUpperCase() + ' ' + user.getPrenom());
                    return mem;
                });
    }

    @GetMapping("/bydemande/{demande}")
    public Flux<User> getUsersByDemande(@PathVariable(value = "demande") int demande,
                                  @RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return userService.findUsersByDemande(demande, page, size)
                .map(user -> {
                    user.setNotifications(null);
                    return user;
                });
    }

    @GetMapping("/inCentre/{str}")
    public Flux<User> getUserLikeAndCentre(@PathVariable(value = "str") String str, @RequestParam(name = "idCentre") String idCentre,
                                  @RequestParam(name = "idResp") String idResp) {
        return userService.findUserLikeAndCentre(str, idCentre, idResp)
                .map(user -> {
                    User mem = new User();
                    mem.setIdU(user.getIdU());
                    mem.setNom(user.getNom().toUpperCase() + ' ' + user.getPrenom());
                    return mem;
                });
    }

    @GetMapping("/allInCentre/{idCentre}")
    public Flux<User> getUsersInCentre(@PathVariable(value = "idCentre") String idCentre, @RequestParam(name = "idResp") String idResp,
                                       @RequestParam(name = "page") int page, @RequestParam(name = "size") int size){
        return userService.findUsersInCentre(idCentre, idResp, page, size)
                .map(user -> {
                    User mem = new User();
                    mem.setIdU(user.getIdU());
                    mem.setNom(user.getNom());
                    mem.setPrenom(user.getPrenom());
                    mem.setEmail(user.getEmail());
                    mem.setGenre(user.getGenre());
                    mem.setActive(user.isActive());
                    return mem;
                });
    }


    @GetMapping("/all")
    public Flux<User> getAllUsers() {
        return userService.findAllUsers()
                .map(user -> {
                    User mem = new User();
                    mem.setIdU(user.getIdU());
                    mem.setNom(user.getNom().toUpperCase() + ' ' + user.getPrenom());
                    return mem;
                });
    }

    @PostMapping("/addMembresCentre")
    public Mono<ResponseEntity<String>> addUsers(@RequestBody List<User> users, Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_RESP")){
                        return Flux.fromIterable(users)
                                .parallel().runOn(Schedulers.parallel())
                                .flatMap(us -> {
                                    return userService.saveUserMembreCentre(us);
                                }).sequential().then(Mono.fromCallable(() -> ResponseEntity.ok("added")));
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }

    @PostMapping("/addUserInsc")
    public Mono<ResponseEntity<String>> addUserInsc(@RequestBody User user){
        return userService.saveUserInsc(user)
                .map(u -> ResponseEntity.ok("added"));
    }

    @GetMapping("/setEtat")
    public Mono<ResponseEntity<String>> setEtat(@RequestParam(name = "etat") boolean etat, @RequestParam(name = "idUser") String idUser,
                                                Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_RESP")){
                        return userService.findById(idUser)
                                .flatMap(us -> {
                                   if(us.getIdCentre().equals(u.getIdCentre())){
                                        us.setActive(etat);
                                        return userService.saveUser(us)
                                                .map(uu -> ResponseEntity.ok("updated"));
                                   }
                                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                });
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }

    @GetMapping("/setEtatDemande")
    public Mono<ResponseEntity<String>> setEtatDemande(@RequestParam(name = "etat") boolean etat, @RequestParam(name = "idUser") String idUser){
        return userService.findById(idUser)
                .flatMap(us -> {
                    us.setActive(etat);
                    us.setDemande(etat ? 2 : 3);
                    return userService.saveUser(us)
                            .map(uu -> ResponseEntity.ok("updated"));
                });
    }

    @GetMapping("/reinitPassword")
    public Mono<ResponseEntity<String>> setEtat(@RequestParam(name = "idUser") String idUser, Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_RESP") || u.getRoles().contains("ROLE_ADMIN")){
                        return userService.findById(idUser)
                                .flatMap(us -> {
                                   if(us.getIdCentre().equals(u.getIdCentre()) || u.getRoles().contains("ROLE_ADMIN")){
                                        return userService.reInitPassword(us)
                                                .map(uu -> ResponseEntity.ok("updated"));
                                   }
                                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                });
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }

    @GetMapping("/filterMembres")
    Flux<User> getFiltredMembres(@RequestParam(name = "key") String key, @RequestParam(name = "etat") boolean etat, @RequestParam(name = "centre") String centre) {
        return userService.filterUsers(key, etat, centre)
                .map(user -> {
                    User mem = new User();
                    mem.setIdU(user.getIdU());
                    mem.setNom(user.getNom());
                    mem.setPrenom(user.getPrenom());
                    mem.setEmail(user.getEmail());
                    mem.setGenre(user.getGenre());
                    mem.setActive(user.isActive());
                    return mem;
                });
    }

    /*@GetMapping("/filterMembres")
    Flux<User> getFiltredMembres(@RequestParam(name = "key") String key, @RequestParam(name = "etat") boolean etat, Principal principal) {
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_RESP") || u.getRoles().contains("ROLE_ADMIN")){

                    }
                });
    }*/
}
