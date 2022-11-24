def convert_person_to_snake_case(content):

  converted_values = {}

  if 'firstName' in content:
    converted_values['first_name'] = content['firstName']

  if 'lastName' in content:
    converted_values['last_name'] = content['lastName']

  if 'email' in content:
    converted_values['email'] = content['email']

  if 'phoneNumber' in content:
    converted_values['phone_number'] = content['phoneNumber']

  if 'company' in content:
    converted_values['company'] = content['company']

  def create(Person):
    person = Person(**converted_values)

    return person
    
  return {
    'updates': converted_values,
    'create': create
  }

def convert_address_to_snake_case(content, id):

  converted_values = {}

  if 'street' in content:
    converted_values['street'] = content['street']

  if 'zipCode' in content:
    converted_values['zip_code'] = content['zipCode']

  if 'state' in content:
    converted_values['state'] = content['state']

  if 'stateInitials' in content:
    converted_values['state_initials'] = content['stateInitials']

  if 'city' in content:
    converted_values['city'] = content['city']

  if 'personId' in content:
    converted_values['person_id'] = id

  def create(Address):
    address = Address(**converted_values)

    return address

  return {
    'updates': converted_values,
    'create': create
  }
