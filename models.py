from sqlalchemy.orm import as_declarative, Mapped, mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, JSON

import datetime





@as_declarative()
class Base:
    pass


class SessionORM(Base):
    __tablename__ = 'sessions'
    'saves work sessions and neural activity'
    id: Mapped[int] = mapped_column(primary_key=True,index=True)


class UsersORM(Base):
    __tablename__ = 'users'
    'saves user data'
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]