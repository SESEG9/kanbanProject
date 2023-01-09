resource "azurerm_postgresql_flexible_server" "sese" {
  name                = "sese"
  resource_group_name = azurerm_resource_group.sese.name
  location            = var.location
  version             = "14"

  administrator_login    = var.db_admin_user
  administrator_password = var.db_admin_password

  storage_mb = 32768
  sku_name   = "B_Standard_B1ms"

  lifecycle {
    ignore_changes = [zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "lionhotel" {
  name      = "lionhotel"
  server_id = azurerm_postgresql_flexible_server.sese.id
  collation = "de_AT.utf8"
  charset   = "utf8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow-client" {
  name             = "allow-client"
  server_id        = azurerm_postgresql_flexible_server.sese.id
  start_ip_address = local.client_ip
  end_ip_address   = local.client_ip
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow-azure" {
  name             = "allow-azure"
  server_id        = azurerm_postgresql_flexible_server.sese.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
