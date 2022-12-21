import os

from urllib.parse import urlparse

from flask import Flask, request

from flask_cors import CORS

import logging

import boto3

from botocore.exceptions import ClientError

app = Flask(__name__) 

CORS(app)

app.config.from_object("config.DevConfig")

from db import save, commit, enable_foreign_keys, db

#helper functions
from utils.convert_camel_case import convert_person_to_snake_case, convert_address_to_snake_case

from models.person import Person
from models.address import Address

s3_client = boto3.client(
  "s3",
  aws_access_key_id= app.config['AWS_KEY'],
  aws_secret_access_key= app.config['AWS_SECRET']
)

s3_resource = boto3.resource(
  "s3",
  aws_access_key_id= app.config['AWS_KEY'],
  aws_secret_access_key= app.config['AWS_SECRET']
)

# foreign keys must be 
# enabled for sqlite 
enable_foreign_keys()

@app.route("/api")
def index():
  return { 'msg': 'ok' }

# GET /persons
@app.route("/api/persons")
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
@app.route("/api/persons/<id>")
def get_all_info(id):
  person = db.session.query(Person, Address).filter(Person.id == id).outerjoin(Address).first()

  contact, address = person[0], person[1]

  address = address.to_dict() if address is not None else {}

  print({ **contact.to_dict(), **address })

  return {'msg': 'ok', 'contact': { **contact.to_dict(), **address } }

# POST /person
@app.route("/api/person", methods = ['POST'])
def create_person():
  print(request.json)
  create_or_update = convert_person_to_snake_case(request.json)

  person = create_or_update['create'](Person)

  print(person.to_dict())
  save(person)

  return { 'msg': 'ok', 'contact': person.to_dict() }

# PUT /person
@app.route('/api/person/<id>', methods = ['PUT', 'PATCH'])
def update_person(id):
  create_or_update = convert_person_to_snake_case(request.json)

  updates = create_or_update['updates']

  person = Person.query.filter(Person.id == id).update(updates)

  commit()

  return { 'msg': 'ok' }

# DELETE /person 
# cascade delete person and address
@app.route('/api/person/<id>', methods = ['DELETE'])
def delete_person(id):
  Person.query.filter(Person.id == id).delete()

  commit()

  return { 'msg': 'address and person deleted!' }

# GET /address
@app.route("/api/address/<id>", methods=['GET'])
def find_address(id):
  address = Address.query.filter(Address.person_id == id).first()

  if address is not None:
    return { 'msg': 'ok', 'address': address.to_dict() }
  else:
    return { 'msg': 'not found', 'address': None }

# POST /address
@app.route("/api/address/<id>", methods = ['POST'])
def create_address(id):

  create_or_update = convert_address_to_snake_case(request.json, id)

  address = create_or_update['create'](Address)

  save(address)
  print(address.to_dict())

  return { 'msg': 'ok', 'address': 'ok' }

# PUT /address/<person_id>
@app.route("/api/address/<id>", methods = ['PUT'])
def update_address(id):


  create_or_update = convert_address_to_snake_case(request.json, id)

  updates = create_or_update['updates']

  try:
    result = db.session.query(Address).filter(Address.person_id == id).update(updates)
    print('*****RESULT******: ', result)
  except:
    print('An error occurred in the db query')

  commit()

  return { 'msg': 'ok' }
  

# DELETE /address
@app.route("/api/address/<person_id>", methods = ['DELETE'])
def delete_address(person_id):
  Address.query.filter(Address.person_id == person_id).delete()

  commit()

  return { 'msg': 'address and person deleted!' }

@app.route("/api/contact/profile-picture", methods = ['POST'])
def delete_profile_picture():
  S3_BUCKET = app.config['S3_BUCKET']
  parsed_url = urlparse(request.json['url'])
  
  final_url = parsed_url.path.replace('/', '')
  
  existingObject = s3_resource.Object(bucket_name = S3_BUCKET, key = final_url )

  if existingObject is not None:
    existingObject.delete()

    return { 'msg': f'{final_url} file has been deleted' }

  return { 'msg': 'could not find file in s3 bucket'}

# GET /search
@app.route("/api/search", methods=['POST'])
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

@app.route('/api/sign-s3')
def sign_s3():
  S3_BUCKET = app.config['S3_BUCKET']
  
  file_name = request.args.get('file_name')
  file_type = request.args.get('file_type')

  try:
    existingObj = s3_resource.Object(bucket_name = S3_BUCKET, key = file_name)

    if existingObj is not None:
      print('object exists!!!!!')
  except ClientError as e:
    logging.error(e)


  try:
    response = s3_client.generate_presigned_post(
    Bucket = S3_BUCKET,
    Key = file_name,
    Fields = { 'acl': 'public-read', 'Content-Type': file_type },
    Conditions = [
      {'acl': 'public-read'},
      {'Content-Type': file_type}
    ],
    ExpiresIn = 360
  )
  except ClientError as e:
    logging.error(e)

  return {
    'data': response,
    'url': 'https://%s.s3.%s.amazonaws.com/%s' % (S3_BUCKET, app.config['S3_REGION'], file_name)
  }
  

if __name__ == '__main__':
  app.run(host='0.0.0.0')
