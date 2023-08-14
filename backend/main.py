from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from dependencies import get_db
from models import User, PresetData
from schemas import LoginInfo, LoginRes, PresetDetail, PresetList
from typing import Union
from datetime import datetime
import arrow


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 用户登录接口
@app.post('/login', response_model=Union[LoginRes, None])
async def method_name(login_info: LoginInfo, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == login_info.username,
                              User.password == login_info.password)
    result = db.execute(stmt).scalars().all()
    if len(result) > 0:
        user_info = result[0].to_dict()
        print(user_info)

        now = arrow.now()
        expire = now.shift(minutes=30).format('YYYY:MM:DD HH:mm:ss')
        print(expire)

        # 修改用户的登录状态
        stmt = update(User).where(User.username == login_info.username).values(
            isLogin=True, expireDate=expire).execution_options(synchronize_session="fetch")

        db.execute(stmt)
        db.commit()

        return {"id": user_info["id"], "username": user_info["username"]}

    return None


@app.get('/check_is_login')
async def check_is_login(username: str, db: Session = Depends(get_db)):
    print(username)
    stmt = select(User).where(User.username == username)
    result = db.execute(stmt).scalars().all()
    if len(result) > 0:
        result = result[0].to_dict()
        print(result)
        return {"result": result["isLogin"]}


# logout
@app.get('/logout')
async def logout(username: str, db: Session = Depends(get_db)):
    # 修改用户的登录状态
    stmt = update(User).where(User.username == username).values(
        isLogin=False).execution_options(synchronize_session="fetch")
    db.execute(stmt)
    db.commit()


# 新增一条预设数据
@app.post('/add_one_preset')
async def method_name(preset_detail: PresetDetail, db: Session = Depends(get_db)):
    detail1 = PresetData(detail=preset_detail.detail)
    try:
        db.add(detail1)
        db.commit()
        return {"msg": "success", "status": 1}
    except:
        print("添加失败")
        db.rollback()
        return {"msg": "fail", "status": 0}


# 获取所有预设数据
@app.get('/get_preset_list')
async def method_name(db: Session = Depends(get_db)):
    stmt = select(PresetData)
    result = db.execute(stmt).scalars().all()
    result = list(map(lambda x: x.to_dict(), result))
    return {"result": result}


@app.patch('/update_preset_list')
async def method_name(data: PresetList, db: Session = Depends(get_db)):
    print(data.presetList[0])
    for item in data.presetList:
        stmt = update(PresetData).where(PresetData.id == item["id"]).values(
            isDisable=item["isDisable"]).execution_options(synchronize_session="fetch")
        db.execute(stmt)
        db.commit()
    

@app.get('/')
async def root():
    return {'message': 'Hello World'}
