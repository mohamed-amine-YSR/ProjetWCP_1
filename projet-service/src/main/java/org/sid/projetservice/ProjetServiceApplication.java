package org.sid.projetservice;

import org.sid.projetservice.Security.PBKDF2Encoder;
import org.sid.projetservice.model.User;
import org.sid.projetservice.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.time.LocalDateTime;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@SpringBootApplication
@Controller
//@EnableWebFlux
//@EnableScheduling
public class ProjetServiceApplication {
    // @Autowired
    // private PBKDF2Encoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(ProjetServiceApplication.class, args);
    }


    //@Scheduled(cron = "0/20 * * * * ?")
    /*public void publish() {
        System.out.println("task : " + LocalDateTime.now());
    }*/

    @Bean
    RouterFunction<ServerResponse> staticResourceRouter() {
        return RouterFunctions.resources("/**", new ClassPathResource("static/"));
    }

    @Bean
    RouterFunction<ServerResponse> indexHTML(@Value("classpath:/static/index.html") final Resource index) {
        return route(GET("/"), request -> ok().contentType(MediaType.TEXT_HTML).syncBody(index));
    }

    @Bean
    RouterFunction<ServerResponse> indexHTML1(@Value("classpath:/static/index.html") final Resource index) {
        return route(GET("/app/**"), request -> ok().contentType(MediaType.TEXT_HTML).syncBody(index));
    }


    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/app/**")
    public String app() {
        return "index";
    }

    @Bean
    CommandLineRunner start(UserRepository ur, ProjetRepository pr){
        return args -> {
            //email:password -> user@gmail.com:user
            /*for(int i=1; i<=10; i++) {
                User user = new User("user"+i, "user"+i, "m", "user"+i+"@gmail.com", passwordEncoder.encode("user"+i), true, Arrays.asList("ROLE_USER"));
                User admin = new User("admin"+i, "admin"+i, "m", "admin"+i+"@gmail.com", passwordEncoder.encode("admin"+i), true, Arrays.asList("ROLE_ADMIN"));
                ur.save(user).subscribe();
                ur.save(admin).subscribe();
            }
            //email:password -> admin@gmail.com:admin
            User admin = new User("admin", "admin", "f", "admin@gmail.com", "dQNjUIMorJb8Ubj2+wVGYp6eAeYkdekqAcnYp+aRq5w=", true, Arrays.asList("ROLE_ADMIN"));
            ur.deleteAll().subscribe(null, null,() -> {
                ur.saveAll(Arrays.asList(user,admin)).subscribe();
            });*/
            //pr.deleteAll().subscribe();
            /*Membre m1 = new Membre("mem1","membre 1");
            Membre m2 = new Membre("mem2","membre 2");
            Membre m3 = new Membre("mem3","membre 3");

            //mr.saveAll(Arrays.asList(m1,m2,m3)).subscribe();

            Skill s1 = new Skill("s1","Skill 1");
            Skill s2 = new Skill("s2","Skill 2");
            Skill s3 = new Skill("s3","Skill 3");
            Skill s4 = new Skill("s4","Skill 4");
            Skill s5 = new Skill("s5","Skill 5");
            Skill s6 = new Skill("s6","Skill 6");
            Skill s7 = new Skill("s7","Skill 7");
            Skill s8 = new Skill("s8","Skill 8");
            Skill s9 = new Skill("s9","Skill 9");
            Skill s10 = new Skill("s10","Skill 10");
            Skill s11 = new Skill("s11","Skill 11");
            Skill s12 = new Skill("s12","Skill 12");
            Skill s13 = new Skill("s13","Skill 13");
            Skill s14 = new Skill("s14","Skill 14");
            Skill s15 = new Skill("s15","Skill 15");
            //sr.saveAll(Arrays.asList(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15)).subscribe();

            Discipline d1 = new Discipline("d1","Discipline 1", Arrays.asList(s1,s8,s6,s11,s5,s10));
            Discipline d2 = new Discipline("d2","Discipline 2", Arrays.asList(s4,s13,s9,s7,s14));
            Discipline d3 = new Discipline("d3","Discipline 3", Arrays.asList(s12,s2,s15,s3,s5));
            //dr.saveAll(Arrays.asList(d1,d2,d3)).subscribe();

            Tache t11 = new Tache("tache 11",m1,new Date());
            Tache t12 = new Tache("tache 12",m2,null);
            Tache t13 = new Tache("tache 13",m2,null);
            Tache t21 = new Tache("tache 21",m1,new Date());
            Tache t22 = new Tache("tache 22",m3,new Date());
            Tache t23 = new Tache("tache 23",m3,null);
            Tache t24 = new Tache("tache 24",m1,null);
            Tache t25 = new Tache("tache 25",m3,null);
            Tache t31 = new Tache("tache 31",m3,new Date());
            Tache t32 = new Tache("tache 32",m3,null);

            Phase ph1 = new Phase("Phase 1","description phase 1", new Date(), null, Arrays.asList(t11,t12,t13));
            Phase ph2 = new Phase("Phase 2","description phase 2", new Date(), null, Arrays.asList(t21,t22,t23,t24,t25));
            Phase ph3 = new Phase("Phase 3","description phase 3", new Date(), null, Arrays.asList(t31,t32));

            Projet prj1 = new Projet("testProjet1", "DescriptionProjet1",false,Arrays.asList(ph1,ph2),new Date(),null,m1,
                    Arrays.asList(m2,m3), Arrays.asList(s1,s11,s5), d1);
            Projet prj2 = new Projet("testProjet2", "DescriptionProjet2",true,Arrays.asList(ph1,ph2),new Date(),null,m2,
                    Arrays.asList(m1,m3), Arrays.asList(s13,s4,s14), d2);
            Projet prj3 = new Projet("testProjet3", "DescriptionProjet3",false,Arrays.asList(ph1,ph2,ph3),new Date(),null,m2,
                    Arrays.asList(m1,m3), Arrays.asList(s2,s12,s15), d3);
            pr.saveAll(Arrays.asList(prj1,prj2,prj3)).subscribe();
             */

            /*dr.findAll().forEach(System.out::println);
            sr.findAll().forEach(System.out::println);
            pr.findAll().forEach(System.out::println);*/
        };
    }
}
