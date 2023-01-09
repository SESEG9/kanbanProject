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
| --------------------- | -------- | -------- |
| Initial administrator | admin    | admin    |
| Test user             | user     | user     |

## Deployment

The live deployment setup is implemented using Azure CLI and Terraform.
It creates a database server and a container instance of our app in the Microsoft Azure cloud.

Note: The following commands should be executed from the `deployment` directory.

### Initial setup

1. Install Azure CLI (https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
2. Login on Azure CLI: `az login`
3. Install Terraform (https://developer.hashicorp.com/terraform/downloads?product_intent=terraform)
4. Set necessary environment variables, see `deployment/variables.tf` and `deployment/set_env_vars.example.bat`
5. Initialize Terraform: `terraform init` (--> creates `.terraform.lock.hcl`)

### Deploy or update the setup

```sh
terraform apply
```

--> Creates `terraform.tfstate`, which stores the last known state locally and allows Terraform to detect outside changes.

`*.tfstate` files should not be committed, as they contain sensitive values (usernames, passwords).

### Remove the cloud resources

```sh
terraform destroy
```
