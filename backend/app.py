from flask import Flask, request, make_response

from sqlalchemy import or_, and_, outerjoin

from flask_cors import CORS

from blue_print.blue_print import api_blue_print

app = Flask(__name__) 
app.register_blueprint(api_blue_print)

CORS(app)

database_uri = 'sqlite:///addressbook.db'

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

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

  persons = db.session.query(Person, Address).outerjoin(Address).order_by().all()

  print(persons)

  if persons is not None:

    results = []

    for person in persons:

      contact, address = person[0], person[1]

      address = address.to_dict() if address is not None else {}

      results.append({**contact.to_dict(), **address })

    return { 'msg': 'ok', 'contacts': results }

  else:

    return { 'msg': 'not found', 'contacts': [] }

# GET /persons/<id>
@app.route("/persons/<id>")
def find_person(id):
  print('******GET REQUEST BEING CALLED******')
  person = db.session.query(Person, Address).filter(Person.id == id).outerjoin(Address).first()


  contact, address = person[0], person[1]

  address = address.to_dict() if address is not None else {}

  return {'msg': 'ok', 'contact': { **contact.to_dict(), **address } }

# POST /person
@app.route("/person", methods = ['POST'])
def create_person():
  print(request.json)
  create_or_update = convert_person_to_snake_case(request.json)

  person = create_or_update['create'](Person)

  print(person.to_dict())
  save(person)

  return { 'msg': 'ok', 'contact': person.to_dict() }

# PUT /person
@app.route('/person/<id>', methods = ['PUT', 'PATCH'])
def update_person(id):
  print('******PUT REQUEST BEING CALLED******')
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

  if address is not None:
    return { 'msg': 'ok', 'address': address.to_dict() }
  else:
    return { 'msg': 'not found', 'address': None }

# POST /address
@app.route("/address/<id>", methods = ['POST'])
def create_address(id):

  create_or_update = convert_address_to_snake_case(request.json, id)

  address = create_or_update['create'](Address)

  save(address)
  print(address.to_dict())

  return { 'msg': 'ok', 'address': 'ok' }

# PUT /address/<person_id>
@app.route("/address/<id>", methods = ['PUT'])
def update_address(id):

  print('***REQUEST_JSON***', request.json)

  create_or_update = convert_address_to_snake_case(request.json, id)

  updates = create_or_update['updates']

  db.session.query(Address).filter(Address.person_id == id).update(updates)

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
  
  search = request.json['data']

  rows = db.session.query(Person, Address).filter(Person.first_name.ilike('%'+search+'%')).outerjoin(Address).order_by().all()

  results = []
  for row in rows:
    
    contact, address = row[0], row[1]
    address = address.to_dict() if address is not None else {}
    results.append({**contact.to_dict(), **address})
  
  print(results)
  return { 'msg': 'ok', 'matches': results }

if __name__ == '__main__':
  app.run(debug=True)
