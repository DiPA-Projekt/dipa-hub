package online.dipa.hub.convert;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import online.dipa.hub.api.model.OrganisationRole;
import online.dipa.hub.persistence.entities.OrganisationRoleEntity;

@Component
public class OrganisationRoleEntityToOrganisationRoleConverter implements Converter<OrganisationRoleEntity, OrganisationRole> {

    @Override
    public OrganisationRole convert(final OrganisationRoleEntity template) {
        
        return new OrganisationRole().id(template.getId())
                             .name(template.getName())
                             .abbreviation(template.getAbbreviation())
                             .permission(OrganisationRole.PermissionEnum.fromValue(template.getPermission()));

    }

}
