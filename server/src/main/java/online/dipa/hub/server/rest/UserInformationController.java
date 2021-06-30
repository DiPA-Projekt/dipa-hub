package online.dipa.hub.server.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.model.User;
import online.dipa.hub.api.rest.UserApi;
import online.dipa.hub.services.UserInformationService;

@RestApiController
public class UserInformationController implements UserApi {

    @Autowired
    private UserInformationService userInformationService;

    @Override
    public ResponseEntity<User> getCurrentUser() {
        final User user = userInformationService.getUserData();
        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<List<User>> getUsers() {
        final List<User> users = userInformationService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<Void> updateUser(final User user) {
        userInformationService.updateUser(user);
        return ResponseEntity.noContent()
                             .build();
    }
}
