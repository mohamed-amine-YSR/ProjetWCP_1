package org.sid.projetservice.service;

import org.sid.projetservice.model.Projet;
import org.sid.projetservice.model.Skill;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ProjetService {
    Flux<Projet> getAllProjets();

    Flux<Projet> getProjetsByPage(Integer page, Integer size);

    Flux<Projet> getByVisibility(Integer page, Integer size);

    Flux<Projet> getAllProb(Integer page, Integer size);

    Flux<Projet> getMyPrj(String idU);

    Mono<Projet> getById(String id);

    Mono<Projet> getProbById(String id);

    Mono<Projet> getReactByProb(String id);

    Mono<Projet> getDemandesAdhesionByProb(String id);

    Mono<Projet> getProbCommentsById(String id, Integer skip, Integer limit);

    Mono<Projet> getPhasesById(String id, Integer skip, Integer limit);

    Mono<Projet> getCommentByIds(String idP, String idC);

    Mono<Projet> getTachesByIds(String idP, String idPh, Integer skip, Integer limit);

    Mono<Projet> getDemandesAccessById(String idP, Integer skip, Integer limit);

    Mono<Projet> getAllDemandesAccessMembres(String idP, Integer skip, Integer limit);

    Mono<Projet> getAllDemandesAccessRequested(String idP, Integer skip, Integer limit);

    Mono<Projet> saveProjet(Projet projet);

    Mono<Void> deleteProjet(String id);

    Mono<Integer> countPublicProjets();

    Mono<Long> countAllProbs();

    Flux<Skill> saveSkills(List<Skill> skills);

    Mono<Skill> getSkillById(String id);

    Flux<Skill> getAllSkills();

    Flux<Projet> getProjetsBySkills(List<Skill> skills, List<String> ids);
}
