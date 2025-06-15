# PH Site Viewer

A comprehensive admin dashboard application featuring embedded Looker Studio visualizations with role-based access control and multi-entity support.

## 📋 Overview

PH Site Viewer is a Single Page Application (SPA) designed as an administrative dashboard for companies. It provides secure access to data visualizations through embedded Looker Studio reports with a sophisticated permission system that supports multiple organizational entities.

## ✨ Features

- **🔐 Authentication System**: Complete login and registration functionality
- **📊 Embedded Analytics**: Access to Looker Studio visualizations through secure iframes
- **🌓 Theme Support**: Light and dark mode toggle for enhanced user experience
- **📱 Single Page Application**: Seamless navigation between different report views
- **👥 Employee Management**: Employee listing viewer and team member checker
- **📤 Data Export**: Export functionality for team member data
- **🔒 Role-Based Access Control**: 10-tier permission system with entity-specific roles
- **🏢 Multi-Entity Support**: Separate role management for BPS and LHI entities

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP
- **Database**: MySQL
- **Admin Interface**: phpMyAdmin
- **Server Environment**: XAMPP

## 🎯 User Roles & Permissions

The application supports a comprehensive 10-level role system:

| Role ID | Role Name | Description |
|---------|-----------|-------------|
| 1 | Super User | Full system access |
| 2 | Manager | Management-level access |
| 3 | Admin | Administrative access |
| 4 | User | Standard user access |
| 5 | LHI Admin | LHI entity administrator |
| 6 | LHI Manager | LHI entity manager |
| 7 | LHI User | LHI entity standard user |
| 8 | BPS Admin | BPS entity administrator |
| 9 | BPS Manager | BPS entity manager |
| 10 | BPS User | BPS entity standard user |

## 🚀 Access & Deployment

The application is deployed and accessible via server IP address. No local installation is required for end users.

**Access Method**: Direct server IP access through web browser

## 📋 Prerequisites

No special prerequisites are required. Users can access the application directly through their web browser using the provided server local IP address.

## 🤝 Contributing

We welcome feedback and suggestions to improve the project! Please share your ideas and recommendations to help enhance the dashboard's functionality and user experience.

## 📄 License

All Rights Reserved

## 🏗️ Architecture

This application follows a traditional web architecture pattern:
- **Frontend**: Responsive SPA design with vanilla JavaScript
- **Backend**: PHP-based server-side logic
- **Database**: MySQL for user management and application data
- **Integration**: Embedded Looker Studio for data visualization

## 🔧 Key Components

- **Authentication Module**: Secure login/registration system
- **Dashboard Interface**: Multi-view SPA for different reports
- **Role Management**: Entity-based permission control
- **Data Visualization**: Embedded Looker Studio integration
- **Export Functionality**: Team member data export capabilities
- **Theme System**: Dynamic light/dark mode switching

---

*For access to the dashboard, please contact your system administrator for the server IP address*
