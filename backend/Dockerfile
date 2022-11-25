FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install -r requirements.txt

ENTRYPOINT [ "flask" ]

CMD ["run", "--host=0.0.0.0"]
