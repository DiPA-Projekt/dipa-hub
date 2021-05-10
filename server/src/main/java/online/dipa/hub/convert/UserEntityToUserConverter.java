package online.dipa.hub.convert;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.User;
import online.dipa.hub.api.model.OrganisationRole;
import online.dipa.hub.api.model.ProjectRole;
import online.dipa.hub.persistence.entities.UserEntity;

@Component
public class UserEntityToUserConverter implements Converter<UserEntity, User> {

    @Autowired
    protected ProjectRoleEntityToProjectConverter projectRoleConverter;

    @Autowired
    protected OrganisationRoleEntityToOrganisationRoleConverter organisationRoleConverter;


    @Override
    public User convert(final UserEntity template) {

        List<ProjectRole> projectRoles = template.getProjectRoles().stream()
        .map(r -> projectRoleConverter.convert(r)).collect(Collectors.toList());

        List<OrganisationRole> organisationRoles = template.getOrganisationRoles().stream()
        .map(r -> organisationRoleConverter.convert(r)).collect(Collectors.toList());


        return new User().id(template.getId())
                        .name(template.getName())
                        .email(template.getEmail())
                        .organisationRoles(organisationRoles)
                        .projectRoles(projectRoles);
    }

}
