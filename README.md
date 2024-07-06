# Communication Ltd Project

Follow the instructions below to set up the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- SQL Server
- Node.js and npm

## Setting Up the Project

### Step 1: Set Up the SQL Server Database

1. **Create a new database:**
   Name the database `communication_ltd`.
2. **Create the required tables:**
   Open SQL Server Management Studio (SSMS) or any SQL query tool you prefer. Run the following SQL scripts to create the necessary tables:

```sql
-- Create sessions table
CREATE TABLE sessions (
   sid NVARCHAR(255) NOT NULL,
   session NVARCHAR(MAX) NOT NULL,
   expires DATETIME NOT NULL,

   PRIMARY KEY (sid)
);

-- Create users table
CREATE TABLE users (
   uname VARCHAR(100) NOT NULL,
   password VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   created_at DATETIME NOT NULL,
   status VARCHAR(100) NOT NULL,
   otp VARCHAR(100) NULL,
   otp_expire DATETIME NULL,

   PRIMARY KEY (uname, created_at)
);

-- Create customers table
CREATE TABLE customers (
   id VARCHAR(100) NOT NULL,
   full_name NVARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   phone VARCHAR(100) NOT NULL,
   birth_date DATE NOT NULL,
   gender VARCHAR(100) NOT NULL,
   street NVARCHAR(100) NOT NULL,
   city NVARCHAR(100) NOT NULL,
   post_code VARCHAR(100) NOT NULL,
   created_by VARCHAR(100) NOT NULL,

   PRIMARY KEY (id),
   FOREIGN KEY (created_by) REFERENCES users(uname)
);
```

### Step 2: Configure Environment Variables

Create a .env file in the root directory of your project and add the following fields:

```sql
DB_SERVER=<your_sql_server>
DB_DATABASE=communication_ltd
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_PORT=<your_database_port>
SERVER_PORT=<your_server_port>
SESSION_SECRET=<your_session_secret>
GMAIL_USERNAME=<your_gmail_username>
GMAIL_APP_PASSWORD=<your_gmail_app_password>
```

Replace the placeholders with your actual configuration values.
More information on gmail app passwords: https://support.google.com/accounts/answer/185833?hl=en

### Step 3: Install Dependencies

Run the following command in the root directory of your project to install the necessary dependencies:

```
npm install
```

## Running the Project

After setting up the database and configuring the environment variables, you can start the server with the following command:

```
npm start
```

Your server should now be running on the port specified in the .env file (SERVER_PORT).

## Contact

If you have any questions or need further assistance, feel free to contact us at liorzalta24@gmail.com.
