Plan de suppression de Spring Security et ses acolytes
1️⃣ Supprimer les fichiers de configuration de sécurité

SecurityConfig.java

Tout fichier Jwt* (JwtUtils, JwtAuthenticationFilter, etc.)

CustomUserDetailsService.java et équivalents

2️⃣ Supprimer les contrôleurs liés à l’authentification

AdminAuthController.java

EmployeeAuthenticationController.java (s’il existe)

Retirer tous les @PreAuthorize dans les contrôleurs (ex : VeterinaireController)

3️⃣ Supprimer les services liés à l’authentification

AdminService.java

EmployeeAuthenticationService.java

Tout service qui fait référence à AuthenticationManager ou PasswordEncoder

4️⃣ Supprimer les DataLoaders d’accounts

AdminAccountDataLoader.java

AccountDataLoader.java

DataInitializer.java (ou tout ce qui ajoute des comptes admin/employee)

Tu n’as plus besoin de BCryptPasswordEncoder, PasswordEncoder, ni de rôles ROLE_*.

5️⃣ Supprimer les dépendances Maven/Gradle

Dans pom.xml ou build.gradle, supprimer :

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
</dependency>

6️⃣ Corriger les injections restantes

Vérifie que aucun service ne fait référence à PasswordEncoder, AuthenticationManager ou JWT.

Si un constructeur/service a ces références, supprime-les ou refactorise pour qu’il n’y ait aucune injection de sécurité.

7️⃣ Corriger le CORS / WebConfig

Si tu avais CorsConfigurationSource ou WebMvcConfigurer dans SecurityConfig, tu peux créer un simple WebConfig minimal pour le front :

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://lyjoyce.github.io")
                        .allowedMethods("*");
            }
        };
    }
}

8️⃣ Nettoyage final

Vérifie que tous les contrôleurs et services fonctionnent sans injection de Spring Security.

Teste avec curl ou Postman : tous les endpoints doivent répondre sans 403.

Les entités Ticket, Adult, Ateliers, Egg, etc. doivent continuer à s’insérer en base.