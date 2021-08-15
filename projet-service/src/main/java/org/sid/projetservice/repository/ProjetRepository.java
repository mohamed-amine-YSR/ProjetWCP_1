package org.sid.projetservice.repository;

import org.sid.projetservice.model.Commentaire;
import org.sid.projetservice.model.Projet;
import org.sid.projetservice.model.Skill;
import org.sid.projetservice.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Repository
public interface ProjetRepository extends ReactiveMongoRepository<Projet, String> {

    Flux<Projet> findByIdPrjNotNull(Pageable pageable);

    @Query( value = "{ 'isPrivate' : ?0}" ,
            fields = "{'_id':1, 'titre':1, 'chef':1, 'dateDebut':1, 'phases.titre':1, 'phases.taches.nomTache':1, 'phases.taches.dateRemise':1, 'membres.refM':1 }",
            sort = "{'dateDebut':-1}")
    Flux<Projet> findAllByVisibility(boolean visibility,Pageable pageable);

    @Query( value = "{}" ,
            fields = "{'_id':1, 'idOwner':1, 'probTitle':1, 'probDate':1, 'skills':1, 'likers':1, 'dislikers':1, 'commentaires.IdCom':1}",
            sort = "{'probDate':-1}")
    Flux<Projet> findAllProblems(Pageable pageable);

    Mono<Integer> countAllByIsPrivate(boolean visibility);

    //and issubmitted and etat == 1
    Flux<Projet> findProjetsBySkillsInAndIdPrjIsNotIn(List<Skill> skillList, List<String> ids);

    Flux<Projet> findProjetsByIdOwnerIsOrChefOrMembresIn(String idOwner,User chef, List<User> membres);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'idOwner':1, 'probTitle':1, 'probDesc':1, 'probDate':1, 'skills':1, 'likers':1, 'dislikers':1, " +
                    "'commentaires.IdCom':1, 'demandesAdhesion':1, 'isPrivate':1, 'isSubmitted':1, 'etat':1}")
    Mono<Projet> findProbById(String id);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'likers':1, 'dislikers':1}")
    Mono<Projet> findReactByProb(String id);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'demandesAdhesion':1}")
    Mono<Projet> findDemandesAdhesionByProb(String id);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'commentaires': {'$slice': [    ?1  ,   ?2  ]}}")
    Mono<Projet> findProbCommentsById(String id, Integer skip, Integer limit);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'phases': {'$slice': [    ?1  ,   ?2  ]}}")
    Mono<Projet> findPhasesById(String id, Integer skip, Integer limit);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'commentaires': {'$elemMatch': {'IdCom' : ?1}}}")
    Mono<Projet> findCommentByIds(String idP, String idC);


    @Aggregation({
            "{$match : {'_id' : ?0, 'phases.idPhase' : ?1}}",
            "{$addFields: {'phases': {" +
                    "$map: {input: '$phases',as: 'ph'," +
                    "in: {'idPhase': '$$ph.idPhase'," +
                    "'taches': { $slice: ['$$ph.taches',    ?#{[2]} ,    ?#{[3]}    ] }" +
                "}}}}}",
            "{$project: {'phases': {" +
                    "$filter: {input: '$phases',as: 'p'," +
                    "cond: { $eq: ['$$p.idPhase',   '?1'    ] }" +
                    "}}}}"
    })
    Mono<Projet> findTaches(String idP ,String idPh ,Integer skip, Integer limit);

    /*@Aggregation({
            "{$match : {'_id' : ?0}}",
            "{$unwind: '$demandesAcces'}",
            "{$sort: {'demandesAcces.dateDecision': -1}}",
            "{$group: {_id: '$_id', 'demandesAcces': {$push: '$demandesAcces'}}}",
            "{$project : { _id : 1, 'demandesAcces': {'$slice': [{$filter:{" +
                    "input: '$demandesAcces',as: 'd',cond: {$and :[{$eq: ['$$d.etat',1]},{$eq: ['$$d.idPrj' , '?0' ]}]}" +
                    "}},    ?#{[1]} ,    ?#{[2]}    ]}" +
                    "}}}"
    })*/
    @Aggregation({
            "{$match : {'_id' : ?0}}",
            "{$project : { _id : 1, 'demandesAcces': {'$slice': [{$filter:{" +
                    "input: '$demandesAcces',as: 'd',cond: {$and :[{$eq: ['$$d.etat',1]},{$eq: ['$$d.idPrj' , '?0' ]}]}" +
                    "}},    ?#{[1]} ,    ?#{[2]}    ]}" +
                    "}}}"
    })
    Mono<Projet> findDemandesAccessMembres(String idP ,Integer skip, Integer limit);

    @Aggregation({
            "{$match : {'_id' : ?0}}",
            "{$project : { _id : 1, 'demandesAcces': {'$slice': [{$filter:{" +
                    "input: '$demandesAcces',as: 'd',cond: {$eq: ['$$d.idPrj' , '?0' ]}" +
                    "}},    ?#{[1]} ,    ?#{[2]}    ]}" +
                    "}}}"
    })
    Mono<Projet> findAllDemandesAccessMembres(String idP ,Integer skip, Integer limit);

    @Aggregation({
            "{$match : {'_id' : ?0}}",
            "{$project : { _id : 1, 'demandesAcces': {'$slice': [{$filter:{" +
                    "input: '$demandesAcces',as: 'd',cond: {$eq: ['$$d.idRequestedPrj' , '?0' ]}" +
                    "}},    ?#{[1]} ,    ?#{[2]}    ]}" +
                    "}}}"
    })
    Mono<Projet> findAllDemandesAccessRequested(String idP ,Integer skip, Integer limit);

}
