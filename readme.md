# **Country Checklist**

## **Description**
Country Checklist is a NodeJS project to help keen travellers track their progress of the countries visited around the world.
http://country-checklist.herokuapp.com/

## **Technologies**
Backend - Nodejs
<br>
Database - MySQL
<br>
Frontend - HTML & CSS, with Bootstrap
<br>
Hosting - Heroku and ClearDB
<br>
Security - JSON Web Token (JWT) to stop user staying logged for longer then 30 minutes. RegEx to ensure Password matches requirements. Bcrypt to hash the passwords.
<br>
Interactive World Map - SimpleMaps

## **Difficulties**
 - SimpleMaps dynamically changing the preloaded settings of each 'state' (country)
    - Solved using jQuery to alter the element on the page and then ajax call to update DB entry
 - Filter and Sort for the List of Countries required some planning for all the different states the list could be in.
 - Authentication with JWT required some research on checking they have authorisation before accessing specific pages.

## **Installation**
 1. npm i (install required packages)
 2. Set environment variables for your database connection, Sequelize should do the rest (creating tables)
 e.g. hostname = "local"

## **Features in Development**
 - Population
 - Flag
 - Continent
 - Land Area