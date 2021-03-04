package online.dipa.hub.server.rest;

import online.dipa.hub.api.model.User;
import online.dipa.hub.api.rest.UserApi;
import online.dipa.hub.services.UserInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestApiController
public class UserInformationController implements UserApi {

    @Autowired
    private UserInformationService  userInformationService;

    @Override
    public ResponseEntity<User> getUserData() {
        final User user = userInformationService.getUserData();
        return ResponseEntity.ok(user);
    }
}
