# NoxioAuth

**Authentication & Hub Server for Noxio Multiplayer Game**

## Overview

NoxioAuth is the authentication and central hub server for the Noxio multiplayer game platform. It handles user registration, login, account management, game lobbies, leaderboards, and player statistics.

## Credits

**Original Creator:** [InfernoPlus](https://github.com/InfernoPlus)

This is a community-maintained fork of the original Noxio game server. All credit for the original implementation goes to InfernoPlus. This fork is maintained by the community to continue development and support.

## Features

- User authentication and account management
- Game lobby system (custom and official lobbies)
- Global leaderboards and player statistics
- Real-time WebSocket communication
- Payment/transaction processing
- Email notifications (password reset, verification)
- Admin panel for user management

## Tech Stack

- **Backend:** Java 8, Spring Framework 4.3.5, Spring Boot 2.0.0
- **Server:** Apache Tomcat 9
- **Database:** MySQL 5.7
- **Frontend:** Vanilla JavaScript, jQuery 3.1.1
- **Real-time:** Spring WebSocket

## Project Structure

```
noxioauth-core/          # Core web application
├── src/main/java/       # Java configuration classes
├── src/main/webapp/     # Frontend assets (HTML, JS, CSS)
└── src/main/resources/  # Configuration files

noxioauth-module/        # Authentication module
└── auth/                # Authentication logic and controllers

sql/                     # Database schema
└── 20xx-database.sql    # MySQL database initialization
```

## Setup

### Prerequisites

- Java 8 JDK
- Maven 3.x
- MySQL 5.7

### Configuration

1. Copy `noxio.properties.example` to `noxio.properties`:
   ```bash
   cp noxioauth-core/src/main/resources/noxio.properties.example \
      noxioauth-core/src/main/resources/noxio.properties
   ```

2. Edit `noxio.properties` with your settings:
   - Database credentials
   - SMTP server details (for email)
   - Payment gateway credentials (if using)
   - Game server addresses

3. Initialize the database:
   ```bash
   mysql -u root -p < sql/20xx-database.sql
   ```

### Build

```bash
mvn clean package -DskipTests
```

This generates `noxioauth-core/target/NoxioAuth-1.0.war`

### Run (Development)

```bash
cd noxioauth-core
mvn spring-boot:run
```

Access at: `http://localhost:8080/nxc/`

## Deployment

The WAR file can be deployed to:
- Standalone Tomcat 9 server
- Docker container (see deployment docs)
- Cloud platforms (AWS Elastic Beanstalk, Azure App Service, etc.)

## Database Schema

- `USERS` - User accounts and profiles
- `SETTINGS` - Per-user game settings
- `STATS` - Player statistics and achievements
- `UNLOCKS` - Achievement/unlock tracking
- `TRANSACTIONS` - Payment history

## API Endpoints

- `/nxc/` - Main hub interface
- `/nxc/status` - Health check endpoint
- WebSocket endpoint for real-time communication

## Security Notes

**IMPORTANT:** Never commit these files:
- `noxio.properties` - Contains database passwords and API keys
- `*.war` files - Contains embedded configuration
- `.env` files - Environment variables with secrets

See `.gitignore` for complete list.

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Test thoroughly
4. Create a pull request to `main`

## License

[Your License Here]

## Related Repositories

- [NoxioGame](../NoxioGame) - Game server
- [NoxioAsset](../NoxioAsset) - Asset conversion tools
