from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db import db

class Address(db.Model):
  __tablename__ = 'address_table'
  id = Column(Integer, primary_key = True)
  street = Column(String(75))
  zip_code = Column(String(9))
  state = Column(String(75))
  state_initials = Column(String(3)) 
  city = Column(String(75))
  person_id = Column(Integer, ForeignKey('person_table.id', ondelete='CASCADE'))
  person = relationship('Person', back_populates='address')


  def to_dict(self):
      
    return {
      'street': self.street,
      'zip_code': self.zip_code,
      'city': self.city,
      'state': self.state,
      'state_initials': self.state_initials,
      'id': self.id,
      'person_id': self.person_id,
    }

  def __init__(self, street, city, state, zip_code, state_initials, person_id):
    self.street = street
    self.city = city
    self.state = state
    self.zip_code = zip_code
    self.state_initials = state_initials
    self.person_id = person_id
 
 

