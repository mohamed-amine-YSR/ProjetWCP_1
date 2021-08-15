package org.sid.projetservice.config;

import org.sid.projetservice.Security.AuthenticationManager;
import org.sid.projetservice.Security.SecurityContextRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
//@Configuration
public class WebSecurityConfig {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @Bean
    public SecurityWebFilterChain securitygWebFilterChain(ServerHttpSecurity http) {
        return http
                .exceptionHandling()
                .authenticationEntryPoint((swe, e) -> Mono.fromRunnable(() -> {
                    swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                })).accessDeniedHandler((swe, e) -> Mono.fromRunnable(() -> {
                    swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                })).and()
                //.cors().disable()
                //.cors().and().headers().frameOptions().disable().and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authenticationManager(authenticationManager)
                .securityContextRepository(securityContextRepository)
                .authorizeExchange()
                .pathMatchers(HttpMethod.OPTIONS).permitAll()
                .pathMatchers("/login", "/", "/index.html", "/*.js", "/*.js.map", "/*.eot", "/*.svg", "/*.ttf", "/*.ttf", "/*.woff", "/*.woff2", "/*.png", "/*.otf", "/*.ico","/assets/**", "/styles*.*", "/app/**",
                        "/validateToken", "/userdetails", "/projet/allProbs", "/projet/getComments/**","/projet/getComment/**", "/projet/addComment/**" ,
                        "/projet/getProb/**", "/projet/addReaction/**", "/projet/countProbs", "/projet/getSkills/**", "/ws/prob/**", "/user/filterMembres", "/projet/allSkills",
                        "/projet/addSkills", "/user/addUserInsc").permitAll()
                .anyExchange().authenticated()
                .and().build(); // eliminer /** route ==> new config to adapt angular routes
    }



}
