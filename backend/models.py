from sqlalchemy.orm import declarative_base, relationship, Session, Mapped, mapped_column
from database import engine
from sqlalchemy import String
from datetime import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True)
    password: Mapped[str] = mapped_column(String(30))
    isLogin: Mapped[bool] = mapped_column(default=False)
    expireDate: Mapped[datetime]

    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}


class PresetData(Base):
    __tablename__ = 'presets'
    id: Mapped[int] = mapped_column(primary_key=True)
    detail: Mapped[str] = mapped_column(String(500), unique=True)
    isDisable: Mapped[bool] = mapped_column(default=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}


# 调用 create_all 创建所有模型
Base.metadata.create_all(engine)
