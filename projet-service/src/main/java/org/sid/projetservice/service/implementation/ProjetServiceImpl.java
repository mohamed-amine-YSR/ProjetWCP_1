package org.sid.projetservice.service.implementation;

import org.sid.projetservice.model.Projet;
import org.sid.projetservice.model.Skill;
import org.sid.projetservice.model.User;
import org.sid.projetservice.repository.ProjetRepository;
import org.sid.projetservice.repository.SkillRepository;
import org.sid.projetservice.service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@Service
public class ProjetServiceImpl implements ProjetService{
    @Autowired
    private ProjetRepository projetRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public Flux<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    @Override
    public Flux<Projet> getProjetsByPage(Integer page, Integer size) {
        return projetRepository.findByIdPrjNotNull(PageRequest.of(page,size));
    }

    @Override
    public Flux<Projet> getByVisibility(Integer page, Integer size) {
        return projetRepository.findAllByVisibility(false,PageRequest.of(page,size));
    }

    @Override
    public Flux<Projet> getAllProb(Integer page, Integer size) {
        return projetRepository.findAllProblems(PageRequest.of(page,size));
    }

    @Override
    public Flux<Projet> getMyPrj(String idU) {
        User user = new User(idU);
        return projetRepository.findProjetsByIdOwnerIsOrChefOrMembresIn(idU, user, Collections.singletonList(user));
    }

    @Override
    public Mono<Projet> getById(String id) {
        return projetRepository.findById(id);
    }

    @Override
    public Mono<Projet> getProbById(String id) {
        return projetRepository.findProbById(id);
    }

    @Override
    public Mono<Projet> getReactByProb(String id) {
        return projetRepository.findReactByProb(id);
    }

    @Override
    public Mono<Projet> getDemandesAdhesionByProb(String id) {
        return projetRepository.findDemandesAdhesionByProb(id);
    }

    @Override
    public Mono<Projet> getProbCommentsById(String id, Integer skip, Integer limit) {
        return projetRepository.findProbCommentsById(id, skip, limit);
    }

    @Override
    public Mono<Projet> getPhasesById(String id, Integer skip, Integer limit) {
        return projetRepository.findPhasesById(id, skip, limit);
    }

    @Override
    public Mono<Projet> getCommentByIds(String idP, String idC) {
        return projetRepository.findCommentByIds(idP, idC);
    }

    @Override
    public Mono<Projet> getTachesByIds(String idP, String idPh, Integer skip, Integer limit) {
        return projetRepository.findTaches(idP, idPh, skip, limit);
    }


    @Override
    public Mono<Projet> getDemandesAccessById(String idP, Integer skip, Integer limit) {
        return projetRepository.findDemandesAccessMembres(idP, skip,limit);
    }

    @Override
    public Mono<Projet> getAllDemandesAccessMembres(String idP, Integer skip, Integer limit) {
        return projetRepository.findAllDemandesAccessMembres(idP, skip, limit);
    }

    @Override
    public Mono<Projet> getAllDemandesAccessRequested(String idP, Integer skip, Integer limit) {
        return projetRepository.findAllDemandesAccessRequested(idP, skip, limit);
    }

    @Override
    public Mono<Projet> saveProjet(Projet projet) {
        return projetRepository.save(projet);
    }

    @Override
    public Mono<Void> deleteProjet(String id) {
        return projetRepository.deleteById(id);
    }

    @Override
    public Mono<Integer> countPublicProjets() {
        return projetRepository.countAllByIsPrivate(false);
    }

    @Override
    public Mono<Long> countAllProbs() {
        return projetRepository.count();
    }

    @Override
    public Flux<Skill> saveSkills(List<Skill> skills) {
        return skillRepository.saveAll(skills);
    }

    @Override
    public Mono<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }

    @Override
    public Flux<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public Flux<Projet> getProjetsBySkills(List<Skill> skills, List<String> ids) {
        return projetRepository.findProjetsBySkillsInAndIdPrjIsNotIn(skills, ids);
    }
}
