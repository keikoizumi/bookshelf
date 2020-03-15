# coding:utf-8
from bottle import request, route, get, post, hook, response, static_file, template, redirect, run
from selenium import webdriver 
import mysql.connector
import datetime
import os.path
import random   
import string 
import random
import time
import json
import os

import admin


#status
KEY = 'KEY'
RENTALINFO = 'RENTALINFO'
RENTAL = 'RENTAL'
ALL = 'ALL'
DEL = 'DEL'

#ファイルパス
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

#CSS
@route('/static/css/<filename:path>')
def send_static_css(filename):
    return static_file(filename, root=f'{STATIC_DIR}/css')

#JS
@route('/static/js/<filename:path>')
def send_static_js(filename):
    return static_file(filename, root=f'{STATIC_DIR}/js')

#img
@route('/static/img/<filename:path>')
def send_static_img(filename):
    return static_file(filename, root=f'{STATIC_DIR}/img')

#rootの場合
@route("/")
def index():
    return template('top')

@post('/allBooks')
def allBooks():
    #値取得
    data = request.json
    qerytype = ALL

    book = dbconn(qerytype, data)

    #ID NULLチェック
    if isBookCheck(book):
        print('checkedbook:')
        #json作成
        jsonBook = makeJson(book)
        print(type(jsonBook))
        return jsonBook
    else:
        return None

#searchBook
@post('/searchBook')
def searchBook():
    #値取得
    data = request.json
    sendkey = data['sendkey']
    qerytype = KEY
    book = dbconn(qerytype, sendkey)

    #ID NULLチェック
    if isBookCheck(book):
        print('checkedbook:')
        #json作成
        jsonBook = makeJson(book)
        print(type(jsonBook))
        return jsonBook
    else:
        return None

#rentalInfo
@post('/rentalInfo')
def rentalInfo():
    #値取得
    data = request.json
    sendkey = data['sendkey']
    qerytype = RENTALINFO
    book = dbconn(qerytype, sendkey)

    #ID NULLチェック
    if isBookCheck(book):
        print('checkedbook:')
        #json作成
        jsonBook = makeJson(book)
        print(type(jsonBook))
        return jsonBook
    else:
        return None
#rentalBook
@post('/rentalBook')
def rentalBook():
    #値取得
    data = request.json
    qerytype = RENTAL

    dbconn(qerytype, data)

    book = {
        'return': True
    }
    jsonBook = makeJson(book)

    return jsonBook
i = 0
def isBookCheck(book):
    if book == None:
        print('チェックNG')
        global i
        i += 1
        print('i')
        print(i)
        if i < 5:
            return None 
        else:
            return True
    else:
        print('チェックOK')
        return True

def makeJson(book):
    jsonBook = jsonDumps(book)
    return jsonBook
    
def jsonDumps(book):
    book = json.dumps(book)
    return isTypeCheck(book)

def isTypeCheck(jsonBook):
    if type(jsonBook) is str:
        return jsonBook
    else:
        jsonDumps(jsonBook)
    

def dbconn(qerytype, sendkey):
    print("q")
    print(qerytype)
    print(sendkey)

    f = open('./conf/prop.json', 'r')
    info = json.load(f)
    f.close()
    #DB設定
    
    conn = mysql.connector.connect(
            host = info['host'],
            port = info['port'],
            user = info['user'],
            password = info['password'],
            database = info['database'],
    )
    
    cur = conn.cursor(dictionary=True)   
    
    try:    
        #接続クエリ
        if  qerytype == ALL:
            sql = "SELECT id,area,title,rental_status,rental_user_name,CAST(rental_start_dt AS CHAR) as rental_start_dt FROM bookshelf.books_info WHERE del_flg = 0 ORDER BY update_dt DESC"
        elif qerytype == KEY:
            sql = "SELECT id,area,title,rental_status,CAST(rental_start_dt AS CHAR) as rental_start_dt FROM bookshelf.books_info WHERE del_flg = 0 AND title LIKE '%"+sendkey+'%'"' ORDER BY create_dt DESC LIMIT 100 "
        elif qerytype == RENTALINFO:
            sql = "SELECT id,rental_user_name, CAST(rental_start_dt AS CHAR) as rental_start_dt, CAST(rental_end_plan_dt AS CHAR) as rental_end_plan_dt FROM bookshelf.books_info WHERE id = '"+sendkey+"'"
        elif qerytype == RENTAL:
            #sql = "DELETE FROM bookshelftable where img_id = '"+sendkey+"'"

            rentalid = sendkey['id']

            print(rentalid)

            rental_status = '1'

            rental_user_name = sendkey['InputEmail1']
            print(rental_user_name)

            now = datetime.datetime.now()
            rental_start_dt = "{0:%Y-%m-%d %H:%M:%S}".format(now)
 
            rental_end_plan_dt = sendkey['inputDate']
            print(rental_end_plan_dt)

            if rental_end_plan_dt == '':
                rental_end_plan_dt = NULL

            sql="UPDATE bookshelf.books_info SET rental_status = '"+rental_status+"', rental_user_name = '"+rental_user_name+"',rental_start_dt = '"+rental_start_dt+"', rental_end_plan_dt = '"+rental_end_plan_dt+"', update_dt = '"+rental_start_dt+"' WHERE id = '"+rentalid+"'"
        
        print(sql)

        #クエリ発行
        if qerytype == RENTAL:
            cur.execute(sql)
            conn.commit()
        else:
            cur.execute(sql)
            cur.statement    
            book = cur.fetchall()

        if book is not None:
            return book
        else:
            return None
    except:
        print("DBエラーが発生しました")
        return None
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    run(host='localhost', port=8087, reloader=True, debug=True)