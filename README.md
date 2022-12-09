# Hotel "Zum goldenen Löwen"

Seminar in Software Engineering 2022W  
Group 09 (Kanban/XP)  
https://sese.youtrack.cloud

## Run the prebuilt application

Link to DockerHub: https://hub.docker.com/r/sese22ws09/lionhotel

1. Download https://github.com/SESEG9/kanbanProject/blob/main/src/main/docker/app.yml
2. Run the following command from the download directory:
   ```sh
   docker compose -f app.yml up
   ```

## Run from source

```sh
docker compose -f src/main/docker/app.yml up
```

## Initial users

| Description           | Username | Password |
|-----------------------|----------|----------|
| Initial administrator | admin    | admin    |
| Test user             | user     | user     |
