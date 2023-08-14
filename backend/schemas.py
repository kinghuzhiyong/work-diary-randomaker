from pydantic import BaseModel


class LoginInfo(BaseModel):
    username: str
    password: str


class LoginRes(BaseModel):
    id: int
    username: str


# /add_one_preset
class PresetDetail(BaseModel):
    detail: str


class PresetList(BaseModel):
    presetList: list