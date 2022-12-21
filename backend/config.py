
from os import environ, path, getenv

from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))

load_dotenv(path.join(basedir, '.env'))

basedir = path.abspath(path.dirname(__file__))

class Config(object):
    FLASK_APP="flask_app"
    SQLALCHEMY_DATABASE_URI = getenv("DATABASE_URL", "sqlite:///addressbook.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    AWS_SECRET = environ.get("AWS_SECRET")
    AWS_KEY = environ.get("AWS_KEY")
    S3_BUCKET = 'image-file-uploads'
    S3_REGION = 'us-west-1'

class ProdConfig(Config):
    ENV='production'

class DevConfig(Config):
    ENV='development'
