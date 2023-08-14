from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


engine = create_engine(
    "mysql+pymysql://root:MysqlPassword@localhost:3306/workDiary",
    # echo=True,  # echo 设为 True 会打印出实际执行的 sql，调试的时候更方便
    future=True,  # 使用 SQLAlchemy 2.0 API，向后兼容
    pool_size=5,  # 连接池的大小默认为 5 个，设置为 0 时表示连接无限制
    pool_recycle=3600,  # 设置时间以限制数据库自动断开
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
