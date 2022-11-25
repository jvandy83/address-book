FROM python:3.9-slim

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV FLASK_RUN_PORT 8000

COPY requirements.txt /usr/src/app/

RUN python3 -m pip install -r requirements.txt

ENTRYPOINT [ "flask" ]

CMD ["run", "--host=0.0.0.0"]
