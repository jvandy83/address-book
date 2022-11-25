# Front-end/Back-end React/Python-Flask App

## For Docker development:

1. Create SQLite tables

Open your python/flask repl:

    > flask shell

    >>> from db import

    >>> db db.create_all()
    >>> exit()

2.  Build and start docker container:

        > docker-compose build
        > docker-compose up

## Development without Docker

### For back-end

Activate virtual environment

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

### For front-end

Install dependencies:

    npm i

Start development server:

    npm start
