package org.sid.projetservice.controller;

import org.sid.projetservice.model.Centre;
import org.sid.projetservice.model.User;
import org.sid.projetservice.service.CentreService;
import org.sid.projetservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.security.Principal;

@RestController
@RequestMapping("/centre")
public class CentreController {
    @Autowired
    private CentreService centreService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    Flux<Centre> getAllCentes(){
        return centreService.getAll();
    }

    @GetMapping("/byId/{idC}")
    public Mono<Centre> getCentreById(@PathVariable(value = "idC") String idC) {
        return centreService.findCentreById(idC);
    }

    @GetMapping("/countCentres")
    public Mono<Long> countCentres(){
        return centreService.countAllCentres();
    }

    @GetMapping("/getCentresByPage")
    public Flux<Centre> getAllCentres(@RequestParam(name = "page") int page,
                                    @RequestParam(name = "size") int size){
        return centreService.getCentresByPage(page, size)
                .concatMap(centre ->
                        Mono.just(centre)
                                .zipWith(userService.findById(centre.getIdResp()), (c,u) -> {
                                    User resp = new User(u.getIdU(), u.getNom(), u.getPrenom(), u.getGenre());
                                    c.setResp(resp);
                                    return c;
                                })
                );
    }

    @PostMapping("/addCentre")
    Mono<ResponseEntity<String>> saveCentre(@RequestBody Centre centre, Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_ADMIN")){
                        return centreService.saveCentre(centre)
                                .flatMap(c -> {
                                    User resp = centre.getResp();
                                    resp.setIdCentre(c.getIdCentre());
                                    return userService.saveUserResp(resp)
                                            .flatMap(us -> {
                                                Centre cc = c;
                                                cc.setIdResp(us.getIdU());
                                                return centreService.saveCentre(cc)
                                                        .map(p -> ResponseEntity.ok("saved"));
                                            });
                                });
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }

    @PutMapping("/updateCentre")
    Mono<ResponseEntity<String>> updateCentre(@RequestBody Centre centre, Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(u -> {
                    if(u.getRoles().contains("ROLE_ADMIN")){
                        return centreService.findCentreById(centre.getIdCentre())
                                .flatMap(c -> centreService.saveCentre(centre)
                                    .flatMap( c1 -> userService.findById(c.getIdResp())
                                        .flatMap(u_before -> {
                                            u_before.removeRole("ROLE_RESP");
                                            return userService.saveUser(u_before)
                                                    .flatMap(us -> userService.findById(c1.getIdResp())
                                                            .flatMap(u_after -> {
                                                                u_after.addRole("ROLE_RESP");
                                                                return userService.saveUser(u_after)
                                                                        .map(p -> ResponseEntity.ok("updated"));
                                                            })
                                                    );
                                        })
                                    )
                                );
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }
}
