from flask_app import app

from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.engine import Engine
from sqlalchemy import event

db = SQLAlchemy(app)

def commit():
  db.session.commit()

def save(doc): 
  db.session.add(doc)
  db.session.commit()

def enable_foreign_keys():
  @event.listens_for(Engine, "connect")
  def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


