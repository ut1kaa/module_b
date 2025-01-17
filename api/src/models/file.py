from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

# Base = declarative_base()

from . import Base

class File(Base):
    __tablename__ = 'files'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_id = Column(Integer, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="files")
    file_accesses = relationship("FileAccess", back_populates="file")

    def __repr__(self):
        return f"<File(name={self.name}, file_id={self.file_id}, user_id={self.user_id})>"
