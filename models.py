from sqlalchemy.orm import as_declarative, Mapped, mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, JSON

import datetime





@as_declarative()
class Base:
    pass




class AccidentsORM(Base):
    __tablename__ = 'accidents'

    id: Mapped[int] = mapped_column(primary_key=True,index=True)