# CS-312-MiniProject-3

CS 312 Summer 2025 - Aiden Seay

## Overview

Third addition to the basic blog web application using NodeJS, ExpressJS, EJS, Axios, and Postgres.

## Requirements

- NodeJS
- OpenWeather API Key
- PostgreSQL

### Config File Contents

`config.env` holds the following secret information

```text
OPEN_WEATHER_KEY={API_KEY}
DB_USER={DATABASE_USERNAME}
DB_HOST={DATABASE_HOSTNAME}
DB_NAME={NAME_OF_DATABASE}
DB_PASSWORD={DATABASE_PASSWORD}
DB_PORT={DATABASE_PORT_NUMBER}
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aidengseay/CS-312-MiniProject-2.git
```

2. Create `config.env` file (information above)

3. Start Postgres Server and make a database called `blogDB` containing two tables and their respective columns below: 

| blogs | users |
| :---------: | :-------: |
| blog_id (PK) | user_id (PK) |
| creator_name | password |
| creator_user_id (FK) | name |
| title | | 
| body | | 
| date_created | | 
| category | | 

4. Install NodeJS dependencies

```bash
npm i
```

5. Run the server

```bash
node index.js
```

6. Go to the following below on your browser

```bash
http://localhost:3000
```

## Preview

<img align="center" src=""/>
<p align="center" ><em>Blog Page</em></p>

<img align="center" src=""/>
<p align="center" ><em>Login Page</em></p>

<img align="center" src=""/>
<p align="center" ><em>Sign-Up Page</em></p>

<img align="center" src=""/>
<p align="center" ><em>Account Page</em></p>

## Sources

- [Hashing Password Library (bcrypt)](https://www.npmjs.com/package/bcrypt)

- [Flexbox for Nav Bar](https://www.w3schools.com/css/css3_flexbox.asp)

- [w3schools: For general documentation (JS, HTML, CSS, SQL)](https://www.w3schools.com/)

- [Button Generator from Udemy demo](https://www.bestcssbuttongenerator.com/)

- [Mountain icon created by Freepik - Flaticon](https://www.flaticon.com/free-icons/mountain)
