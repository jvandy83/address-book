from flask import Flask, request

from functools import reduce

from pprint import pprint

from flask_cors import CORS

app = Flask(__name__) 

CORS(app)

database_uri = 'sqlite:///addressbook.db'

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['FLASK_ENV'] = 'development'

from db import save, commit, enable_foreign_keys, db

#helper functions
from utils.convert_camel_case import convert_person_to_snake_case, convert_address_to_snake_case

from models.person import Person
from models.address import Address


# foreign keys must be 
# enabled for sqlite 
enable_foreign_keys()

@app.route("/")
def index():
  return { 'msg': 'ok' }

# GET /persons
@app.route("/persons")
def find_persons():
  
  persons = db.session.query(Person).join(Address, Person.address == None).order_by(Person.first_name).all()
  rows = db.session.query(Person, Address).join(Address).order_by(Person.first_name).all()

  results = []
  for row in rows:
    merged = reduce(lambda x, y: dict(x, **y), (row[0].to_dict(), row[1].to_dict()))
    results.append(merged)

  for person in persons:
    results.append(person.to_dict())

  print(results)

  return { 'contacts': results }

# GET /person/<id>
@app.route("/persons/<id>")
def find_person(id):
  person = Person.query.get(id) 
  address = Address.query.filter(Address.person_id == id).first()
  # person = Person.query.get(id)

  result = {}

  if address is not None:
    result = reduce(lambda x, y: dict(x, **y), (person.to_dict(), address.to_dict()))
  else:
    result = person.to_dict()

  print(result)

  return { 'contact': result }

# POST /person
@app.route("/person", methods = ['POST'])
def create_person():
  create_or_update = convert_person_to_snake_case(request.json)

  person = create_or_update['create'](Person)

  print(person.to_dict())
  save(person)

  return { 'msg': 'ok', 'contact': person.to_dict() }

# PUT /person
@app.route('/person/<id>', methods = ['PUT', 'PATCH'])
def update_person(id):

  create_or_update = convert_person_to_snake_case(request.json)

  print('create_or_update: ', create_or_update)

  updates = create_or_update['updates']

  person = Person.query.filter(Person.id == id).update(updates)
  print('person: ', person)

  commit()

  return { 'msg': 'ok' }

# DELETE /person 
# cascade delete person and address
@app.route('/person/<id>', methods = ['DELETE'])
def delete_person(id):
  Person.query.filter(Person.id == id).delete()

  commit()

  return { 'msg': 'address and person deleted!' }

# GET /address
@app.route("/address/<id>", methods=['GET'])
def find_address(id):
  address = Address.query.filter(Address.person_id == id).first()
  print('*****ADDRESS****** ', address)

  if address is not None:
    return { 'msg': 'ok', 'address': address.to_dict() }
  else:
    return { 'msg': 'not found', 'address': None }

# POST /address
@app.route("/address/<id>", methods = ['POST'])
def create_address(id):
  print('****REQUEST.JSON***** ', request.json)

  create_or_update = convert_address_to_snake_case(request.json)

  address = create_or_update['create'](Address)

  save(address)
  print(address.to_dict())

  return { 'msg': 'ok', 'address': 'ok' }

# PUT /address/<person_id>
@app.route("/address/<id>", methods = ['PUT'])
def update_address(id):

  print('***REQUEST_JSON***', request.json)

  create_or_update = convert_address_to_snake_case(request.json)

  updates = create_or_update['updates']

  print('****UPDATES****', updates)

  address = db.session.query(Address).filter(Address.person_id == id).update(updates)

  print('****ADDRESS****', address)
  commit()


  return { 'msg': 'ok' }
  

# DELETE /address
@app.route("/address/<person_id>", methods = ['DELETE'])
def delete_address(person_id):
  Address.query.filter(Address.person_id == person_id).delete()

  commit()

  return { 'msg': 'address and person deleted!' }

# GET /search
@app.route("/search", methods=['POST'])
def search():
  # query = request.args.get("query") # here query will be the search inputs name
  # db.session.query(Person, Address).join(Address).all().filter(Person)
  rows = db.session.query(Person, Address).join(Address).filter(Person.first_name.like('%'+request.json['data']+'%')).order_by(Person.first_name).all()
  results = []
  for row in rows:
    merged = reduce(lambda x, y: dict(x, **y), (row[0].to_dict(), row[1].to_dict()))
    results.append(merged)
  # persons = Address.query.join(Person, Address.person_id == Person.id).all()
  print(results)
  return { 'msg': 'ok', 'matches': results }

if __name__ == '__main__':
  app.run(debug=True)
