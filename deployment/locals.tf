locals {
  jdbc_url  = "jdbc:postgresql://${azurerm_postgresql_flexible_server.sese.fqdn}:5432/${azurerm_postgresql_flexible_server_database.lionhotel.name}?sslmode=require"
  client_ip = chomp(data.http.client_ip.response_body)
}
