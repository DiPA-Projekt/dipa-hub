FROM openjdk:11

RUN adduser --system --group dipa
USER dipa:dipa

ARG JAR_FILE

COPY ${JAR_FILE} dipa-hub.jar

ENTRYPOINT ["java","-jar","/dipa-hub.jar"]