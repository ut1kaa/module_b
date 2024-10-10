from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class FileAccess(Base):
    __tablename__ = 'file_accesses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(Integer, ForeignKey('files.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    type = Column(String(50), nullable=False)

    file = relationship("File", back_populates="file_accesses")
    user = relationship("User", back_populates="file_accesses")

    def __repr__(self):
        return f"<FileAccess(file_id={self.file_id}, user_id={self.user_id}, type={self.type})>"
