resource "azurerm_container_group" "sese-app" {
  name                = "sese-app"
  location            = var.location
  resource_group_name = azurerm_resource_group.sese.name
  ip_address_type     = "Public"
  dns_name_label      = "sese-g09"
  os_type             = "Linux"

  exposed_port {
    port     = 8080
    protocol = "TCP"
  }

  container {
    name   = "lionhotel"
    image  = "sese22ws09/lionhotel:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 8080
      protocol = "TCP"
    }

    environment_variables = {
      _JAVA_OPTIONS                                = "-Xmx512m -Xms256m"
      SPRING_PROFILES_ACTIVE                       = "prod,api-docs"
      MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED = "true"
      SPRING_DATASOURCE_URL                        = local.jdbc_url
      SPRING_DATASOURCE_USERNAME                   = var.db_admin_user
      SPRING_DATASOURCE_PASSWORD                   = var.db_admin_password
      SPRING_LIQUIBASE_URL                         = local.jdbc_url
      SPRING_LIQUIBASE_USER                        = var.db_admin_user
      SPRING_LIQUIBASE_PASSWORD                    = var.db_admin_password
      JHIPSTER_SLEEP                               = 5
      LIONHOTEL_APPLICATION_MAIL_PW                = var.mail_password
    }
  }
/*
  init_container {
    name  = "lionhotel-init"
    image = "sese22ws09/lionhotel:latest"
    environment_variables = {
      _JAVA_OPTIONS                                = "-Xmx512m -Xms256m"
      SPRING_PROFILES_ACTIVE                       = "prod,api-docs"
      MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED = "true"
      SPRING_DATASOURCE_URL                        = local.jdbc_url
      SPRING_DATASOURCE_USERNAME                   = var.db_admin_user
      SPRING_DATASOURCE_PASSWORD                   = var.db_admin_password
      SPRING_LIQUIBASE_URL                         = local.jdbc_url
      SPRING_LIQUIBASE_USER                        = var.db_admin_user
      SPRING_LIQUIBASE_PASSWORD                    = var.db_admin_password
      JHIPSTER_SLEEP                               = 5
      LIONHOTEL_APPLICATION_MAIL_PW                = var.mail_password
    }
  }*/

  depends_on = [azurerm_postgresql_flexible_server.sese]
}
