package org.sid.projetservice.controller;

import org.bson.types.ObjectId;
import org.sid.projetservice.Security.PBKDF2Encoder;
import org.sid.projetservice.config.EmailConfig;
import org.sid.projetservice.events.ProbEvent;
import org.sid.projetservice.model.*;
import org.sid.projetservice.service.ProjetService;
import org.sid.projetservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/projet")

public class ProjetController {
    @Autowired
    private PBKDF2Encoder passwordEncoder;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private ProjetService projetService;

    @Autowired
    private UserService userService;

    @GetMapping("/all") /*(produces = MediaType.TEXT_EVENT_STREAM_VALUE)*/
    public Flux<Projet> streamProjets(){
        return projetService.getAllProjets();
    }

    @GetMapping("/byPage")
    public Flux<Projet> getProjetsByPage(@RequestParam(name = "page", defaultValue = "0") int page,
                                         @RequestParam(name = "size", defaultValue = "6") int size){
        return projetService.getProjetsByPage(page,size);
    }

    @GetMapping("/countPublic")
    public Mono<Integer> getProjetsByPage(){
        return projetService.countPublicProjets();
    }

    @GetMapping("/countProbs")
    public Mono<Long> getProbs(){
        return projetService.countAllProbs();
    }

    @GetMapping("/byId/{id}")
    public Mono<Projet> getProjetById(@PathVariable(value = "id") String id){
        return projetService.getById(id)
                .map(projet -> {
                    projet.updateCounts();
                    //projet.getDiscipline().setSkills(null);
                    return projet;
                });
    }

    @GetMapping("/getProb/{id}")
    public Mono<Projet> getProbById(@PathVariable(value = "id") String id){
        return projetService.getProbById(id)
                .flatMap(prb -> Mono.just(prb)
                .zipWith(userService.findById(prb.getIdOwner()), (p, u) -> {
                        p.setProbOwner(u);
                        p.setCountComments(p.getCommentaires() != null ? p.getCommentaires().size() : 0);
                        p.setCountLikers(p.getLikers() != null ? p.getLikers().size() : 0);
                        p.setCountDislikers(p.getDislikers() != null ? p.getDislikers().size() : 0);
                        p.setPhases(null);
                        p.updateSkills();
                        return p;
                })
                );
    }

    @GetMapping("/getSkills/{id}")
    public Flux<Skill> getSkills(@PathVariable(value = "id") String id) {
        return projetService.getProbById(id)
                .flatMapMany(projet -> Flux.fromIterable(projet.getSkills() != null ? projet.getSkills() : new ArrayList<>()))
                .flatMap(skill -> projetService.getSkillById(skill.getRef()));
    }

    @GetMapping("/getAccess/{id}")
    public Mono<ResponseEntity<?>> getAccess(@PathVariable(value = "id") String id, Principal principal) {
        return projetService.getById(id)
                .flatMap(p -> userService.findByEmail(principal.getName())
                                .flatMap(u -> {
                                    // nzid || access == true
                                    if(((p.getIsSubmitted() && p.getEtat() == 1) && (p.getMembres().contains(u) || p.getChef().equals(u) || !p.getIsPrivate())) ||
                                            (p.getIsSubmitted() && p.getIdOwner().equals(u.getIdU()))) {
                                        return Mono.just(ResponseEntity.ok("true"));
                                    }
                                    return Mono.just(ResponseEntity.ok("false"));
                                })
                );
    }

    @GetMapping("/getComments/{id}/{skip}/{limit}")
    public Flux<Commentaire> getProbById(@PathVariable(value = "id") String id, @PathVariable(value = "skip") int skip, @PathVariable(value = "limit") int limit){
        return projetService.getProbCommentsById(id,-(skip),limit)
                .flatMapMany(projet -> {
                    Collections.reverse(projet.getCommentaires());
                    return Flux.fromIterable(projet.getCommentaires());})
                .concatMap(cmnt ->
                    Mono.just(cmnt)
                            .zipWith(userService.findById(cmnt.getIdUser()), (c,u) -> {
                                User us = new User();
                                us.setIdU(u.getIdU());
                                us.setNom(u.getNom());
                                us.setPrenom(u.getPrenom());
                                us.setGenre(u.getGenre());
                                // nzido hta profession + organisme
                                c.setUser(us);
                                return c;
                            })
                );
    }

    @GetMapping(value = "/getReactions/{id}/{type}")
    public Flux<User> getProbById(@PathVariable(value = "id") String id, @PathVariable(value = "type") boolean type){
        return projetService.getReactByProb(id)
                .flatMapMany(projet -> { if(type && projet.getLikers() == null) projet.setLikers(new ArrayList<>());
                                         if(!type && projet.getDislikers() == null) projet.setDislikers(new ArrayList<>());
                                         return Flux.fromIterable(type ? projet.getLikers() : projet.getDislikers());})
                .flatMap(user -> userService.findById(user.getIdU()));
                    /*Mono.just(cmnt)
                            .zipWith(userService.findById(cmnt.getIdUser()), (c,u) -> {
                                c.setUser(u);
                                return c;
                            })*/
                //);
    }

    @GetMapping("/getComment/{idP}/{idC}")
    public Mono<Commentaire> getCommentByIds(@PathVariable(value = "idP") String idP, @PathVariable(value = "idC") String idC){
        return projetService.getCommentByIds(idP, idC)
                .flatMap(projet -> Mono.just(projet.getCommentaires().get(0)))
                .flatMap(cmnt ->
                    Mono.just(cmnt)
                            .zipWith(userService.findById(cmnt.getIdUser()), (c,u) -> {
                                User us = new User();
                                us.setIdU(u.getIdU());
                                us.setNom(u.getNom());
                                us.setPrenom(u.getPrenom());
                                us.setGenre(u.getGenre());
                                // nzido hta profession + organisme
                                c.setUser(us);
                                return c;
                            })
                );
    }

    @GetMapping("/getDemandesAdhesion/{id}")
    public Flux<User> getDemandesAdhesion(@PathVariable(value = "id") String id){
        return projetService.getDemandesAdhesionByProb(id)
                .flatMapMany(projet -> {
                    if(projet.getDemandesAdhesion() == null) projet.setDemandesAdhesion(new ArrayList<>());
                    //System.out.println(projet.getDemandesAdhesion());
                    return Flux.fromIterable(projet.getDemandesAdhesion());})
                .flatMap(user -> userService.findById(user.getIdU()));
    }

    @GetMapping("/byVisibilityPublic")
    public Flux<Projet> getProjetsByVisibility(@RequestParam(name = "page") int page,
                                               @RequestParam(name = "size") int size){
        return projetService.getByVisibility(page,size);
                /*.map(projet -> {
                    projet.updateCounts();
                    return projet;
                });*/
    }

