package online.dipa.hub.mapper;

import org.mapstruct.*;
import online.dipa.hub.api.model.StandardResult;
import online.dipa.hub.persistence.entities.StandardResultEntity;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StandardResultMapper {

//    @BeforeMapping
//    default void setResultStatus(StandardResult standardResult, @MappingTarget StandardResultEntity standardResultEntity) {
//        if (standardResult.getStatus() != null) {
//            standardResultEntity.setStatus(standardResult.getStatus());
//        }
//    }

//    @Mapping(source = "result", target= "content")
   void updateStandardResult(StandardResult standardResult, @MappingTarget StandardResultEntity standardResultEntity);



}

