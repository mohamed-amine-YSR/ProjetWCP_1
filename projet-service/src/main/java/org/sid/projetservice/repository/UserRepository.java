package org.sid.projetservice.repository;

import org.sid.projetservice.model.Skill;
import org.sid.projetservice.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Mono<User> findByEmail(String email);

    Mono<User> findById(String id);

    Flux<User> findUsersByDemande(int demande, Pageable pageable);

    Flux<User> findUsersBySkillsInAndIdUIsNot(List<Skill> skills, String id);

    Flux<User> findUsersByNomLikeIgnoreCaseOrPrenomLikeIgnoreCaseAndActive(String nom, String prenom, boolean active);

    Flux<User> findUsersByNomLikeIgnoreCaseAndActiveAndIdCentreAndRolesNotContainingOrPrenomLikeIgnoreCaseAndActiveAndIdCentreAndRolesNotContaining(
            String nom, boolean active0, String idCentre0, String role0, String prenom, boolean active, String idCentre, String role);

    Flux<User> findUsersByActiveAndIdCentreAndIdUIsNotAndNomLikeIgnoreCase(boolean active,String IdCentre, String id, String nom);

    Flux<User> findUsersByIdCentreAndIdUIsNot(String IdCentre, String idUser, Pageable pageable);

    Mono<Long> countUsersByDemande(int demande);

    Mono<Long> countUsersByIdCentreAndIdUIsNot(String idCentre, String idUser);

    @Query( value = "{ '_id' : ?0}")
    Mono<User> findUserByIdUser(String idU);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'_id':1, 'notifications': {'$slice': [?1,?2]}}")
    Mono<User> findNotificationsById(String id, Integer skip, Integer limit);

    @Query( value = "{ '_id' : ?0}" ,
            fields = "{'notifications': {'$elemMatch': {'idNotif' : ?1}}}")
    Mono<User> findNotificationByIds(String idU, String idN);

    Mono<User> findFirstByRolesIn(List<String> roles);

    Flux<User> findUsersByRolesInAndActive(List<String> roles, boolean active);
}