    @GetMapping("/InfosProjet/{id}")
    Mono<Projet> getInfosProjet(@PathVariable(value = "id") String id,Principal principal){
        return projetService.getById(id)
                .flatMap(p -> {
                    if(p.getIsSubmitted()){
                        return userService.findByEmail(principal.getName())
                                .flatMap(u -> {
                                    // access == true
                                    if((p.getEtat() == 1 && (p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())) || (p.getIdOwner().equals(u.getIdU())) ){
                                        p.updateCounts();
                                        Projet p1 = new Projet();
                                        p1.setIdPrj(p.getIdPrj());
                                        p1.setIdOwner(p.getIdOwner());
                                        p1.setIdDecideur(p.getIdDecideur());
                                        // just id nom prenom
                                        p1.setChef(p.getChef());
                                        //p1.setMembres(p.getMembres());
                                        p1.setCountTaches(p.getCountTaches());
                                        p1.setPourcentageCompleted(p.getPourcentageCompleted());
                                        p1.setCountAccessPrj(p.getCountAccessPrj());
                                        p1.setCountRequestPrj(p.getCountRequestPrj());
                                        p1.setCountAccessPrjAll(p.getCountAccessPrjAll());
                                        p1.setCountRequestPrjAll(p.getCountRequestPrjAll());
                                        p1.setProbDate(p.getProbDate());
                                        p1.setDateDebut(p.getDateDebut());
                                        p1.setDateFin(p.getDateFin());
                                        p1.setDateSoumission(p.getDateSoumission());
                                        p1.setEtat(p.getEtat());
                                        if(!p.getMotifsRefus().equals("")) p1.setMotifsRefus(p.getMotifsRefus());
                                        List<User> users = new ArrayList<>();
                                        //apres nzid hta la profession + organisme
                                        for(User us: p.getMembres()){
                                            User usr = new User();
                                            usr.setIdU(us.getIdU());
                                            usr.setNom(us.getNom());
                                            usr.setPrenom(us.getPrenom());
                                            usr.setRoles(us.getRoles());
                                            users.add(usr);
                                        }
                                        p1.setMembres(users);
                                        return Mono.just(p1);
                                    }
                                    if(p.getIsPrivate()) {
                                        Projet p2 = new Projet();
                                        p2.setIdPrj(p.getIdPrj());
                                        p2.setIsPrivate(true);
                                        return Mono.just(p2);
                                    }
                                    return Mono.just(new Projet());
                                }).defaultIfEmpty(new Projet());
                    }
                    return Mono.just(new Projet());
                });
    }


    @GetMapping("/allProbs")
    public Flux<Projet> getAllProbs(@RequestParam(name = "page") int page,
                                    @RequestParam(name = "size") int size){
        return projetService.getAllProb(page,size)
                .concatMap(prb ->
                    Mono.just(prb)
                            .zipWith(userService.findById(prb.getIdOwner()), (p,u) -> {
                                p.setProbOwner(u);
                                //ajouter hta mentions j aime f all probs
                                p.setCountComments(p.getCommentaires() != null ? p.getCommentaires().size() : 0);
                                p.setCountLikers(p.getLikers() != null ? p.getLikers().size() : 0);
                                p.setCountDislikers(p.getDislikers() != null ? p.getDislikers().size() : 0);
                                return p;
                            })
                );
    }

    @GetMapping("/allSkills")
    public Flux<Skill> getAllSkills() {
        return projetService.getAllSkills();
    }

    //issubmitted + etat == 1
    //les projets en cours ola ghir les complets
    @GetMapping("/recommandedProjets/{id}")
    public Flux<Projet> getProjectsBySkills(@PathVariable(value = "id") String id) {
        return projetService.getById(id)
                .flatMapMany(projet -> {
                    List<String> ids = new ArrayList<>();
                    ids.add(id);
                    for (DemandeAcces d: projet.getDemandesAcces()) {
                        if(d.getIdPrj().equals(id)) ids.add(d.getIdRequestedPrj());
                    }
                    return projetService.getProjetsBySkills(projet.getSkills(), ids).sort((prj1, prj2) ->
                            prj1.sizeIntersection(projet.getSkills()).compareTo(prj2.sizeIntersection(projet.getSkills()))
                    );
                }).collectList().flatMapIterable(projets -> {
                    Collections.reverse(projets);
                    return projets;
                }).map(p -> {
                    p.justIdAndTitle();
                    return p;
                        }
                );
    }

    //active true + !role.contains(role_invited)
    @GetMapping("/recommandedUsers/{id}")
    public Flux<User> getUsersBySkills(@PathVariable(value = "id") String id) {
        return projetService.getProbById(id)
                .flatMapMany(projet -> userService.getBySkills(projet.getSkills(), projet.getIdOwner()).sort((u1, u2) ->
                    u1.sizeIntersection(projet.getSkills()).compareTo(u2.sizeIntersection(projet.getSkills()))
                )).collectList().flatMapIterable(users -> {
                    Collections.reverse(users);
                    return users;
                });
        // faut specifier que les attributs id nom prenom
    }

    @GetMapping("/getAccesPrj/{id}/{type}/{skip}/{limit}")
    Flux<DemandeAcces> getAccessPrjMembres(@PathVariable("id") String id, @PathVariable("type") int type, @PathVariable("skip") int skip,
                                           @PathVariable("limit") int limit, Principal principal){
        return projetService.getById(id)
                .flatMapMany(p -> userService.findByEmail(principal.getName())
                        .flatMapMany(u -> {
                            // || is parivate and access == true
                            if(type == 1 && limit > 0 && (p.getIdOwner().equals(u.getIdU()) || p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())){
                                return projetService.getDemandesAccessById(id,-(skip),limit)
                                        .flatMapMany(p1 -> {
                                            //Collections.reverse(p1.getDemandesAcces());
                                            //System.out.println(p1.getDemandesAcces());
                                            return Flux.fromIterable(p1.getDemandesAcces());
                                        })
                                        .concatMap(d -> Mono.just(d)
                                                .zipWith(projetService.getById(d.getIdRequestedPrj()), (dd,pp) -> {
                                                    Projet projet = new Projet();
                                                    projet.setIdPrj(pp.getIdPrj());
                                                    projet.setProbTitle(pp.getProbTitle());
                                                    dd.setProjet(projet);
                                                    return dd;
                                                })
                                        );
                            }
                            else if(type == 2 && limit > 0 && p.getChef().equals(u)){
                                return projetService.getAllDemandesAccessMembres(id,-(skip),limit)
                                        .flatMapMany(p1 -> {
                                            Collections.reverse(p1.getDemandesAcces());
                                            return Flux.fromIterable(p1.getDemandesAcces());
                                        })
                                        .concatMap(d -> Mono.just(d)
                                                .zipWith(projetService.getById(d.getIdRequestedPrj()), (dd,pp) -> {
                                                    Projet projet = new Projet();
                                                    projet.setIdPrj(pp.getIdPrj());
                                                    projet.setProbTitle(pp.getProbTitle());
                                                    dd.setProjet(projet);
                                                    return dd;
                                                })
                                        );
                            }
                            else if(type == 3 && limit > 0 && p.getChef().equals(u)){
                                return projetService.getAllDemandesAccessRequested(id,-(skip),limit)
                                        .flatMapMany(p1 -> {
                                            Collections.reverse(p1.getDemandesAcces());
                                            return Flux.fromIterable(p1.getDemandesAcces());
                                        })
                                        .concatMap(d -> Mono.just(d)
                                                .zipWith(projetService.getById(d.getIdPrj()), (dd,pp) -> {
                                                    Projet projet = new Projet();
                                                    projet.setIdPrj(pp.getIdPrj());
                                                    projet.setProbTitle(pp.getProbTitle());
                                                    dd.setProjet(projet);
                                                    return dd;
                                                })
                                        );
                            }
                            return  Flux.fromIterable(new ArrayList<>());
                        })
                );
    }

