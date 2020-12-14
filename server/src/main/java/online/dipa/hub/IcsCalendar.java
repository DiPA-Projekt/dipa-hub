package online.dipa.hub;

import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.component.VAlarm;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.property.*;
import net.fortuna.ical4j.util.RandomUidGenerator;
import net.fortuna.ical4j.util.UidGenerator;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.GregorianCalendar;


public class IcsCalendar {

    public Calendar calendar;

    private final String PRODUCT_ID = "-//DiPA//www.dipa.online 1.0//DE";

    private final UidGenerator uidGenerator;

    public IcsCalendar() {
        uidGenerator = new RandomUidGenerator();
        calendar = createCalendar();
    }

    public Calendar createCalendar() {
        calendar = new Calendar();
        calendar.getProperties().add(new ProdId(PRODUCT_ID));
        calendar.getProperties().add(Version.VERSION_2_0);
        calendar.getProperties().add(CalScale.GREGORIAN);

        return calendar;
    }

    public void addEvent(TimeZone timezone, LocalDate eventDate, String eventTitle, String eventComment) {

        java.util.Calendar date = getDate(eventDate, timezone);

        VEvent event = createEvent(date, eventTitle, eventComment);
        VTimeZone tz = timezone.getVTimeZone();
        event.getProperties().add(tz.getTimeZoneId());

        VAlarm alarm = new VAlarm(Duration.ofDays(-1)); // remind 1 day before event
        alarm.getProperties().add(Action.DISPLAY);
        event.getAlarms().add(alarm);

        setUid(event);

        calendar.getComponents().add(event);
    }

    public TimeZone createTimezoneEurope() {
        TimeZoneRegistry registry = TimeZoneRegistryFactory.getInstance().createRegistry();
        return registry.getTimeZone("Europe/Berlin");
    }

    public File getCalendarFile(String filename) throws IOException {

        File file = File.createTempFile(filename, ".ics");

        FileOutputStream fout = new FileOutputStream(file);

        CalendarOutputter outputter = new CalendarOutputter();
        outputter.output(calendar, fout);

        return file;
    }

    private VEvent createEvent(java.util.Calendar date, String eventTitle, String eventComment) {

        Date eventDate = new Date(date.getTime());
        VEvent event = new VEvent(eventDate, eventTitle);
        event.getProperties().add(new Description(eventComment));

        return event;
    }

    private java.util.Calendar getDate(LocalDate eventDate, TimeZone timezone) {

        java.util.Calendar date = new GregorianCalendar();
        date.setTimeZone(timezone);
        date.set(java.util.Calendar.MONTH, eventDate.getMonthValue() - 1);
        date.set(java.util.Calendar.DAY_OF_MONTH, eventDate.getDayOfMonth());
        date.set(java.util.Calendar.YEAR, eventDate.getYear());

        return date;
    }

    private void setUid(VEvent event) {
        Uid uid = uidGenerator.generateUid();
        event.getProperties().add(uid);
    }

}
