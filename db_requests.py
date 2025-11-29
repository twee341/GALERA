import asyncio
import json
import logging
from typing import Dict
import datetime
import random

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from models import *

DATABASE = "sqlite+aiosqlite:///database.db"

class Database:

    def __init__(self):
        self.__async_engine = create_async_engine(url=DATABASE,
                                                  # echo=True,
                                                  )
        self.__async_session_factory = async_sessionmaker(self.__async_engine)
        
        asyncio.run(self._init_models())





    async def _init_models(self) -> None:

        async with self.__async_engine.begin() as conn:
            # await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)


    async def get_accidents(self) -> list[AccidentsORM]:
        async with self.__async_session_factory() as session:
            stmt = select(AccidentsORM)
            result = await session.execute(stmt)
            finit = []
            for row in result.scalars():
                finit.append({'location_id': row.location_id, 'date': row.date.strftime("%Y-%m-%d %H:%M:%S"), 'accident_type': row.accident_type, 'id': row.id})             
            return finit