    @GetMapping("/getPrjDeroulement/{id}")
    public Mono<Projet> countPhases(@PathVariable("id") String id, Principal principal){
        return projetService.getById(id)
                .flatMap(p -> userService.findByEmail(principal.getName())
                        .flatMap(u -> {
                            // || is parivate and access == true
                            if((p.getIsSubmitted() && p.getEtat() == 1) && (p.getIdOwner().equals(u.getIdU()) || p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())){
                                p.updateCountPhases();
                                Projet projet = new Projet();
                                projet.setIdPrj(id);
                                projet.setCountPhases(p.getCountPhases());
                                projet.setChef(new User(p.getChef().getIdU(), p.getChef().getNom(), p.getChef().getPrenom(), p.getChef().getGenre()));

                                if(p.getChef().equals(u)) {
                                    List<User> membres = new ArrayList<>();
                                    for(User m : p.getMembres()) {
                                        membres.add(new User(m.getIdU(), m.getNom().toUpperCase() + " " + m.getPrenom(), "", m.getGenre()));
                                    }
                                    membres.add(new User(p.getChef().getIdU(), p.getChef().getNom().toUpperCase() + " " + p.getChef().getPrenom(), "", p.getChef().getGenre()));
                                    projet.setMembres(membres);
                                }
                                return Mono.just(projet);
                            }
                            return Mono.just(new Projet());
                        })
                );
    }

    @GetMapping("/getPhases/{id}/{skip}/{limit}")
    public Flux<Phase> getPhasesByProjet(@PathVariable("id") String id, @PathVariable("skip") int skip, @PathVariable("limit") int limit, Principal principal) {
        return projetService.getById(id)
                .flatMapMany(p -> userService.findByEmail(principal.getName())
                        .flatMapMany(u -> {
                            // || is parivate and access == true
                            if((p.getIsSubmitted() && p.getEtat() == 1) && (p.getIdOwner().equals(u.getIdU()) || p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())){
                                return projetService.getPhasesById(id,-(skip),limit)
                                        .flatMapMany(p1 -> {
                                            Collections.reverse(p1.getPhases());
                                            return Flux.fromIterable(p1.getPhases());
                                        })
                                        .concatMap(ph -> Mono.just(ph)
                                                .map(ph1 -> {
                                                    ph1.setCountTaches(ph1.getTaches().size());
                                                    ph1.setTaches(null);
                                                    return ph1;
                                                })
                                        );
                            }
                            return  Flux.fromIterable(new ArrayList<>());
                        })
                );
    }

    @GetMapping("/allPhases/{id}")
    public Flux<Phase> getAllPhasesByProjet(@PathVariable("id") String id, Principal principal) {
        return projetService.getById(id)
                .flatMapMany(p -> userService.findByEmail(principal.getName())
                        .flatMapMany(u -> {
                            // || is parivate and access == true
                            if((p.getIsSubmitted() && p.getEtat() == 1) && (p.getIdOwner().equals(u.getIdU()) || p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())){
                                return Flux.fromIterable(p.getPhases())
                                        .map(ph -> {
                                            ph.setCountTaches(ph.getTaches().size());
                                            ph.setDescription(null);
                                            ph.setTaches(null);
                                            return ph;
                                        });
                            }
                            return  Flux.fromIterable(new ArrayList<>());
                        })
                );
    }

    @GetMapping("/getTaches/{idP}/{idPh}/{skip}/{limit}")
    public Flux<Tache> getPhasesByProjet(@PathVariable("idP") String idP, @PathVariable("idPh") String idPh, @PathVariable("skip") int skip, @PathVariable("limit") int limit, Principal principal) {
        return projetService.getById(idP)
                .flatMapMany(p -> userService.findByEmail(principal.getName())
                        .flatMapMany(u -> {
                            // || is parivate and access == true
                            if((limit > 0) && (p.getIsSubmitted() && p.getEtat() == 1) && (p.getIdOwner().equals(u.getIdU()) || p.getChef().equals(u) || p.getMembres().contains(u) || !p.getIsPrivate())){
                                return projetService.getTachesByIds(idP, idPh,-(skip),limit)
                                        .flatMapMany(p1 -> {
                                            Collections.reverse(p1.getPhases().get(0).getTaches());
                                            return Flux.fromIterable(p1.getPhases().get(0).getTaches());
                                        })
                                        .concatMap(t -> Mono.just(t)
                                                .zipWith(userService.findById(t.getIdMembre()), (tt,uu) -> {
                                                    User user = new User(uu.getIdU(), uu.getNom(), uu.getPrenom(), uu.getGenre());
                                                    tt.setUser(user);
                                                    Collections.reverse(tt.getModifications());
                                                    return tt;
                                                })
                                        );
                            }
                            return  Flux.fromIterable(new ArrayList<>());
                        })
                );
    }

    @GetMapping("/myPrj")
    public Mono<List<String>> getMyProjects(Principal principal) {
        List<String> prjs = new ArrayList<>();
        return userService.findByEmail(principal.getName())
                .flatMapMany(u -> projetService.getMyPrj(u.getIdU())
                                .filter(p0 -> p0.getEtat() == 1)
                                .map(p -> new String(p.getIdPrj()))
                ).collectList();
    }

