from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db import db

class Person(db.Model):
  __tablename__ = 'person_table'
  id = Column(Integer, primary_key = True)
  first_name = Column(String(50))
  last_name = Column(String(50))
  email = Column(String(100))
  company = Column(String(50))
  phone_number = Column(String(20)) 
  address = relationship('Address', back_populates='person', cascade='all, delete', passive_deletes=True) 
  
  def to_dict(self):
    return {
      'first_name': self.first_name,
      'last_name': self.last_name,
      'email': self.email,
      'phone_number': self.phone_number,
      'company': self.company,
      'id': self.id,
    }
 

