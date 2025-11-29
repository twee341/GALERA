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
    duration: Mapped[int] = mapped_column() # duration in seconds
    neural_data: Mapped[dict] = mapped_column(JSON)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))


    user: Mapped["UsersORM"] = relationship(back_populates="sessions")

class UsersORM(Base):
    __tablename__ = 'users'
    'saves user data'
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()

    sessions: Mapped[list["SessionORM"]] = relationship(back_populates="user", lazy="selectin")

    