    //0.update tache, 1.addTache, 2.remove tache => chef
    //3.addlivrable, 4.updateLivrable => membres
    @PutMapping("/saveTache/{idP}/{idPh}/{type}")
    public Mono<ResponseEntity<?>> saveTache(Principal principal, @PathVariable("idP") String idP, @PathVariable("idPh") String idPh,
                                             @PathVariable("type") int type, @RequestBody Tache tache) {
        return projetService.getById(idP)
                .flatMap(p -> userService.findByEmail(principal.getName())
                        .flatMap(u -> {
                            Phase phase = new Phase(); phase.setIdPhase(idPh);
                            int index = p.getPhases().indexOf(phase);
                            if(index != -1) {
                                if(p.getPhases().get(index).getDateFin() == null) {
                                    //0. update tache
                                    if(p.getChef().equals(u) && type == 0 && index != -1) {
                                        int index1 = p.getPhases().get(index).getTaches().indexOf(tache);
                                        //System.out.println(index1);
                                        if(index1 != -1) {
                                            p.getPhases().get(index).getTaches().get(index1).updateTache(tache);
                                            return projetService.saveProjet(p)
                                                    .flatMap(pp -> {
                                                        //send notif to user (idMembre)
                                                        this.publisher.publishEvent(new ProbEvent("tache-" + idP + "-" + idPh));
                                                        return Mono.just(ResponseEntity.ok("updated"));
                                                    });
                                        }
                                    }
                                    //1. add tache
                                    if(p.getChef().equals(u) && type == 1 && index != -1) {
                                        tache.setRef(new ObjectId().toString());
                                        p.getPhases().get(index).addTache(tache);
                                        return projetService.saveProjet(p)
                                                .flatMap(pp -> {
                                                    //send notif to user (idMembre)
                                                    this.publisher.publishEvent(new ProbEvent("tache-"+idP+"-"+idPh));
                                                    return Mono.just(ResponseEntity.ok("added"));
                                                });
                                    }
                                    //2. remove tache
                                    if(p.getChef().equals(u) && type == 2 && index != -1) {
                                        int index1 = p.getPhases().get(index).getTaches().indexOf(tache);
                                        if(index1 != -1){
                                            p.getPhases().get(index).removeTache(tache);
                                            return projetService.saveProjet(p)
                                                    .flatMap(pp -> {
                                                        this.publisher.publishEvent(new ProbEvent("tache-"+idP+"-"+idPh));
                                                        return Mono.just(ResponseEntity.ok("removed"));
                                                    });
                                        }
                                    }
                                    //3. add livrable
                                    if(u.getIdU().equals(tache.getIdMembre()) && type == 3 && index != -1) {
                                        int index1 = p.getPhases().get(index).getTaches().indexOf(tache);
                                        if(index1 != -1){
                                            p.getPhases().get(index).getTaches().get(index1).addLivrable(tache.getLivrable());
                                            return projetService.saveProjet(p)
                                                    .flatMap(pp -> {
                                                        //send notif to admin
                                                        this.publisher.publishEvent(new ProbEvent("livrable-"+idP+"-"+idPh));
                                                        return Mono.just(ResponseEntity.ok("added"));
                                                    });
                                        }
                                    }
                                    //4. update livrable
                                    if(u.getIdU().equals(tache.getIdMembre()) && type == 4 && index != -1) {
                                        int index1 = p.getPhases().get(index).getTaches().indexOf(tache);
                                        if(index1 != -1){
                                            p.getPhases().get(index).getTaches().get(index1).updateLivrable(tache.getLivrable());
                                            return projetService.saveProjet(p)
                                                    .flatMap(pp -> {
                                                        //send notif to admin
                                                        this.publisher.publishEvent(new ProbEvent("livrable-"+idP+"-"+idPh));
                                                        return Mono.just(ResponseEntity.ok("updated"));
                                                    });
                                        }
                                    }
                                }
                            }

                            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                        })
                );
    }

    @PutMapping("/savePhase/{idP}/{type}")
    public Mono<ResponseEntity<?>> savePhase(Principal  principal, @PathVariable("idP") String idP, @PathVariable("type") int type, @RequestBody Phase phase) {
        return projetService.getById(idP)
                .flatMap(p -> userService.findByEmail(principal.getName())
                        .flatMap(u -> {
                            int index = p.getPhases().indexOf(phase);
                            if(p.getChef().equals(u) && index != -1) {
                                if(type == 0) {
                                    p.removePhase(phase.getIdPhase());
                                    return projetService.saveProjet(p)
                                            .flatMap(pp -> {
                                                this.publisher.publishEvent(new ProbEvent("phase-remove-"+idP));
                                                return Mono.just(ResponseEntity.ok("removed"));
                                            });
                                }
                                else if(type == 1){
                                    p.getPhases().get(index).setTitre(phase.getTitre());
                                    p.getPhases().get(index).setDescription(phase.getDescription());
                                    p.getPhases().get(index).setDateDebut(phase.getDateDebut());
                                    return projetService.saveProjet(p)
                                            .flatMap(pp -> {
                                                this.publisher.publishEvent(new ProbEvent("phase-update-"+idP));
                                                return Mono.just(ResponseEntity.ok("updated"));
                                            });
                                }
                                else if(type == 2 && p.getPhases().get(index).getDateFin() == null){
                                    p.getPhases().get(index).setDateFin(phase.getDateFin());
                                    return projetService.saveProjet(p)
                                            .flatMap(pp -> {
                                                this.publisher.publishEvent(new ProbEvent("phase-update-"+idP));
                                                return Mono.just(ResponseEntity.ok("updated"));
                                            });
                                }
                            }
                            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                        })
                );
    }

