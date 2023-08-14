# React work diart randomaker

This is a React + NextJS + FASTAPI web project, designed to quickly and randomly arrange our preset work diary.

## 1.Frontend

### 1.1 Setup

1. Install Node.js
2. `cd` into `./frontend` folder, run `npm install` to install relate package.
3. Check these files, change all url to your own ip addr.
4. Make sure your computer have DOCKER, then run `docker build -t work-diary .`.
5. Run server - `docker run -p 3000:3000 work-diary`.
6. Open your browser, go to `http://localhost:3000`.

## 2.Backend

### 1.1 Setup

1. Install python>=3.10.4
2. `cd` into `./backend` folder, create virtual environment with - `virtualenv pyweb`.
3. Enter virtual environment.
4. Run `pip3 install -r requirement.txt` to install all dependent lib.
5. Connect your mysql database or other in `./backend/database.py`
6. Run `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

