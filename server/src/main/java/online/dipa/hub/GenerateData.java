package online.dipa.hub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import online.dipa.hub.services.TimelineService;

@Component
public class GenerateData implements CommandLineRunner{

    @Autowired
    TimelineService timelineService;


	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub

        timelineService.initializeTimelines();
		
	}

}