    @PostMapping("/addOrUpdate")
    public Mono<ResponseEntity<String>> saveProjet(@RequestBody Projet projet){
        return projetService.saveProjet(projet)
                .map(prj -> ResponseEntity.ok(prj.getIdPrj()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/addProbleme")
    public Mono<ResponseEntity<String>> saveProbleme(@RequestBody Projet projet){
        //System.out.println(projet);
        return projetService.saveProjet(new Projet(projet.getIdOwner(), projet.getProbTitle(), projet.getProbDesc(), projet.getSkills()))
                .map(prj -> {
                    this.publisher.publishEvent(new ProbEvent("prb-"+prj.getIdPrj()));
                    return ResponseEntity.ok(prj.getIdPrj());})
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/updateProbleme")
    public Mono<ResponseEntity<String>> updateProbleme(@RequestBody Projet projet, Principal principal) {
        //System.out.println(projet);
        return projetService.getById(projet.getIdPrj())
                .flatMap(prj -> userService.findByEmail(principal.getName())
                        .flatMap(u -> {
                            if (prj.getIdOwner().equals(u.getIdU()) || (prj.getChef() != null && prj.getChef().getIdU().equals(u.getIdU()))){
                                prj.setProbTitle(projet.getProbTitle());
                                prj.setProbDesc(projet.getProbDesc());
                                prj.setSkills(projet.getSkills());
                                return projetService.saveProjet(prj)
                                        .map(p -> ResponseEntity.ok("updated"));
                            }
                            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                        }));
    }

    @PutMapping("/demanderAccesPrj")
    public Mono<ResponseEntity<?>> demanderAcces(@RequestBody Projet projet, Principal principal) {

        return projetService.getById(projet.getIdPrj())
                .flatMap(p -> userService.findByEmail(principal.getName())
                            .flatMap(user -> {
                                List<DemandeAcces> demandes = new ArrayList<>();
                                if(p.getIsSubmitted() && p.getEtat() == 1 && p.getChef().equals(user)) {
                                    if(projet.getDemandesAcces() != null && projet.getDemandesAcces().size() > 0){
                                        for(DemandeAcces d: projet.getDemandesAcces()) {
                                            DemandeAcces dd = new DemandeAcces(d.getIdPrj(), d.getIdRequestedPrj());
                                            if(!p.getDemandesAcces().contains(dd))    demandes.add(dd);
                                        }
                                        p.addAllDemandeAcces(demandes);
                                    }
                                    return projetService.saveProjet(p)
                                            .flatMap(p1 -> Flux.fromIterable(demandes)
                                                    .parallel().runOn(Schedulers.parallel())
                                                    .flatMap(d -> projetService.getById(d.getIdRequestedPrj())
                                                            .flatMap(p2 -> {
                                                                //System.out.println("demande acces: "+d);
                                                                p2.addDemandeAcces(d);
                                                                return projetService.saveProjet(p2);
                                                            })
                                                            //ntestiw if chef != null sinon unauthorized
                                                            .flatMap(prj1 -> userService.findById(prj1.getChef().getIdU())
                                                                    .flatMap(u -> {
                                                                        String content = "<b>"+u.getNom().toUpperCase()+"&nbsp;"+u.getPrenom()+"</b>&nbsp;chef du projet :&nbsp;<b>"
                                                                                +p1.getProbTitle()+"</b>&nbsp;a demandé l'accès à votre projet :&nbsp;<b>"
                                                                                +prj1.getProbTitle()+"</b>";
                                                                        Notification n = new Notification(8, prj1.getIdPrj(), content);
                                                                        u.addNotification(n);
                                                                        this.publisher.publishEvent(new ProbEvent("notif-"+u.getIdU()+"-"+n.getIdNotif()));
                                                                        return userService.saveUser(u);
                                                                    }).map(us -> {
                                                                        //System.out.println("notify chef Dde acces" + us);
                                                                        Thread email = new EmailConfig("Demande d'accès à votre projet", us.getEmail(),
                                                                                "Bonjour,<br/><br/>Le chef du projet: <u><b>\""+p1.getProbTitle()+"\"</b></u>"+" a demandé l'accès à votre projet: " +
                                                                                        "<u><b>\""+prj1.getProbTitle()+"\"</b></u> , <br/><br/>Veuillez accéder à la plateforme pour décider cette demande.");
                                                                        //email.start();
                                                                        return us;
                                                                    })
                                                            )).sequential().then(Mono.fromCallable(() -> p1))
                                            ).then(Mono.fromCallable(() -> ResponseEntity.ok(demandes.size())));
                                }
                                return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                            }).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build()))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/addPhase/{id}")
    public Mono<ResponseEntity<?>> addPhase(@PathVariable("id") String id ,@RequestBody Phase phase, Principal principal){
        return projetService.getById(id)
                .flatMap(p -> userService.findByEmail(principal.getName())
                        .flatMap(u -> {
                            if(p.getChef().equals(u)) {
                                phase.setIdPhase(new ObjectId().toString());
                                //phase.setDateDebut(new Date());
                                for(Tache tache: phase.getTaches()) {
                                    tache.setRef(new ObjectId().toString());
                                }
                                p.addPhase(phase);
                                return projetService.saveProjet(p)
                                        .flatMap(pp -> {
                                            this.publisher.publishEvent(new ProbEvent("phase-add-"+id));
                                            return Mono.just(ResponseEntity.ok("added"));
                                        });
                            }
                            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                        })
                ).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/deciderDemandeAcces/{dec}")
    public Mono<ResponseEntity<?>> deciderDemandeAcces(@RequestBody DemandeAcces d, @PathVariable("dec") boolean dec, Principal principal) {
        return projetService.getById(d.getIdRequestedPrj())
                .flatMap(p ->  userService.findByEmail(principal.getName())
                                .flatMap(u -> {
                                    if(p.getChef().equals(u)) {
                                        int index = p.getDemandesAcces().indexOf(d);
                                        if(index != -1 && p.getDemandesAcces().get(index).getEtat() == 2){
                                            d.decisionDemande(dec);
                                            p.getDemandesAcces().set(index, d);
                                            return projetService.saveProjet(p)
                                                    .flatMap(p0 -> projetService.getById(d.getIdPrj())
                                                            .flatMap(p1 -> {
                                                                int index1 = p1.getDemandesAcces().indexOf(d);
                                                                if(index1 != -1 && p1.getDemandesAcces().get(index1).getEtat() == 2) {
                                                                    DemandeAcces d1 =p1.getDemandesAcces().get(index1);
                                                                    d1.decisionDemande(dec);
                                                                    p1.getDemandesAcces().set(index1, d1);
                                                                }

                                                                return projetService.saveProjet(p1)
                                                                        .flatMap(p2 -> userService.findById(p2.getChef().getIdU())
                                                                                .flatMap(u1 -> {
                                                                                    String content = "Votre demande d'accès au projet :&nbsp;<b>"+p.getProbTitle()+"</b>&nbsp;est "
                                                                                            +(dec ? "acceptée." : "refusée.");
                                                                                    Notification n = new Notification(dec ? 9 : 10, p2.getIdPrj(), content);
                                                                                    u1.addNotification(n);
                                                                                    this.publisher.publishEvent(new ProbEvent("notif-"+u.getIdU()+"-"+n.getIdNotif()));
                                                                                    return userService.saveUser(u1);
                                                                                }).map(us -> {
                                                                                    this.publisher.publishEvent(new ProbEvent("dcdd-"+p2.getIdPrj()+"-"+dec));
                                                                                    Thread email = new EmailConfig("Décision de votre demande d'accès à un projet", us.getEmail(),
                                                                                            "Bonjour,<br/><br/>Votre demande d'accès au projet :&nbsp;<b>"+p.getProbTitle()+"</b>&nbsp;est "
                                                                                                    +(dec ? "acceptée." : "refusée."));
                                                                                    email.start();
                                                                                    return ResponseEntity.ok("decided");
                                                                                })
                                                                        );
                                                            })
                                                    );
                                        }
                                    }
                                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                })
                                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build()))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    //@PutMapping("/decisionProjet/{idP}/{dec}")
    @GetMapping("/decisionProjet/{idP}/{dec}")
    public Mono<ResponseEntity<?>> deciderProjet(/*Principal principal,*/ @PathVariable(value = "idP") String idP,
                                                 @PathVariable(value = "dec") boolean dec/*, @RequestBody String motifs*/){
        return projetService.getById(idP)
                .flatMap( prj -> {
                    if(prj.getIsSubmitted() && prj.getEtat() == 2) {
                        if(dec){
                            /*return userService.findByEmail(principal.getName())
                                    .flatMap(user -> {
                                        if (user.getIdU().equals(prj.getIdDecideur())) {*/
                                            prj.setEtat(1);
                                            prj.setDateDebut(new Date());
                                            return Flux.fromIterable(prj.getInvitations()).flatMap(inv -> {
                                                String i = inv.toString();
                                                String str = i.substring(0,i.indexOf("@"));
                                                User u = new User(i, str, passwordEncoder.encode(str));
                                                return userService.saveUser(u);
                                            }).map(prj::addMembre).then(Mono.fromCallable(() -> prj))
                                            .flatMap(p -> {
                                                //System.out.println("prj: "+p);
                                                return projetService.saveProjet(p)
                                                        .then(Mono.fromCallable(() -> p));
                                            })/*.flatMap(p1 -> Flux.fromIterable(p1.getDemandesAcces())
                                                    .parallel().runOn(Schedulers.parallel())
                                                    .flatMap(d -> projetService.getById(d.getIdRequestedPrj())
                                                            .flatMap(p -> {
                                                                //System.out.println("demande acces: "+d);
                                                                p.addDemandeAcces(d);
                                                                return projetService.saveProjet(p);
                                                            }).flatMap(prj1 -> userService.findById(prj1.getChef().getIdU())
                                                                    .flatMap(u -> {
                                                                        Notification n = new Notification(8, prj1.getIdPrj(), prj.getProbTitle(), prj.getChef().getIdU());
                                                                        u.addNotification(n);
                                                                        this.publisher.publishEvent(new ProbEvent("notif-"+u.getIdU()+"-"+n.getIdNotif()));
                                                                        return userService.saveUser(u);
                                                                    }).map(us -> {
                                                                    //System.out.println("notify chef Dde acces" + us);
                                                                    Thread email = new EmailConfig("Demande d'accès à votre projet", us.getEmail(),
                                                                            "Bonjour,<br/><br/>Le chef du projet: <u><b>\""+prj.getProbTitle()+"\"</b></u>"+" a demandé l'accès à votre projet: " +
                                                                                    "<u><b>\""+prj1.getProbTitle()+"\"</b></u> , <br/><br/>Veuillez accéder à la plateforme pour décider cette demande.");
                                                                    email.start();
                                                                    return us;
                                                                    })
                                                            )
                                                    ).sequential().then(Mono.fromCallable(() -> p1)) )*/

                                           .flatMap(p2 -> userService.findById(p2.getIdOwner())
                                                    .flatMap(u1 -> {
                                                            Notification n = new Notification(6, p2.getIdPrj(), p2.getProbTitle(), "");
                                                            u1.addNotification(n);
                                                            this.publisher.publishEvent(new ProbEvent("notif-"+u1.getIdU()+"-"+n.getIdNotif()));
                                                            return userService.saveUser(u1);
                                                    }).map(us -> {
                                                            //System.out.println("notify owner" + us);
                                                            Thread email = new EmailConfig("Décision de la commission des projets", us.getEmail(),
                                                                    "Bonjour,<br/><br/>Félicitations, votre projet: <u><b>\""+p2.getProbTitle()+"\"</b></u>"+" est accepté par la commission des projets.");
                                                            //email.start();
                                                            return us;
                                                    }).then(Mono.fromCallable(() -> p2))
                                            ).flatMap(p3 -> userService.findById(p3.getChef().getIdU())
                                                    .flatMap(u2 -> {
                                                        Notification n = new Notification(12, p3.getIdPrj(), "", "");
                                                        u2.addNotification(n);
                                                        this.publisher.publishEvent(new ProbEvent("notif-"+u2.getIdU()+"-"+n.getIdNotif()));
                                                        return userService.saveUser(u2);
                                                    }).map(us -> {
                                                        //System.out.println("notify chef" + us);
                                                        Thread email = new EmailConfig("Invitation à rejoindre un projet (Chef)", us.getEmail(),
                                                                "Bonjour,<br/><br/>Vous êtes désigné comme chef du projet: <u><b>\""+p3.getProbTitle()+"\"</b></u>" +
                                                                        "<br/><br/>Veuillez accéder à la plateforme pour ajouter des phases et attribuer les tâches aux membres.");
                                                        //email.start();
                                                        return us;
                                                    }).then(Mono.fromCallable(() -> p3))
                                            ).flatMap(p4 -> Flux.fromIterable(p4.getMembres())
                                                    .parallel().runOn(Schedulers.parallel())
                                                    .flatMap(m -> userService.findById(m.getIdU())
                                                            .flatMap(u -> {
                                                                //System.out.println("membre : "+u);
                                                                Notification n = new Notification(11, p4.getIdPrj(), "", "");
                                                                u.addNotification(n);
                                                                this.publisher.publishEvent(new ProbEvent("notif-"+u.getIdU()+"-"+n.getIdNotif()));
                                                                return userService.saveUser(u);
                                                            }).map(us -> {
                                                                //System.out.println("notify membre" + us);
                                                                Thread email;
                                                                if(us.getRoles().contains("ROLE_INVITED")) {
                                                                    //khessni nzid hta lien dial plateforme;
                                                                    String str = us.getEmail().substring(0,us.getEmail().indexOf("@"));
                                                                    email = new EmailConfig("Invitation à rejoindre un projet (Membre Externe)", us.getEmail(),
                                                                            "Bonjour,<br/><br/>Vous êtes sélectionné comme membre du projet: <u><b>\"" + p4.getProbTitle() + "\"</b></u>" +
                                                                                    "<br/><br/>Veuillez accéder à la plateforme pour plus de détails." +
                                                                                    "<br/><br/><b>Voici vos informations pour vous connecter à la plateforme</b><br/>" +
                                                                                    "<ul>" +
                                                                                    "  <li><b>Email :</b>&nbsp;"+us.getEmail()+"</li>" +
                                                                                    "  <li><b>Mot de passe :</b>&nbsp;"+str+"</li>" +
                                                                                    "</ul><br/>Vous pouvez aussi modifier votre mot de passe dès que vous accédez à la plateforme.");
                                                                }
                                                                else {
                                                                    //khessni nzid hta lien dial plateforme;
                                                                    email = new EmailConfig("Invitation à rejoindre un projet (Membre)", us.getEmail(),
                                                                            "Bonjour,<br/><br/>Vous êtes sélectionné comme membre du projet: <u><b>\"" + p4.getProbTitle() + "\"</b></u>" +
                                                                                    "<br/><br/>Veuillez accéder à la plateforme pour plus de détails.");
                                                                }
                                                                //email.start();
                                                                return us;
                                                            })
                                                    ).sequential().then(Mono.fromCallable(() -> p4))
                                            ).then(Mono.fromCallable(() -> ResponseEntity.ok("decided")));
                                        /*}
                                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                    }).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());*/
                        }
                        /*else {
                            prj.setEtat(0);
                            prj.setMotifsRefus(motifs);
                            return projetService.saveProjet(prj)
                                    .flatMap(p ->
                                        userService.findById(p.getIdOwner()).flatMap( u -> {
                                            Notification n = new Notification(7, p.getIdPrj(), p.getProbTitle(), "");
                                            u.addNotification(n);
                                            return userService.saveUser(u).map(us -> {
                                                this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                Thread email = new EmailConfig("Décision de la commission des projets", us.getEmail(),
                                                        "Bonjour,<br/><br/> Malheureusement, votre projet: <u><b>\""+p.getProbTitle()+"\"</b></u>"+
                                                                " est refusé par la commission des projets pour les motifs suivants: <br/> <b>"+motifs+"</b>");
                                                //email.start();
                                                return us;
                                            });
                                        })
                                    ).map(userMono -> ResponseEntity.ok("decided"));
                        }*/
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                }).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/soumettrePrj")
    public Mono<ResponseEntity<?>> soumettreProjet(@RequestBody Projet projet, Principal principal) {
        return userService.findByEmail(principal.getName())
                .flatMap(user -> projetService.getById(projet.getIdPrj())
                        .flatMap(prj -> {
                            if(prj.getIdOwner().equals(user.getIdU()) && !prj.getIsSubmitted() && prj.getEtat() == 2){
                                prj.setIsPrivate(projet.getIsPrivate());
                                prj.setChef(projet.getChef());
                                prj.setMembres(projet.getMembres());
                                prj.setInvitations(projet.getInvitations());
                                prj.setIsSubmitted(true);
                                prj.setDateSoumission(new Date());

                                /*List<DemandeAcces> demandes = new ArrayList<>();
                                if(projet.getDemandesAcces() != null && projet.getDemandesAcces().size() > 0){
                                    for(DemandeAcces d: projet.getDemandesAcces()) {
                                        DemandeAcces dd = new DemandeAcces(d.getIdPrj(), d.getIdRequestedPrj());
                                        demandes.add(dd);
                                    }
                                }
                                prj.setDemandesAcces(demandes);*/

                                return projetService.saveProjet(prj)
                                        .flatMap(p -> userService.findAdmin().flatMap(u -> {
                                            Notification n = new Notification(4, p.getIdPrj(), p.getProbTitle(), "");
                                            u.addNotification(n);
                                            return userService.saveUser(u).map(us -> {
                                                System.out.println("*********************");
                                                this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                String complet = (user.getGenre().equals("m") ? "Monsieur " : "Madame ") + user.getNom().toUpperCase() + user.getPrenom();
                                                Thread mail = new EmailConfig("Nouvelle demande de projet", us.getEmail(),
                                                        "Bonjour,<br/><br/>"+complet+"a soumis une demande pour lancer son projet: <u><b>\""+p.getProbTitle()+"\"</b></u>"+
                                                                "<br/><br/>Veuillez accéder à la plateforme pour affecter cette demande à un décideur.");
                                                //mail.start();
                                                return ResponseEntity.ok("soumis");
                                            });
                                        }));
                            }
                            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                        }).defaultIfEmpty(ResponseEntity.notFound().build())
                ).defaultIfEmpty(ResponseEntity.notFound().build());


        /*if(email.equals(principal.getName())) {
            return projetService.getById(projet.getIdPrj())
                    .flatMap(prj -> {
                        if(!prj.getIsSubmitted() && prj.getEtat() == 2){
                            prj.setIsPrivate(projet.getIsPrivate());
                            prj.setChef(projet.getChef());
                            prj.setMembres(projet.getMembres());
                            prj.setInvitations(projet.getInvitations());
                            prj.setIsSubmitted(true);

                            List<DemandeAcces> demandes = new ArrayList<>();
                            if(projet.getDemandesAcces() != null && projet.getDemandesAcces().size() > 0){
                                //System.out.println(projet.getDemandesAcces());
                                for(DemandeAcces d: projet.getDemandesAcces()) {
                                    DemandeAcces dd = new DemandeAcces(d.getIdPrj(), d.getIdRequestedPrj());
                                    demandes.add(dd);
                                }
                            }
                            prj.setDemandesAcces(demandes);
                            // nziid lpublisher bach ytzad fleweel ila kan l admin ...
                            return projetService.saveProjet(prj)
                                    .flatMap(p -> userService.findAdmin().flatMap(u -> {
                                        Notification n = new Notification(0, p.getIdPrj(), "", "");
                                        u.addNotification(n);
                                        return userService.saveUser(u).map(us -> {
                                            this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                            Thread mail = new EmailConfig("Nouvelle demande de projet (à décider)", us.getEmail(),
                                                    "Bonjour,<br/><br/> Vous êtes désigné pour décider la demande du projet: <u><b>\""+p.getProbTitle()+"\"</b></u>"+
                                                            "<br/><br/>Veuillez accéder à la plateforme pour accepter cette demande ou la refuser.");
                                            mail.start();
                                            return ResponseEntity.ok("soumis");
                                        });
                                    }));
                        }
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                    }).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }
        else return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());*/
    }


    @PostMapping("/addSkills")
    public Flux<Skill> saveSkills(@RequestBody List<String> skills) {
        List<Skill> sk = new ArrayList<>();
        for (String s : skills) sk.add(new Skill(s));
        return projetService.saveSkills(sk);
    }

    @PostMapping("/addComment/{id}")
    public Mono<ResponseEntity<String>> addComment(@PathVariable(value = "id") String id , @RequestBody Commentaire commentaire){
        return projetService.getById(id)
                .flatMap(projet -> {
                    //on verifie par l objet Principal si l user est le prop du comment
                    Commentaire c = new Commentaire(commentaire.getIdUser(),commentaire.getComment());
                    projet.addComment(c);
                    //projet.setLikers(null);projet.setDislikers(null);projet.setDemandesAdhesion(null);
                    return projetService.saveProjet(projet)
                            .flatMap(p -> {
                                this.publisher.publishEvent(new ProbEvent("com-"+id+"-"+c.getIdCom()));
                                String idUser = p.getIsSubmitted() && p.getEtat() == 1 ? p.getChef().getIdU() : p.getIdOwner();
                                return userService.findById(idUser)
                                        .flatMap(u-> {
                                            Notification n = new Notification(2, p.getIdPrj(), p.getProbTitle(), "");
                                            u.addNotification(n);
                                            return userService.saveUser(u).map(us -> {
                                                this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                return u;
                                            });
                                        }).then(Mono.fromCallable(() -> p));
                            }).then(Mono.fromCallable(() -> ResponseEntity.ok("added")))
                            .defaultIfEmpty(ResponseEntity.notFound().build());
                });
    }

    @PostMapping("/addReaction/{id}/{react}")
    public Mono<ResponseEntity<String>> addReact(@PathVariable(value = "id") String id ,@PathVariable(value = "react") boolean react ,@RequestBody User user){

        return projetService.getById(id)
                .flatMap(projet -> {
                    if(projet.getDislikers() == null) projet.setDislikers(new ArrayList<>());
                    if(projet.getLikers() == null) projet.setLikers(new ArrayList<>());
                    if(react && !projet.getIdOwner().equals(user.getIdU()) && !projet.getDislikers().contains(user) && !projet.getLikers().contains(user)) {projet.addLiker(user); projet.setReactAdded(true);}
                    else if(!react && !projet.getIdOwner().equals(user.getIdU())  && !projet.getDislikers().contains(user) && !projet.getLikers().contains(user)) {projet.addDisliker(user); projet.setReactAdded(true);}
                    return projetService.saveProjet(projet)
                            .flatMap(prj1 -> {
                                if(prj1.isReactAdded()) {this.publisher.publishEvent(new ProbEvent("react-"+id+"-"+react+"-"+user.getIdU()));
                                                         String idUser = prj1.getIsSubmitted() && prj1.getEtat() == 1 ? prj1.getChef().getIdU() : prj1.getIdOwner();
                                                         return userService.findById(idUser)
                                                                 .flatMap(u-> {
                                                                     Notification n = new Notification(1, prj1.getIdPrj(), prj1.getProbTitle(), "");
                                                                     u.addNotification(n);
                                                                     return userService.saveUser(u).map(us -> {
                                                                         this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                                         return ResponseEntity.ok("added");
                                                                     });
                                                                 });}
                                return Mono.just(ResponseEntity.ok("no"));
                            }).defaultIfEmpty(ResponseEntity.notFound().build());
                }).defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/affectDecideur/{idP}/{idD}")
    public Mono<ResponseEntity<?>> addReact(@PathVariable(value = "idP") String idP ,@PathVariable(value = "idD") String idD ,Principal principal){
        return userService.findByEmail(principal.getName())
                .flatMap(user -> {
                    if(user.getRoles().contains("ROLE_ADMIN")){
                        return userService.findById(idD)
                                .flatMap(u -> {
                                    if(u.getRoles().contains("ROLE_JURY")){
                                        return projetService.getById(idP)
                                                .flatMap(projet -> {
                                                    if(projet.getIsSubmitted() && projet.getEtat() == 2) {
                                                        projet.setIdDecideur(idD);
                                                        projet.setDateAffectation(new Date());
                                                        return projetService.saveProjet(projet)
                                                                .flatMap(p -> {
                                                                    Notification n = new Notification(5, p.getIdPrj(), p.getProbTitle(), "");
                                                                    u.addNotification(n);
                                                                    return userService.saveUser(u).map(us -> {
                                                                        this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                                        Thread email = new EmailConfig("Nouvelle demande de projet (à décider)", us.getEmail(),
                                                                                "Bonjour,<br/><br/> Vous êtes désigné pour décider la demande du projet: <u><b>\""+p.getProbTitle()+"\"</b></u>"+
                                                                                        "<br/><br/>Veuillez accéder à la plateforme pour accepter cette demande ou la refuser.");
                                                                        email.start();
                                                                        return ResponseEntity.ok("affected");
                                                                    });
                                                                });
                                                    }
                                                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                                }).defaultIfEmpty(ResponseEntity.notFound().build());
                                    }
                                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                                }).defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                }).defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/demandeAdhesion/{idP}/{type}")
    public Mono<ResponseEntity<?>> addDemandeAdhesion(@PathVariable(value = "idP") String idP, @PathVariable(value = "type") boolean type, @RequestBody User user){
        //System.out.println(user);
        return projetService.getById(idP)
                .flatMap(projet -> {
                            if (!projet.getIdOwner().equals(user.getIdU())){
                                if(projet.getDemandesAdhesion() == null)    projet.setDemandesAdhesion(new ArrayList<>());
                                if(type && !projet.getDemandesAdhesion().contains(user)) {projet.addDemande(user); projet.setDemandeProcessed(true);}
                                if(!type && projet.getDemandesAdhesion().contains(user)) {projet.removeDemande(user.getIdU()); projet.setDemandeProcessed(true);}

                            }

                            return projetService.saveProjet(projet)
                                    .flatMap(projet1 -> {
                                        if(projet1.isDemandeProcessed()) {
                                            this.publisher.publishEvent(new ProbEvent("adh-" + idP + "-" + type + "-" + user.getIdU()));
                                            String idUser = projet1.getIsSubmitted() && projet1.getEtat() == 1 ? projet1.getChef().getIdU() : projet1.getIdOwner();
                                            return type ?
                                                    (userService.findById(idUser)
                                                    .flatMap(u-> {
                                                        Notification n = new Notification(3, projet1.getIdPrj(), projet1.getProbTitle(), "");
                                                        u.addNotification(n);
                                                        return userService.saveUser(u).map(us -> {
                                                            this.publisher.publishEvent(new ProbEvent("notif-"+us.getIdU()+"-"+n.getIdNotif()));
                                                            return ResponseEntity.ok("added");
                                                        });
                                                    }))
                                                    : Mono.just(ResponseEntity.ok("removed"));
                                        }
                                        return Mono.just(ResponseEntity.ok("not processed"));
                                    }).defaultIfEmpty(ResponseEntity.notFound().build());
                        });
    }

    @PostMapping("/updateVisibility/{id}")
    public Mono<ResponseEntity<String>> updateVisibility(@PathVariable(value = "id") String id,
                                                         @RequestParam(name = "visibility") boolean visibility){
        return projetService.getById(id)
                .flatMap(prj -> { prj.setIsPrivate(visibility);
                                return projetService.saveProjet(prj)
                                        .map(prj1 -> ResponseEntity.ok(prj1.getIdPrj()))
                                        .defaultIfEmpty(ResponseEntity.notFound().build());
                });
    }

    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<String>> deleteProject(@PathVariable(value = "id") String id){
        return projetService.getById(id)
                .flatMap(prj -> projetService.deleteProjet(prj.getIdPrj())
                                    .then(Mono.just(ResponseEntity.ok("deleted"))));
    }
}
