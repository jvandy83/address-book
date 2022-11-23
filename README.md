# Address Book App

## Back-end Python-Flask App

Activate virtual environment:

For bash shell users:

    > source <rootdir>/backend/bin/activate

For fish shell users:

    > source <rootdir>/backend/bin/activate.fish

For csh shell users:

    > source <rootdir>/backend/bin/activate.csh

### Set your shell variables for Flask:

For Bash users:

    export FLASK_APP=app

For Fish users:

    set FLASK_APP app

### Create SQLite tables

Open your python/flask repl:

    > flask shell

Now, after you are in the python repl:

    >>> from db import db
    >>> db.create_all()

Exit the python repl and restart your server with command:

    > flask --app app --debug run

## Front-end React App (CRA)

Install dependencies:

    npm i

Start development server:

    npm start

## Warning, be gentle with this app!!! (LOL)

In order for things to function optimally, please create a full profile for each "contact". I chose the hard way and created multiple tables for a person and an address. Why did I do this? To make myself miserable, apparently.

All fields are optional. I didn't implement any error handling on inputs. But I DO enjoy some input validation, let me tell ya.

I chose to focus on the fun stuff. Things that I thought might set me apparent from a more novice person.

I DID struggle with interpreting cryptic errors in the flask console when building out the backend. And of course, I spent too much time on occasion trying to satisfy the TS compiler. I only used "any" once!!! Because I'm spent now.

This app is responsive down to a tablet. Some mobile views look pretty good.
