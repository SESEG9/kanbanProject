terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.37.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "sese" {
  name     = "SeminarSE"
  location = "West Europe"
}

data "http" "client_ip" {
  url = "http://ipv4.icanhazip.com"
}
