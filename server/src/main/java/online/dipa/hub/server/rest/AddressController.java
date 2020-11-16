package online.dipa.hub.server.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.model.Adresse;
import online.dipa.hub.api.rest.AdresseApi;

@RestApiController
public class AddressController implements AdresseApi {

    @Override
    public ResponseEntity<List<Adresse>> adresseGet() {
        return ResponseEntity.ok(List.of(new Adresse().ort("München")
                                                      .plz("81111")
                                                      .strasse("EneMene Weg")
                                                      .hausnummer("12"), new Adresse().ort("Hannover")
                                                                                      .plz("11111")
                                                                                      .strasse("Eichen Allee")
                                                                                      .hausnummer("42")));

    }

}
