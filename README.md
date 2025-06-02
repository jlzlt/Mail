# Mail

This is a single-page web application that mimics basic email functionality. Users can send and receive emails, view mailboxes (Inbox, Sent, Archive), archive and unarchive messages, and reply to received emails.

![Screenshot](/mail/static/mail/screenshot.png)

## Features

- View mailboxes (Inbox, Sent, Archived)

- Compose and send emails

- Read full email content

- Archive and unarchive emails

- Reply to messages with prefilled fields

- Fully asynchronous SPA (Single Page Application) behavior using JavaScript

## Installation Guide

### 1.) Prerequisites
Make sure you have the following installed:

• Python 3.10+ (https://www.python.org/downloads/)  
• pip (comes with Python)  
• Git (https://git-scm.com/downloads)  

### 2.) Clone the Repository
Open a terminal and run:  

`git clone https://github.com/jlzlt/Mail.git`  
`cd Mail`

### 3.) Install Dependencies

`pip install django`

### 4.) Run migrations

`python manage.py migrate`

### 5.) Run the server

`python manage.py runserver`

### 6.) Open in browser

Go to `http://127.0.0.1:8000/` and log in or register to start using Mail.

## Tech Stack

• Python (Django) – Backend framework  
• JavaScript – Frontend interactivity  
• HTML & CSS – Page structure and styling  
• SQLite – Default development database (via Django ORM)  
• Fetch API – For AJAX requests  
