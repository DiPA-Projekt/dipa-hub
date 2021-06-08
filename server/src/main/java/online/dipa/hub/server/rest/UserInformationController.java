package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.User;
import online.dipa.hub.api.rest.UserApi;
import online.dipa.hub.services.UserInformationService;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestApiController
public class UserInformationController implements UserApi {

    @Autowired
    private UserInformationService  userInformationService;

    @Override
    public ResponseEntity<User> getCurrentUser() {
        final User user = userInformationService.getUserData();
        // ResponseEntity.
        if (user != null) {
            return ResponseEntity.ok(user);
        }    
        else {
            return ResponseEntity.status(HttpStatus.SC_FORBIDDEN).body(user);
        }
// return ResponseEntity.ok(user);
            // return ResponseEntity.status(403).body(user);

    }

    @Override
    public ResponseEntity<List<User>> getUsers() {
        final List<User> users= userInformationService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<Void> updateUser(User user) {
        userInformationService.updateUser(user);
        return ResponseEntity.noContent().build();
    }
}
