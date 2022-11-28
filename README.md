# Front-end/Back-end React/Python-Flask App

## For Docker development:

1.  Install dependencies:

        > pip install -r requirements.txt

2.  Create SQLite tables

Open your python/flask repl:

    > flask shell

    >>> from db import

    >>> db db.create_all()
    >>> exit()

3.  Build and start docker container:

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
